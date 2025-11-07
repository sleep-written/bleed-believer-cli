import { dataSource } from './data-source.js';
import { User } from '@entities/user.entity.js';
import { rm } from 'fs/promises';

await dataSource.initialize();
await dataSource.runMigrations();

const users = await User.find({
    relations: {
        userType: true
    }
});

for (const user of users) {
    console.log(`user: "${user.nick}";\ttype: "${user.userType?.cod}";`);
}

await dataSource.destroy();
if (typeof dataSource.options.database === 'string') {
    await rm(dataSource.options.database, { force: true });
}