var express = require('express');
var router = express.Router();

var responseBody = require('../utils/js/responseBody');

var frinedsService = require('../service/frinedsService');
var userService = require('../service/userService');

/* GET home page. */
router.post('/findAllFriends', function (request, response, next) {
    const { id } = request.body;
    frinedsService.selectFriendsById(id).then(res => {
        let friendsArr = [];
        res.forEach((friend,index) => {
            if (true) {
                userService.selectUserById(id == friend.myId ? friend.friendId : friend.myId).then(userRes => {
                    friendsArr.push(userRes[0]);
                    if (index == res.length - 1) {
                        response.send(responseBody(0, friendsArr, 'success', 0));
                    }
                }).catch(err => {
                    response.send(responseBody(1, {}, '查询数据库异常', 111));
                })
            }
        });
    }).catch(err => {
        response.send(responseBody(1, {}, '查询数据库异常', 111));
    })

});


module.exports = router;
