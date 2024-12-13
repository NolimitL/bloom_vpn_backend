import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreatePricesTable1663965979267 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'prices',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'monthly',
            type: 'int4',
            isNullable: false,
          },
          {
            name: 'annually',
            type: 'int4',
            isNullable: false,
          },
          {
            name: 'currency',
            type: 'varchar(3)',
            isNullable: false,
            default: "'USD'",
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'products',
          },
        ],
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
