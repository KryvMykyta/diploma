import fs from 'fs'
import {faker} from '@faker-js/faker'
import CsvReadableStream from 'csv-reader'
import { User } from '@models/user.model';
import bcrypt from 'bcrypt'
import sequelize from '@config/sequelize';

(async () => {
    await sequelize.sync({alter: true})
    // let inputStream = fs.createReadStream('movielens/ml-20m/ratings.csv', 'utf8');
    let inputStream = fs.createReadStream('movielens/ml-20m/ratings.csv', 'utf8');

    const userIds = new Set()

    inputStream
        .pipe(new CsvReadableStream({ parseNumbers: true, parseBooleans: true, trim: true, skipLines: 1 }))
        .on('data', async function (row: string[]) {
            const userId = row[0]
            userIds.add(userId)
        })
        .on('end', async function () {
            const ids = [...userIds]
            const bulkUserData = await Promise.all(ids.map(async (id) => {
                const randomEmail = faker.internet.email({
                    allowSpecialCharacters: true,
                    firstName: faker.person.firstName(),
                    lastName: faker.person.lastName()
                }) + Math.floor(Math.random() * 50000)
                const randomUsername = faker.internet.userName({
                    firstName: faker.person.firstName(),
                    lastName: faker.person.lastName()
                }) + Math.floor(Math.random() * 50000)
                const randomPassword = faker.internet.password()
                const hashedPassword = await bcrypt.hash(randomPassword, 5);
                return {
                    id: +id,
                    username: randomUsername,
                    email: randomEmail,
                    password: hashedPassword
                }
            }))
            await User.bulkCreate(bulkUserData)
            console.log('No more rows!');
        });
})();
