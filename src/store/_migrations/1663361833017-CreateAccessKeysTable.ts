import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateAccessKeysTable1663361833017 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'access_keys',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'subscription_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'access_key',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'port',
            type: 'int4',
            isNullable: false,
          },
          {
            name: 'method',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'data_limit',
            type: 'int8',
            isNullable: false,
          },
          {
            name: 'device',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'key_id',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'key_name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'password',
            type: 'varchar',
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
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['subscription_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'subscriptions',
          },
        ],
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
