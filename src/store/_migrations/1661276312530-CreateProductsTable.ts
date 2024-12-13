import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateProductsTable1661276312530 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'products',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'price',
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
            name: 'devices',
            type: 'int4',
            isNullable: false,
          },
          {
            name: 'traffic',
            type: 'int8',
            isNullable: false,
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
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
