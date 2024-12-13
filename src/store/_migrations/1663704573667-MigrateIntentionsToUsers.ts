import { MigrationInterface, QueryRunner } from 'typeorm'
import { customAlphabet, urlAlphabet } from 'nanoid'
import { v4 as uuidv4 } from 'uuid'

export class MigrateIntentionsToUsers1663704573667
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const intentions = await queryRunner.query(`SELECT * FROM intentions`)

    for (const intention of intentions) {
      const userId = uuidv4()
      const userEmail = intention.intention_email
      const password = customAlphabet(urlAlphabet, 16)()
      const firstName = ''
      const lastName = ''
      await queryRunner.query(
        `INSERT INTO users (id, email, password, first_name, last_name) VALUES ('${userId}', '${userEmail}', '${password}', '${firstName}', '${lastName}');`
      )
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
