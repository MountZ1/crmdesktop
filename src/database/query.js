import db from "./config.js";

export const Index = async (table, col, lmt, off) => {
    try {
        return await db.select(col).from(table).limit(lmt).offset(off);
    } catch (error) {
        return error;
    }
}

export const Store = async (table, data) => {
    try {
        await db(table).insert(data);
    } catch (error) {
        return error;
    }
}

export const Show = async (table, condition, col) => {
    try {
        return await db(table).where(condition).select(col);
    } catch (error) {
        throw error;
    }
}

export const Update = async (table, data, condition) => {
    try {
        await db(table).where(condition).update(data);
    } catch (error) {
        return error;
    }
}

export const Destroy = async (table, condition) => {
    try {
        await db(table).where(condition).del();
    } catch (error) {
        return error;
    }
}

export const Join = (table, joincondition) => {
    return db(table).join(joincondition[0], joincondition[1], '=', joincondition[2]);
}

export const CountRow = (table, condition) => {
    return db(table).count(condition);
}

export const Search = async (table, condition, lmt, off, col) => {
    try {
        return await db(table).where(condition[0], condition[1], condition[2]).limit(lmt).offset(off).select(col);
    } catch (error) {
        return error;
    }
}