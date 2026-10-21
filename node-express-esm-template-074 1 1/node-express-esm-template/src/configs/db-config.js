import mysql from 'mysql2/promise'

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'mysql@sit',
    database: 'mobile_distributor',
})
export default db