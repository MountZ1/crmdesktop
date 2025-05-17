<<<<<<< HEAD
import knex from 'knex';
import path from 'path'
import { app } from 'electron';

// const db= new Database('./src/database/sqlite.db', {verbose: console.log});
const dbPath = path.join(app.getAppPath(), 'src', 'database', 'sqlite.db');

=======
// const knex = require('knex');
// const path = require('path');
// const { app } = require('electron');

// const dbPath = path.join(app.getAppPath(), 'src', 'database', 'sqlite.db');
// // const dbPath = path.resolve('src', 'database', 'sqlite.db');

// const db = knex({
//     client: 'better-sqlite3',
//     connection: {
//         filename: dbPath
//     },
//     useNullAsDefault: true,
//     pool: {
//         min: 2,
//         max: 10,
//         acquireTimeoutMillis: 10000
//     }
// });

// module.exports = db;

const knex = require('knex');
const path = require('path');
const fs = require('fs');

// Use path.resolve() to get the correct directory path
const __nameDirrectory = path.resolve();

// Configure database path
const dbPath = path.join(__nameDirrectory, 'src', 'database', 'sqlite.db');

// Initialize database connection
>>>>>>> 7e5e88e (web only)
const db = knex({
    client: 'better-sqlite3',
    connection: {
        filename: dbPath
    },
    useNullAsDefault: true,
    pool: {
        min: 2,
<<<<<<< HEAD
        max: 10,
        acquireTimeoutMillis: 10000
    }
})

export default db;

=======
        max: 10
    }
});

module.exports = db;
>>>>>>> 7e5e88e (web only)
