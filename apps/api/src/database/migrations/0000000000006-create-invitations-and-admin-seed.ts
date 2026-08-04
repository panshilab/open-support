import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInvitationsAndAdminSeed0000000000006 implements MigrationInterface {
  name = 'CreateInvitationsAndAdminSeed0000000000006';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS password_hash varchar(255),
      ADD COLUMN IF NOT EXISTS must_change_password boolean NOT NULL DEFAULT false
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS staff_invitations (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        email varchar(255) NOT NULL,
        role varchar(32) NOT NULL DEFAULT 'support_agent',
        token_hash varchar(255) NOT NULL UNIQUE,
        invited_by_user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        accepted_by_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
        expires_at timestamptz NOT NULL,
        accepted_at timestamptz,
        created_at timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(
      'CREATE INDEX IF NOT EXISTS idx_staff_invitations_email ON staff_invitations (email)',
    );
    await queryRunner.query(
      'CREATE INDEX IF NOT EXISTS idx_staff_invitations_expires_at ON staff_invitations (expires_at)',
    );
    await queryRunner.query(`
      INSERT INTO users (email, name, role, password_hash, must_change_password)
      VALUES (
        'admin@opensupport.local',
        'Open Support Admin',
        'admin',
        'scrypt:16384:8:1:1bb1d396682287c295ef76ae5ad15a62:82bbf09f4ef75a52295e22087f98572a9c41a6ea64bc8c6d32cf1170c9b66838899d6d9deea259d67a81010f692d8e01e70be74be13abb346c81c3cc0f78bafc',
        true
      )
      ON CONFLICT (email) DO UPDATE SET
        role = 'admin',
        password_hash = COALESCE(users.password_hash, EXCLUDED.password_hash),
        must_change_password = CASE
          WHEN users.password_hash IS NULL THEN true
          ELSE users.must_change_password
        END
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS staff_invitations');
    await queryRunner.query('ALTER TABLE users DROP COLUMN IF EXISTS must_change_password');
    await queryRunner.query('ALTER TABLE users DROP COLUMN IF EXISTS password_hash');
  }
}
