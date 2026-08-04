import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAdminOperations0000000000005 implements MigrationInterface {
  name = 'CreateAdminOperations0000000000005';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS staff_presence (
        user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        status varchar(32) NOT NULL DEFAULT 'online',
        last_seen_at timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS admin_settings (
        key varchar(120) PRIMARY KEY,
        value jsonb NOT NULL DEFAULT '{}'::jsonb,
        updated_by_user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        actor_user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        actor_email varchar(255) NOT NULL,
        action varchar(80) NOT NULL,
        target_type varchar(80) NOT NULL,
        target_id varchar(160),
        metadata jsonb,
        created_at timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(
      'CREATE INDEX IF NOT EXISTS idx_staff_presence_last_seen ON staff_presence (last_seen_at DESC)',
    );
    await queryRunner.query(
      'CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs (created_at DESC)',
    );
    await queryRunner.query('CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs (action)');
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS audit_logs');
    await queryRunner.query('DROP TABLE IF EXISTS admin_settings');
    await queryRunner.query('DROP TABLE IF EXISTS staff_presence');
  }
}
