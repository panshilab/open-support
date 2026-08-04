import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMediaAssets0000000000004 implements MigrationInterface {
  name = 'CreateMediaAssets0000000000004';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS media_assets (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        url varchar(2048) NOT NULL,
        key varchar(500) NOT NULL,
        filename varchar(255) NOT NULL,
        mime_type varchar(120) NOT NULL,
        size integer NOT NULL,
        provider varchar(32) NOT NULL,
        alt_text varchar(180),
        caption varchar(300),
        uploaded_by_user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(
      'CREATE INDEX IF NOT EXISTS idx_media_assets_created_at ON media_assets (created_at DESC)',
    );
    await queryRunner.query(
      'CREATE INDEX IF NOT EXISTS idx_media_assets_uploaded_by ON media_assets (uploaded_by_user_id)',
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX IF NOT EXISTS uq_media_assets_key_provider ON media_assets (provider, key)',
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS media_assets');
  }
}
