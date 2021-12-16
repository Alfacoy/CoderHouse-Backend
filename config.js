import knex from 'knex';

//PROBLEMAS CON DIRNAME
import { __dirname } from './helper/utils.js';

const databaseChat = knex({
    client: 'sqlite3',
    connection: {filename:`database/eccomerce.sqlite`}
})

export const databaseProducts = knex({
    client: 'mysql',
    version: '10.4.22',
    connection: {
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: '',
        database: 'products'
    },
    pool: {min:0,max:10}
})

export default databaseChat
