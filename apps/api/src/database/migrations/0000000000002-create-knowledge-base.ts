import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateKnowledgeBase0000000000002 implements MigrationInterface {
  name = 'CreateKnowledgeBase0000000000002';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS vector');
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS pgcrypto');
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS products (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name varchar(120) NOT NULL,
        slug varchar(160) NOT NULL UNIQUE,
        "order" integer NOT NULL DEFAULT 0,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        parent_id uuid REFERENCES categories(id) ON DELETE SET NULL,
        name varchar(120) NOT NULL,
        slug varchar(160) NOT NULL,
        path varchar(500) NOT NULL,
        level integer NOT NULL DEFAULT 0,
        "order" integer NOT NULL DEFAULT 0,
        is_active boolean NOT NULL DEFAULT true,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT uq_categories_product_parent_slug UNIQUE (product_id, parent_id, slug)
      )
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS knowledge_base_articles (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        category_id uuid NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
        category_path varchar(500),
        name varchar(180) NOT NULL,
        slug varchar(160) NOT NULL UNIQUE,
        type varchar(32) NOT NULL DEFAULT 'article',
        content_html text,
        excerpt varchar(300),
        question varchar(300),
        answer_html text,
        search_text text,
        embedding vector(1536),
        embedding_model varchar(120),
        embedding_dimensions integer,
        embedding_status varchar(32) NOT NULL DEFAULT 'pending',
        embedded_at timestamptz,
        published boolean NOT NULL DEFAULT false,
        featured boolean NOT NULL DEFAULT false,
        "order" integer NOT NULL DEFAULT 0,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(
      'CREATE INDEX IF NOT EXISTS idx_categories_product_parent ON categories (product_id, parent_id)',
    );
    await queryRunner.query(
      'CREATE INDEX IF NOT EXISTS idx_kb_articles_product_category ON knowledge_base_articles (product_id, category_id)',
    );
    await queryRunner.query(
      'CREATE INDEX IF NOT EXISTS idx_kb_articles_published_type ON knowledge_base_articles (published, type)',
    );
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_kb_articles_search_text
      ON knowledge_base_articles
      USING gin (to_tsvector('english', coalesce(search_text, '')))
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_kb_articles_embedding
      ON knowledge_base_articles
      USING ivfflat (embedding vector_cosine_ops)
      WITH (lists = 100)
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS knowledge_base_articles');
    await queryRunner.query('DROP TABLE IF EXISTS categories');
    await queryRunner.query('DROP TABLE IF EXISTS products');
  }
}
