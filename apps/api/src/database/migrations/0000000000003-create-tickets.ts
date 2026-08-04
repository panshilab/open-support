import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTickets0000000000003 implements MigrationInterface {
  name = 'CreateTickets0000000000003';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS tickets (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        product_id uuid REFERENCES products(id) ON DELETE SET NULL,
        category_id uuid NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
        category_path varchar(500) NOT NULL,
        title varchar(180) NOT NULL,
        description_html text NOT NULL,
        status varchar(32) NOT NULL DEFAULT 'open',
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS ticket_comments (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        ticket_id uuid NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
        author_user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        author_email varchar(255) NOT NULL,
        content_html text NOT NULL,
        is_staff boolean NOT NULL DEFAULT false,
        is_system boolean NOT NULL DEFAULT false,
        created_at timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS ticket_seen_states (
        ticket_id uuid PRIMARY KEY REFERENCES tickets(id) ON DELETE CASCADE,
        customer_seen_at timestamptz,
        staff_seen_at timestamptz
      )
    `);
    await queryRunner.query('CREATE INDEX IF NOT EXISTS idx_tickets_user ON tickets (user_id)');
    await queryRunner.query('CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets (status)');
    await queryRunner.query(
      'CREATE INDEX IF NOT EXISTS idx_ticket_comments_ticket ON ticket_comments (ticket_id)',
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS ticket_seen_states');
    await queryRunner.query('DROP TABLE IF EXISTS ticket_comments');
    await queryRunner.query('DROP TABLE IF EXISTS tickets');
  }
}
