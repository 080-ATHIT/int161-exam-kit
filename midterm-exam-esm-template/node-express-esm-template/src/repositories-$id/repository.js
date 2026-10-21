// {student-id} - {student-name}
import db from '../configs-$id/db-config.js'

import httpStatus from "http-status";

const TABLE_NAME = "table-name"
const ENTITY_NAME = "entity-name"

const COUNT_ALL = `SELECT COUNT(*) as total FROM ${TABLE_NAME}`
const FIND_ALL_SQL = `SELECT * FROM ${TABLE_NAME}`
const FIND_ONE_SQL = `SELECT * FROM ${TABLE_NAME} WHERE primaryKey = ?`
const UPDATE_SQL = `UPDATE ${TABLE_NAME} SET ? WHERE primaryKey = ?`
const REMOVE_SQL = `DELETE FROM ${TABLE_NAME} WHERE primaryKey = ?`
const CREATE_SQL = `INSERT INTO ${TABLE_NAME} SET ?`

export async function findAll(pagination) {
    if (!pagination) {
        const [rows] = await db.query(FIND_ALL_SQL)
        return rows
    }
    const SQL = FIND_ALL_SQL + ' LIMIT ? OFFSET ?'
    const {limit, offset} = pagination
    const [rows] = await db.query(SQL, [limit, offset])
    return rows
}

export async function findOne(id) {
    const [row] = await db.query(FIND_ONE_SQL, [id])
    if (row.length === 0) {
        return null;
    }
    return row[0]
}

export async function update(id, data) {
    await findOne(id)
    await db.query(UPDATE_SQL, [data, id])
    return findOne(id)
}

export async function remove(id) {
    await findOne(id)
    const [data] = await db.query(REMOVE_SQL, [id])
    return data
}

export async function create(data) {
    const key = data.productLine
    const [existingItem] = await db.query(FIND_ONE_SQL, [key])
    if (existingItem.length != 0) {
        return null;
    }
    const [result] = await db.query(CREATE_SQL, [data])
    return findOne(key)
}