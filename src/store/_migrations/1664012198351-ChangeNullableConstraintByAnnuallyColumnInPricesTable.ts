import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class ChangeNullableConstraintByAnnuallyColumnInPricesTable1664012198351
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE prices ALTER COLUMN annually DROP NOT NULL'
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
