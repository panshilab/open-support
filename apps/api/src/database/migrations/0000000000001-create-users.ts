import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsers0000000000001 implements MigrationInterface {
  name = 'CreateUsers0000000000001';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS users (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        email varchar(255) NOT NULL UNIQUE,
        name varchar(120),
        role varchar(32) NOT NULL DEFAULT 'user',
        receive_email_notifications boolean NOT NULL DEFAULT true,
        receive_new_ticket_emails boolean NOT NULL DEFAULT true,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_users_role ON users (role)
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS users');
  }
}
