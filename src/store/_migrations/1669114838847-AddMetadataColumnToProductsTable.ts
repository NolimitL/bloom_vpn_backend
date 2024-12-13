import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AddMetadataColumnToProductsTable1669114838847
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'products',
      new TableColumn({
        name: 'metadata',
        type: 'json',
        isNullable: true,
        default: null,
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
