var express = require('express');
var router = express.Router();
//数据库配置
const mysql = require('../mysql/mysql.js')()

// import responseBody from '../utils/js/responseBody'
var responseBody = require('../utils/js/responseBody');

var testService = require('../service/testService');

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
module.exports = router;
