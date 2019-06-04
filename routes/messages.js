var express = require('express');
var router = express.Router();

var responseBody = require('../utils/js/responseBody');

var messagesService = require('../service/messagesService');
var userService = require('../service/userService');
var frinedsService = require('../service/frinedsService');

var {broadcastOne} = require('../utils/websocket/websocket');

/**
 * 查询当前用户的所有好友信息
 */
router.post('/findNewFriendMessaes', function (request, response, next) {

    const { id } = request.body;
    messagesService.findNewFriendMessaes(id).then(res => {
        let friendArr = [];
        if (res.length) {
            res.forEach((item,index) => {
                userService.selectUserById(item.pushUserId).then(fres => {
                    friendArr.push({
                        ...item,
                        name: fres.name
                    });
                    if (res.length - 1 == index) {
                        response.send(responseBody(0, friendArr, 'success', 0));
                    }
                }).catch(ferr => {
                    response.send(responseBody(1, {}, '查询信息出错', 111));
                })
            });
        } else {
            response.send(responseBody(0, [], 'success', 0));
        }
    }).catch(err => {
        response.send(responseBody(1, {}, '未知异常', 111));
    });

});

/**
 * 
 */
router.post('/updateNewFriendMessaes', function (request, response, next) { 
    
    const { messageId,id, friendId, status } = request.body;
    if (messageId && friendId && status) {
        messagesService.updateNewFriendMessaes(messageId, status).then(res => {
            if (res.affectedRows) {
                //当为接受好友请求时 需添加好友
                if (status == '2') {
                    frinedsService.addFriend(friendId, id, new Date().getTime() + '').then(ares => {
                        //受影响行数为 1 表示成功了
                        if (ares.affectedRows == 1) {
                            //查询 申请用户的 信息
                            userService.selectUserById(friendId).then(sres => {
                                //返回成功的信息
                                response.send(responseBody(0, sres, 'success', 0));
                            }).catch(serr => {

                            })
                            //查询 接受用户的 信息
                            userService.selectUserById(id).then(sres => {
                                let sendMessage = {
                                    type: 3,
                                    status: 0,
                                    message: 'ID:' + id + ',接受了你的好友请求！',
                                    data:sres
                                };
                                //为申请用户 推送接受申请的 信息
                                broadcastOne(responseBody(0, sendMessage, 'success', 0), -1, friendId);
                            }).catch(serr => {

                            })

                        } else {
                            response.send(responseBody(1, {}, '增加好友信息出错了', 111));
                        }
                    }).catch(aerr => {
                        response.send(responseBody(1, aerr, '增加好友信息出错了', 111));
                    })
                } else {
                    response.send(responseBody(0, {}, 'success', 0));
                    let sendMessage = {
                        type: -1,
                        status: 0,
                        message:'拒绝了你的好友请求'
                    }
                    broadcastOne(responseBody(0, sendMessage, 'success', 0), -1, friendId);
                }
            } else {
                response.send(responseBody(1, {}, '未知异常', 111));
            }
        }).catch(err => {
            response.send(responseBody(1, {}, '未知异常', 111));
        })
    } else {
        response.send(responseBody(1, {}, '参数错误', 111));
    }

});

module.exports = router;
