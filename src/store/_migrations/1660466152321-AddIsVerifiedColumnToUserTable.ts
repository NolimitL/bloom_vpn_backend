import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AddIsVerifiedColumnToUserTable1660466152321
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'is_verified',
        type: 'boolean',
        isNullable: false,
        default: false,
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
