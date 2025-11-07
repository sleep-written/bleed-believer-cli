import { DataSource } from 'typeorm';
import { resolve } from 'path';

export const dataSource = new DataSource({
    type: 'sqlite',
    database: resolve(import.meta.dirname, '../database.db'),
    entities: [
        resolve(import.meta.dirname, 'entities/*.entity.{ts,js}')
    ],
    migrations: [
        resolve(import.meta.dirname, 'migrations/*.{ts,js}')
    ],
    synchronize: false
});