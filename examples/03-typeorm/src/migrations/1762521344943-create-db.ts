import type { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDb1762521344943 implements MigrationInterface {
    name = 'CreateDb1762521344943'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "User" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "nick" varchar(24) NOT NULL, "pass" varchar(128) NOT NULL, "userTypeId" integer)`);
        await queryRunner.query(`CREATE TABLE "UserType" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "cod" varchar(24) NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "temporary_User" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "nick" varchar(24) NOT NULL, "pass" varchar(128) NOT NULL, "userTypeId" integer, CONSTRAINT "FK_acea3e81de70fa86f694093de1f" FOREIGN KEY ("userTypeId") REFERENCES "UserType" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_User"("id", "nick", "pass", "userTypeId") SELECT "id", "nick", "pass", "userTypeId" FROM "User"`);
        await queryRunner.query(`DROP TABLE "User"`);
        await queryRunner.query(`ALTER TABLE "temporary_User" RENAME TO "User"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "User" RENAME TO "temporary_User"`);
        await queryRunner.query(`CREATE TABLE "User" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "nick" varchar(24) NOT NULL, "pass" varchar(128) NOT NULL, "userTypeId" integer)`);
        await queryRunner.query(`INSERT INTO "User"("id", "nick", "pass", "userTypeId") SELECT "id", "nick", "pass", "userTypeId" FROM "temporary_User"`);
        await queryRunner.query(`DROP TABLE "temporary_User"`);
        await queryRunner.query(`DROP TABLE "UserType"`);
        await queryRunner.query(`DROP TABLE "User"`);
    }

}
