import { MigrationInterface, QueryRunner } from "typeorm";
import { customAlphabet, urlAlphabet } from 'nanoid'
import { v4 as uuidv4 } from 'uuid'

export class AddShowroomData1734084912537 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        /* Showroom products data */
        const uniqueIdBeta1 = uuidv4()
        const uniqueIdBeta2 = uuidv4()

        await queryRunner.query(
          `INSERT INTO products (id, name, description, devices, traffic) 
                    VALUES 
                    ('${uniqueIdBeta1}', 'Trial', 'Trial subscription', 2, 3000),
                    ('${uniqueIdBeta2}', 'Beta', 'Beta subscription', 2, 3000);`
        )
        await queryRunner.query(
          `INSERT INTO prices (id, monthly, annually, currency) 
                    VALUES 
                    ('${uniqueIdBeta1}', 400, 4800, 'EUR'),
                    ('${uniqueIdBeta2}', 400, 4800, 'EUR');`
        )


        /* Showroom campaign data */
        const uniqueCampaignId = uuidv4()

        await queryRunner.query(
          `INSERT INTO campaigns (id, name, parameters) 
                    VALUES 
                    ('${uniqueCampaignId}', 'Main', '{}');`
        )

        const junctionId = uuidv4()
        await queryRunner.query(
          `INSERT INTO campaign_products (id, campaign_id, product_id) 
                    VALUES 
                    ('${junctionId}', '${uniqueCampaignId}', '${uniqueIdBeta1}');`
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
