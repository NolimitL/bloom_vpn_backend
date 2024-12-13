import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AddCodeColumnToSubscriptionTable1663537262608
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'subscriptions',
      new TableColumn({
        name: 'code',
        type: 'varchar',
        isNullable: true,
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
