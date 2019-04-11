const mysql = require('mysql')

const connectdb=()=>{
  let connection = mysql.createConnection({
    host     : 'localhost',
    port     : '3306',
    user     : 'root',
    password : 'root',
    database : 'testadmin',
    multipleStatements: true  //同时执行多条语句
  })
  return connection;
}

module.exports=connectdb;