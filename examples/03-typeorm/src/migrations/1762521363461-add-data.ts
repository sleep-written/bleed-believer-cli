import type { MigrationInterface, QueryRunner } from 'typeorm';

import { randomBytes } from 'crypto';
import { UserType } from '@entities/user-type.entity.js';
import { User } from '@entities/user.entity.js';

export class AddData1762521363461 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const manager = queryRunner.manager;
        const master = await manager.save(manager.create(UserType, {
            cod: 'MASTER'
        }));

        const slave = await manager.save(manager.create(UserType, {
            cod: 'SLAVE'
        }));

        await manager.save(manager.create(User, {
            nick: 'k-angylus',
            pass: randomBytes(16).toString('hex'),
            userType: master
        }));

        await manager.save(manager.create(User, {
            nick: 'buckethead',
            pass: randomBytes(16).toString('hex'),
            userType: master
        }));

        await manager.save(manager.create(User, {
            nick: 'adam-jones',
            pass: randomBytes(16).toString('hex'),
            userType: master
        }));

        await manager.save(manager.create(User, {
            nick: 'slash-bruh',
            pass: randomBytes(16).toString('hex'),
            userType: slave
        }));

        await manager.save(manager.create(User, {
            nick: 'zack-wylde',
            pass: randomBytes(16).toString('hex'),
            userType: slave
        }));

        await manager.save(manager.create(User, {
            nick: 'tom-morello',
            pass: randomBytes(16).toString('hex'),
            userType: slave
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM User`);
        await queryRunner.query(`DELETE FROM UserType`);
        await queryRunner.query(`TRUNCATE User`);
        await queryRunner.query(`TRUNCATE UserType`);
    }
}
