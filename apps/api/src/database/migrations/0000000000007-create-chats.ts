import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateChats0000000000007 implements MigrationInterface {
  name = 'CreateChats0000000000007';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS chats (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), visitor_email varchar(255) NOT NULL,
      visitor_name varchar(120) NOT NULL, status varchar(32) NOT NULL DEFAULT 'waiting',
      staff_user_id uuid REFERENCES users(id) ON DELETE SET NULL, staff_name varchar(120),
      bot_active boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now())`);
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS chat_messages (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), chat_id uuid NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
      sender varchar(32) NOT NULL, sender_email varchar(255), sender_name varchar(120) NOT NULL,
      content text NOT NULL, staff_only boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now())`);
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS chat_meta (
      chat_id uuid PRIMARY KEY REFERENCES chats(id) ON DELETE CASCADE, current_page varchar(2048),
      ip_address varchar(80), timezone varchar(120), browser varchar(120), os varchar(120), language varchar(80))`);
    await queryRunner.query(
      'CREATE INDEX IF NOT EXISTS idx_chats_status_updated ON chats (status, updated_at DESC)',
    );
    await queryRunner.query(
      'CREATE INDEX IF NOT EXISTS idx_chat_messages_chat ON chat_messages (chat_id, created_at)',
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS chat_meta');
    await queryRunner.query('DROP TABLE IF EXISTS chat_messages');
    await queryRunner.query('DROP TABLE IF EXISTS chats');
  }
}
