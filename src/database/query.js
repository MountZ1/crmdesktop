<<<<<<< HEAD
import db from "./config.js";

export const Index = async (table, col, lmt, off) => {
=======
const db = require("./config.js");

const Index = async (table, col, lmt, off) => {
>>>>>>> 7e5e88e (web only)
    try {
        return await db.select(col).from(table).limit(lmt).offset(off);
    } catch (error) {
        return error;
    }
<<<<<<< HEAD
}

export const Store = async (table, data) => {
=======
};

const Store = async (table, data) => {
>>>>>>> 7e5e88e (web only)
    try {
        await db(table).insert(data);
    } catch (error) {
        return error;
    }
<<<<<<< HEAD
}

export const Show = async (table, condition, col) => {
=======
};

const Show = async (table, condition, col) => {
>>>>>>> 7e5e88e (web only)
    try {
        return await db(table).where(condition).select(col);
    } catch (error) {
        throw error;
    }
<<<<<<< HEAD
}

export const Update = async (table, data, condition) => {
=======
};

const Update = async (table, data, condition) => {
>>>>>>> 7e5e88e (web only)
    try {
        await db(table).where(condition).update(data);
    } catch (error) {
        return error;
    }
<<<<<<< HEAD
}

export const Destroy = async (table, condition) => {
=======
};

const Destroy = async (table, condition) => {
>>>>>>> 7e5e88e (web only)
    try {
        await db(table).where(condition).del();
    } catch (error) {
        return error;
    }
<<<<<<< HEAD
}

export const Join = (table, joincondition) => {
    return db(table).join(joincondition[0], joincondition[1], '=', joincondition[2]);
}

export const CountRow = (table, condition) => {
    return db(table).count(condition);
}

export const Search = async (table, condition, lmt, off, col) => {
=======
};

const Join = (table, joincondition) => {
    return db(table).join(joincondition[0], joincondition[1], '=', joincondition[2]);
};

const CountRow = (table, condition) => {
    return db(table).count(condition);
};

const Search = async (table, condition, lmt, off, col) => {
>>>>>>> 7e5e88e (web only)
    try {
        return await db(table).where(condition[0], condition[1], condition[2]).limit(lmt).offset(off).select(col);
    } catch (error) {
        return error;
    }
<<<<<<< HEAD
}
=======
};

module.exports = {
    Index,
    Store,
    Show,
    Update,
    Destroy,
    Join,
    CountRow,
    Search,
};
>>>>>>> 7e5e88e (web only)
