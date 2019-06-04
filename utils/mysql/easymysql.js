var Client = require('easymysql');

var mysql = Client.create({
  'maxconnections' : 10
});

mysql.addserver({
  'host' : 'localhost',
  user:'root',
  password:'1234',
  port:'3306',
  database:'react'
});

module.exports = mysql;