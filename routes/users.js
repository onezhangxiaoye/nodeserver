var express = require('express');
var router = express.Router();
//数据库配置
const mysql = require('../utils/mysql/mysql.js')()

// import responseBody from '../utils/js/responseBody'
var responseBody = require('../utils/js/responseBody');
var userService = require('../service/userService');

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
 * 用户注册
 */
router.post('/register',function (request, response, next) {
  const { name, password,email } = request.body;
  
  if (name && password && email) {
    userService.selectUserByName(name).then(res => {
      if (res) {
        response.send(responseBody(1, {}, '用户名已注册', 111));
      } else {
        userService.userRegister(name, password,email).then(res => {
          if (res.affectedRows == 1) {
            response.send(responseBody(0, {},'注册成功'));
          } else {
            response.send(responseBody(1, res, '未知异常', 111))
          }
        }).catch(err => {
          response.send(responseBody(1, err, '未知异常', 111))
        })
      }
    }).catch(err => {
      response.send(responseBody(1, err, '未知异常', 111))
    })
  } else {
    response.send(responseBody(1, {}, '参数异常', 111));
  }
})

/**
 * 用户登陆
 */
router.post('/login',function (request, response, next) {
  const { name, password } = request.body;

  if (name && password) {
    userService.selectUserByName(name).then(res => {
      if (res) {
        if (res.password == password) {
          response.send(responseBody(0, res));
        } else {
          response.send(responseBody(1, {}, '密码错误', 111));
        }
      } else {
        response.send(responseBody(1, {}, '未找到该用户', 111));
      }
    }).catch(err => {
      response.send(responseBody(1, {}, err, 111));
    })
  } else {
    response.send(responseBody(1, {}, '参数异常', 111));
  }
})
/**
 * 通过传入id查找用户信息
 */
router.post('/findUserById', (request, response, next) => {
  const { friendId } = request.body;
  userService.selectUserById(friendId).then(res => {
    response.send(responseBody(0,res))
  }).catch(err => {
    res.send(responseBody(1,{},'未知错误',111))
  })
})

module.exports = router;
