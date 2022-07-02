const maria = require('mysql')

const conn = maria.createConnection({
    host : 'localhost',
    port : 3306,
    user : 'kangjuhyup',
    password : 'jh6767',
    database : 'ntf-db',
})

module.exports = conn;