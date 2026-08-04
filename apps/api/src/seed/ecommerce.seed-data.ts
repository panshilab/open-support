export interface SeedProduct {
  name: string;
  slug: string;
  order: number;
}

export interface SeedCategory {
  productSlug: string;
  parentSlug: string | null;
  name: string;
  slug: string;
  order: number;
}

export interface SeedArticle {
  productSlug: string;
  categorySlug: string;
  name: string;
  slug: string;
  type: 'article' | 'faq';
  excerpt: string;
  question: string | null;
  contentHtml: string | null;
  answerHtml: string | null;
  published: boolean;
  featured: boolean;
  order: number;
}

export interface SeedTicket {
  productSlug: string;
  categorySlug: string;
  customerEmail: string;
  customerName: string;
  title: string;
  descriptionHtml: string;
  status: 'open' | 'customer_reply' | 'replied' | 'resolved';
  comments: Array<{
    author: 'customer' | 'agent';
    contentHtml: string;
  }>;
}

export const seedProducts: SeedProduct[] = [
  { name: 'Storefront', slug: 'storefront', order: 1 },
  { name: 'Checkout', slug: 'checkout', order: 2 },
  { name: 'Orders', slug: 'orders', order: 3 },
  { name: 'Payments', slug: 'payments', order: 4 },
  { name: 'Shipping', slug: 'shipping', order: 5 },
  { name: 'Returns', slug: 'returns', order: 6 },
  { name: 'Customer Accounts', slug: 'customer-accounts', order: 7 },
  { name: 'Promotions', slug: 'promotions', order: 8 },
  { name: 'Inventory', slug: 'inventory', order: 9 },
  { name: 'Analytics', slug: 'analytics', order: 10 },
];

export const seedCategories: SeedCategory[] = [
  { productSlug: 'storefront', parentSlug: null, name: 'Catalog', slug: 'catalog', order: 1 },
  {
    productSlug: 'storefront',
    parentSlug: 'catalog',
    name: 'Products',
    slug: 'products',
    order: 1,
  },
  { productSlug: 'storefront', parentSlug: 'catalog', name: 'Search', slug: 'search', order: 2 },
  { productSlug: 'storefront', parentSlug: null, name: 'Themes', slug: 'themes', order: 2 },
  { productSlug: 'checkout', parentSlug: null, name: 'Cart', slug: 'cart', order: 1 },
  {
    productSlug: 'checkout',
    parentSlug: null,
    name: 'Checkout Settings',
    slug: 'checkout-settings',
    order: 2,
  },
  {
    productSlug: 'checkout',
    parentSlug: 'checkout-settings',
    name: 'Taxes',
    slug: 'taxes',
    order: 1,
  },
  {
    productSlug: 'orders',
    parentSlug: null,
    name: 'Order Management',
    slug: 'order-management',
    order: 1,
  },
  {
    productSlug: 'orders',
    parentSlug: 'order-management',
    name: 'Cancellations',
    slug: 'cancellations',
    order: 1,
  },
  {
    productSlug: 'payments',
    parentSlug: null,
    name: 'Payment Methods',
    slug: 'payment-methods',
    order: 1,
  },
  {
    productSlug: 'payments',
    parentSlug: 'payment-methods',
    name: 'Cards',
    slug: 'cards',
    order: 1,
  },
  {
    productSlug: 'payments',
    parentSlug: 'payment-methods',
    name: 'Wallets',
    slug: 'wallets',
    order: 2,
  },
  { productSlug: 'shipping', parentSlug: null, name: 'Carriers', slug: 'carriers', order: 1 },
  { productSlug: 'shipping', parentSlug: null, name: 'Tracking', slug: 'tracking', order: 2 },
  {
    productSlug: 'returns',
    parentSlug: null,
    name: 'Return Policies',
    slug: 'return-policies',
    order: 1,
  },
  { productSlug: 'returns', parentSlug: null, name: 'Refunds', slug: 'refunds', order: 2 },
  { productSlug: 'customer-accounts', parentSlug: null, name: 'Login', slug: 'login', order: 1 },
  {
    productSlug: 'customer-accounts',
    parentSlug: null,
    name: 'Profiles',
    slug: 'profiles',
    order: 2,
  },
  {
    productSlug: 'promotions',
    parentSlug: null,
    name: 'Discount Codes',
    slug: 'discount-codes',
    order: 1,
  },
  { productSlug: 'promotions', parentSlug: null, name: 'Gift Cards', slug: 'gift-cards', order: 2 },
  {
    productSlug: 'inventory',
    parentSlug: null,
    name: 'Stock Levels',
    slug: 'stock-levels',
    order: 1,
  },
  { productSlug: 'inventory', parentSlug: null, name: 'Warehouses', slug: 'warehouses', order: 2 },
  { productSlug: 'analytics', parentSlug: null, name: 'Reports', slug: 'reports', order: 1 },
  { productSlug: 'analytics', parentSlug: null, name: 'Events', slug: 'events', order: 2 },
];

const articleTopics = [
  ['storefront', 'products', 'Add product variants without breaking filters'],
  ['storefront', 'products', 'Fix products that are visible in admin but hidden online'],
  ['storefront', 'search', 'Improve search results for misspelled product names'],
  ['storefront', 'themes', 'Publish a new homepage banner safely'],
  ['checkout', 'cart', 'Recover carts after browser refresh'],
  ['checkout', 'checkout-settings', 'Require phone numbers at checkout'],
  ['checkout', 'taxes', 'Configure taxes for multiple states'],
  ['orders', 'order-management', 'Edit an order before fulfillment'],
  ['orders', 'cancellations', 'Cancel an order after payment authorization'],
  ['payments', 'cards', 'Resolve failed card payments'],
  ['payments', 'wallets', 'Enable Apple Pay and Google Pay'],
  ['shipping', 'carriers', 'Set carrier-specific shipping rates'],
  ['shipping', 'tracking', 'Send tracking emails after fulfillment'],
  ['returns', 'return-policies', 'Create a return window policy'],
  ['returns', 'refunds', 'Issue partial refunds for returned items'],
  ['customer-accounts', 'login', 'Help customers reset passwords'],
  ['customer-accounts', 'profiles', 'Update saved addresses and phone numbers'],
  ['promotions', 'discount-codes', 'Limit discounts to first-time customers'],
  ['promotions', 'gift-cards', 'Check gift card balance and expiry'],
  ['inventory', 'stock-levels', 'Prevent overselling when stock is low'],
  ['inventory', 'warehouses', 'Route orders to the nearest warehouse'],
  ['analytics', 'reports', 'Read conversion reports by channel'],
  ['analytics', 'events', 'Troubleshoot missing checkout events'],
] as const;

const ecommerceQuestions = [
  'How do I troubleshoot this?',
  'What should I check first?',
  'Why does this happen?',
  'How can a merchant configure this?',
  'What is the recommended workflow?',
];

export function buildSeedArticles(): SeedArticle[] {
  return Array.from({ length: 100 }, (_, index) => {
    const [productSlug, categorySlug, topic] = articleTopics[index % articleTopics.length];
    const isFaq = index % 3 === 0;
    const question = `${ecommerceQuestions[index % ecommerceQuestions.length]} ${topic}?`;
    const name = isFaq ? question : topic;
    const slug = `seed-${slugify(topic)}-${index + 1}`;
    const content = [
      `This guide explains how ecommerce support teams should handle ${topic.toLowerCase()}.`,
      'Start by confirming the merchant store, affected customer order, browser or payment context, and the exact time the issue occurred.',
      'Next, compare the store configuration with the latest order, product, inventory, promotion, and fulfillment records.',
      'If the issue affects customers at checkout, test in a private browser session and document screenshots before changing settings.',
      'Escalate to engineering only after reproducing the behavior and collecting the relevant order ID, customer email, and error message.',
    ];
    const answer = [
      `For ${topic.toLowerCase()}, verify the store settings, customer-visible behavior, and related order timeline.`,
      'Most issues are resolved by correcting configuration, clearing stale customer data, or retrying the affected workflow after the setting is saved.',
    ];

    return {
      productSlug,
      categorySlug,
      name,
      slug,
      type: isFaq ? 'faq' : 'article',
      excerpt: `${topic} for ecommerce support teams.`,
      question: isFaq ? question : null,
      contentHtml: isFaq ? null : toParagraphs(content),
      answerHtml: isFaq ? toParagraphs(answer) : null,
      published: true,
      featured: index < 12,
      order: index + 1,
    };
  });
}

export function buildSeedTickets(): SeedTicket[] {
  const statuses: SeedTicket['status'][] = ['open', 'customer_reply', 'replied', 'resolved'];
  const subjects = [
    ['checkout', 'cart', 'Cart empties when customer applies a discount code'],
    ['payments', 'cards', 'Card payment fails but customer was charged'],
    ['shipping', 'tracking', 'Tracking email was not sent after fulfillment'],
    ['inventory', 'stock-levels', 'Product sold after inventory reached zero'],
    ['returns', 'refunds', 'Customer received the wrong partial refund amount'],
    ['storefront', 'search', 'Search does not show a newly published product'],
    ['customer-accounts', 'login', 'Customer cannot receive password reset email'],
    ['promotions', 'gift-cards', 'Gift card balance is not updating after checkout'],
    ['orders', 'cancellations', 'Merchant cannot cancel an unfulfilled order'],
    ['analytics', 'events', 'Checkout conversion event is missing from report'],
  ] as const;

  return Array.from({ length: 20 }, (_, index) => {
    const [productSlug, categorySlug, title] = subjects[index % subjects.length];
    const customerNumber = index + 1;

    return {
      productSlug,
      categorySlug,
      customerEmail: `customer${customerNumber}@example.com`,
      customerName: `Seed Customer ${customerNumber}`,
      title: `${title} #${customerNumber}`,
      descriptionHtml: toParagraphs([
        `The merchant reported that ${title.toLowerCase()}.`,
        'This started after a recent catalog, checkout, or fulfillment update and is affecting real customer orders.',
      ]),
      status: statuses[index % statuses.length],
      comments: [
        {
          author: 'customer',
          contentHtml: toParagraphs([
            'Can you help us understand what changed and how to resolve this?',
          ]),
        },
        {
          author: 'agent',
          contentHtml: toParagraphs([
            'We are checking the store configuration, recent activity, and related order records.',
          ]),
        },
      ],
    };
  });
}

function toParagraphs(lines: string[]) {
  return lines.map((line) => `<p>${line}</p>`).join('');
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
