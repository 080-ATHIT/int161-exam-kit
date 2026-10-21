import mysql from 'mysql2/promise';
export function createDb(config) {
  return mysql.createPool({host:config.host,port:config.port,user:config.user,password:config.password,database:config.database,
    connectionLimit:5,waitForConnections:true,timezone:'Z',dateStrings:['DATE']});
}
