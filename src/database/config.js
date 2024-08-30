import knex from 'knex';
import path from 'path'
import { app } from 'electron';

// const db= new Database('./src/database/sqlite.db', {verbose: console.log});
const dbPath = path.join(app.getAppPath(), 'src', 'database', 'sqlite.db');

const db = knex({
    client: 'better-sqlite3',
    connection: {
        filename: dbPath
    },
    useNullAsDefault: true,
    pool: {
        min: 2,
        max: 10,
        acquireTimeoutMillis: 10000
    }
})

export default db;

