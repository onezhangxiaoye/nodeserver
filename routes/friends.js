var express = require('express');
var router = express.Router();

var responseBody = require('../utils/js/responseBody');

var frinedsService = require('../service/frinedsService');
var userService = require('../service/userService');

/**
 * 查询当前用户的所有好友信息
 */
router.post('/findAllFriends', function (request, response, next) {
    const { id } = request.body;
    frinedsService.selectFriendsById(id).then(res => {
        let friendsArr = [];
        if (res.length) {
            res.forEach((friend,index) => {
                userService.selectUserById(id == friend.myId ? friend.friendId : friend.myId).then(userRes => {
                    friendsArr.push(userRes);
                    if (index == res.length - 1) {
                        response.send(responseBody(0, friendsArr, 'success', 0));
                    }
                }).catch(err => {
                    response.send(responseBody(1, {}, '查询数据库异常', 111));
                })
            });
        } else {
            response.send(responseBody(0, res, 'success', 0));
        }
    }).catch(err => {
        response.send(responseBody(1, {}, '查询数据库异常', 111));
    })

});


module.exports = router;
