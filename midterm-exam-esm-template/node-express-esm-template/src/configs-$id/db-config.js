//{student-id} - {student-name}
import mysql from 'mysql2/promise'

const db = mysql.createPool({
    host: 'db-host',
    user: 'db-username',
    password: 'db-password',
    database: 'database-name',
})
export default db