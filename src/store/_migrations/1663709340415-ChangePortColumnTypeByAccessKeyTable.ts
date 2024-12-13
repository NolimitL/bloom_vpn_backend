import { MigrationInterface, QueryRunner } from 'typeorm'

export class ChangePortColumnTypeByAccessKeyTable1663709340415
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE access_keys ALTER COLUMN port TYPE varchar;`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
