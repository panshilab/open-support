/* eslint-disable no-await-in-loop */
import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import pg from 'pg';
import {
  buildSeedArticles,
  buildSeedTickets,
  seedCategories,
  seedProducts,
  type SeedCategory,
} from './ecommerce.seed-data';

const { Client } = pg;

interface Env {
  DATABASE_HOST: string;
  DATABASE_PORT: string;
  DATABASE_NAME: string;
  DATABASE_USER: string;
  DATABASE_PASSWORD: string;
  DATABASE_SSL: string;
}

async function main() {
  const env = loadEnv();
  const client = new Client({
    host: env.DATABASE_HOST,
    port: Number(env.DATABASE_PORT),
    database: env.DATABASE_NAME,
    user: env.DATABASE_USER,
    password: env.DATABASE_PASSWORD,
    ssl: env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
  });

  await client.connect();

  try {
    await client.query('BEGIN');
    const products = await seedProductRows(client);
    const categories = await seedCategoryRows(client, products);
    const users = await seedUsers(client);
    const articles = buildSeedArticles();
    const tickets = buildSeedTickets();

    await seedArticleRows(client, products, categories, articles);
    await seedTicketRows(client, products, categories, users, tickets);
    await client.query('COMMIT');

    console.log(
      JSON.stringify(
        {
          products: seedProducts.length,
          categories: seedCategories.length,
          articles: articles.length,
          tickets: tickets.length,
        },
        null,
        2,
      ),
    );
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    await client.end();
  }
}

async function seedProductRows(client: pg.Client) {
  const productIds = new Map<string, string>();

  for (const product of seedProducts) {
    const result = await client.query<{ id: string }>(
      `
        INSERT INTO products (name, slug, "order")
        VALUES ($1, $2, $3)
        ON CONFLICT (slug) DO UPDATE SET
          name = EXCLUDED.name,
          "order" = EXCLUDED."order",
          updated_at = now()
        RETURNING id
      `,
      [product.name, product.slug, product.order],
    );
    productIds.set(product.slug, result.rows[0].id);
  }

  return productIds;
}

async function seedCategoryRows(client: pg.Client, products: Map<string, string>) {
  const categoryIds = new Map<string, string>();
  const sortedCategories = [...seedCategories].sort((left, right) => {
    if (left.parentSlug === null && right.parentSlug !== null) {
      return -1;
    }

    if (left.parentSlug !== null && right.parentSlug === null) {
      return 1;
    }

    return left.order - right.order;
  });

  for (const category of sortedCategories) {
    const productId = requiredMapValue(products, category.productSlug);
    const parentId = category.parentSlug
      ? requiredMapValue(categoryIds, categoryKey(category.productSlug, category.parentSlug))
      : null;
    const path = await categoryPath(category, categoryIds, client);
    const level = category.parentSlug ? path.split(' / ').length - 1 : 0;
    const result = await client.query<{ id: string }>(
      `
        INSERT INTO categories (product_id, parent_id, name, slug, path, level, "order", is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, true)
        ON CONFLICT (product_id, parent_id, slug) DO UPDATE SET
          name = EXCLUDED.name,
          path = EXCLUDED.path,
          level = EXCLUDED.level,
          "order" = EXCLUDED."order",
          is_active = true,
          updated_at = now()
        RETURNING id
      `,
      [productId, parentId, category.name, category.slug, path, level, category.order],
    );
    categoryIds.set(categoryKey(category.productSlug, category.slug), result.rows[0].id);
  }

  return categoryIds;
}

async function seedUsers(client: pg.Client) {
  const admin = await upsertUser(
    client,
    'agent@seed.example.com',
    'Seed Support Agent',
    'support_agent',
  );
  const customer = await upsertUser(client, 'shopper@seed.example.com', 'Seed Shopper', 'user');

  return {
    agent: admin,
    customer,
  };
}

async function seedArticleRows(
  client: pg.Client,
  products: Map<string, string>,
  categories: Map<string, string>,
  articles: ReturnType<typeof buildSeedArticles>,
) {
  for (const article of articles) {
    const productId = requiredMapValue(products, article.productSlug);
    const categoryId = requiredMapValue(
      categories,
      categoryKey(article.productSlug, article.categorySlug),
    );
    const category = await client.query<{ path: string }>(
      'SELECT path FROM categories WHERE id = $1',
      [categoryId],
    );
    const categoryPathValue = category.rows[0].path;
    const searchText = [
      article.name,
      article.question,
      article.excerpt,
      article.contentHtml,
      article.answerHtml,
      categoryPathValue,
    ]
      .filter(Boolean)
      .join('\n')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    await client.query(
      `
        INSERT INTO knowledge_base_articles (
          product_id,
          category_id,
          category_path,
          name,
          slug,
          type,
          content_html,
          excerpt,
          question,
          answer_html,
          search_text,
          embedding_status,
          embedded_at,
          published,
          featured,
          "order"
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'ready', now(), $12, $13, $14)
        ON CONFLICT (slug) DO UPDATE SET
          product_id = EXCLUDED.product_id,
          category_id = EXCLUDED.category_id,
          category_path = EXCLUDED.category_path,
          name = EXCLUDED.name,
          type = EXCLUDED.type,
          content_html = EXCLUDED.content_html,
          excerpt = EXCLUDED.excerpt,
          question = EXCLUDED.question,
          answer_html = EXCLUDED.answer_html,
          search_text = EXCLUDED.search_text,
          published = EXCLUDED.published,
          featured = EXCLUDED.featured,
          "order" = EXCLUDED."order",
          updated_at = now()
      `,
      [
        productId,
        categoryId,
        categoryPathValue,
        article.name,
        article.slug,
        article.type,
        article.contentHtml,
        article.excerpt,
        article.question,
        article.answerHtml,
        searchText,
        article.published,
        article.featured,
        article.order,
      ],
    );
  }
}

async function seedTicketRows(
  client: pg.Client,
  products: Map<string, string>,
  categories: Map<string, string>,
  users: { agent: string; customer: string },
  tickets: ReturnType<typeof buildSeedTickets>,
) {
  for (const [index, ticket] of tickets.entries()) {
    const productId = requiredMapValue(products, ticket.productSlug);
    const categoryId = requiredMapValue(
      categories,
      categoryKey(ticket.productSlug, ticket.categorySlug),
    );
    const customerId = await upsertUser(client, ticket.customerEmail, ticket.customerName, 'user');
    const category = await client.query<{ path: string }>(
      'SELECT path FROM categories WHERE id = $1',
      [categoryId],
    );
    const ticketId = randomUUID();
    const existing = await client.query<{ id: string }>('SELECT id FROM tickets WHERE title = $1', [
      ticket.title,
    ]);
    const finalTicketId = existing.rows[0]?.id ?? ticketId;

    if (existing.rows.length === 0) {
      await client.query(
        `
          INSERT INTO tickets (
            id,
            user_id,
            product_id,
            category_id,
            category_path,
            title,
            description_html,
            status,
            created_at,
            updated_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, now() - ($9::int * interval '1 day'), now())
        `,
        [
          finalTicketId,
          customerId,
          productId,
          categoryId,
          category.rows[0].path,
          ticket.title,
          ticket.descriptionHtml,
          ticket.status,
          index + 1,
        ],
      );
    } else {
      await client.query(
        `
          UPDATE tickets SET
            user_id = $2,
            product_id = $3,
            category_id = $4,
            category_path = $5,
            description_html = $6,
            status = $7,
            updated_at = now()
          WHERE id = $1
        `,
        [
          finalTicketId,
          customerId,
          productId,
          categoryId,
          category.rows[0].path,
          ticket.descriptionHtml,
          ticket.status,
        ],
      );
    }

    await client.query('DELETE FROM ticket_comments WHERE ticket_id = $1', [finalTicketId]);
    for (const comment of ticket.comments) {
      const authorUserId = comment.author === 'agent' ? users.agent : customerId;
      const authorEmail =
        comment.author === 'agent' ? 'agent@seed.example.com' : ticket.customerEmail;

      await client.query(
        `
          INSERT INTO ticket_comments (ticket_id, author_user_id, author_email, content_html, is_staff)
          VALUES ($1, $2, $3, $4, $5)
        `,
        [finalTicketId, authorUserId, authorEmail, comment.contentHtml, comment.author === 'agent'],
      );
    }

    await client.query(
      `
        INSERT INTO ticket_seen_states (ticket_id, customer_seen_at, staff_seen_at)
        VALUES ($1, now(), CASE WHEN $2 IN ('replied', 'resolved') THEN now() ELSE NULL END)
        ON CONFLICT (ticket_id) DO UPDATE SET
          customer_seen_at = EXCLUDED.customer_seen_at,
          staff_seen_at = EXCLUDED.staff_seen_at
      `,
      [finalTicketId, ticket.status],
    );
  }
}

async function upsertUser(client: pg.Client, email: string, name: string, role: string) {
  const result = await client.query<{ id: string }>(
    `
      INSERT INTO users (email, name, role)
      VALUES ($1, $2, $3)
      ON CONFLICT (email) DO UPDATE SET
        name = EXCLUDED.name,
        role = EXCLUDED.role,
        updated_at = now()
      RETURNING id
    `,
    [email, name, role],
  );

  return result.rows[0].id;
}

async function categoryPath(
  category: SeedCategory,
  categoryIds: Map<string, string>,
  client: pg.Client,
) {
  if (!category.parentSlug) {
    return category.name;
  }

  const parentId = requiredMapValue(
    categoryIds,
    categoryKey(category.productSlug, category.parentSlug),
  );
  const parent = await client.query<{ path: string }>('SELECT path FROM categories WHERE id = $1', [
    parentId,
  ]);

  return `${parent.rows[0].path} / ${category.name}`;
}

function categoryKey(productSlug: string, categorySlug: string) {
  return `${productSlug}:${categorySlug}`;
}

function requiredMapValue(map: Map<string, string>, key: string) {
  const value = map.get(key);

  if (!value) {
    throw new Error(`Missing seed dependency: ${key}`);
  }

  return value;
}

function loadEnv(): Env {
  const envPath = resolve(process.cwd(), '.env');
  const envFile = readFileSync(envPath, 'utf8');
  const values = Object.fromEntries(
    envFile
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'))
      .map((line) => {
        const [key, ...valueParts] = line.split('=');
        return [key, valueParts.join('=').replace(/^"|"$/g, '')];
      }),
  ) as Partial<Env>;

  return {
    DATABASE_HOST: process.env.DATABASE_HOST ?? values.DATABASE_HOST ?? 'localhost',
    DATABASE_PORT: process.env.DATABASE_PORT ?? values.DATABASE_PORT ?? '5432',
    DATABASE_NAME: process.env.DATABASE_NAME ?? values.DATABASE_NAME ?? 'open_support',
    DATABASE_USER: process.env.DATABASE_USER ?? values.DATABASE_USER ?? 'postgres',
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD ?? values.DATABASE_PASSWORD ?? '',
    DATABASE_SSL: process.env.DATABASE_SSL ?? values.DATABASE_SSL ?? 'false',
  };
}

void main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
