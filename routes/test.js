var express = require('express');
var router = express.Router();
//数据库配置
const mysql = require('../utils/mysql/mysql.js')()

// import responseBody from '../utils/js/responseBody'
var responseBody = require('../utils/js/responseBody');

var testService = require('../service/testService');

var {broadcastOne} = require('../utils/websocket/websocket');

/**
 * 测试接口
 */
router.post('/num',function (request, response, next) {
//   const { name, password } = req.body;
    testService.buy().then(res => {
        if (res.changedRows == 1) {
            response.send(responseBody(0, res, 'success：购买成功', 0));
        } else {
            response.send(responseBody(0, res, 'success：购买失败', 0));
        }
    }).catch(error => {
        response.send(responseBody(1, error, '/test/num--查询数据库异常', 111));
    })

})

/**
 * socket 测试
 */
router.post('/socketTest',function (request, response, next) {
    console.log('socketTest 进入-----');
    //测试消息体
    let sendMessage = {
        type: -1,
        status:0
    }
    broadcastOne(responseBody(1, sendMessage, 'socketTest 测试测试---', 0), -1, 63);
    response.send(responseBody(0, {}, 'success', 0));
})
module.exports = router;
