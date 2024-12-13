import { MigrationInterface, QueryRunner } from 'typeorm'

export class ChangePriceColumnByProductTable1663967546325
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const products = await queryRunner.query('SELECT * FROM products')

    for (const product of products) {
      const monthly = product.price ? product.price : 0
      const annually = product.price ? product.price * 11 : 0
      const currency = product.currency || 'USD'
      await queryRunner.query(
        `INSERT INTO prices (id, monthly, annually, currency) VALUES ('${product.id}', '${monthly}', '${annually}', '${currency}');`
      )
    }

    if (await queryRunner.hasColumn('products', 'price')) {
      await queryRunner.dropColumn('products', 'price')
    }
    if (await queryRunner.hasColumn('products', 'currency')) {
      await queryRunner.dropColumn('products', 'currency')
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
