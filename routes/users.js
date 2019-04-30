var express = require('express');
var router = express.Router();
//数据库配置
const mysql = require('../mysql/mysql.js')()

// import responseBody from '../utils/js/responseBody'
var responseBody = require('../utils/js/responseBody');

/* GET users listing. */
router.get('/', function (req, res, next) {
  //通过 req.query 获取get请求中的参数

  let sql = 'SELECT * FROM user WHERE name = ? LIMIT 1';
  //执行sql查询语句
  mysql.query(sql, req.query.name, (err, data) => {

    //返回消息
    res.send(data);
    
  });

  
});

/**
 * 用户登陆
 */
router.post('/login',function (req, res, next) {
  const { name, password } = req.body;

  let sql = 'SELECT * FROM user WHERE name = ? LIMIT 1'

  if (name &&  password) {
    //执行sql查询语句  返回的data为数组
    mysql.query(sql, name, (err, data) => {
      if (data[0]) {
        if (data[0].password == password) {
          res.send(responseBody(0, data[0]));
        } else {
          res.send(responseBody(1, {}, '密码错误', 111));
        }
      } else {
        res.send(responseBody(1, {}, '未找到该用户', 111));
      }
    });
  } else {
    res.send(responseBody(1,{},'参数异常',111))
  }

})
module.exports = router;
