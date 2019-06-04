/**
 * 创建 websocket 连接  在/bin/www 中使用即可
 */
var ws = require("nodejs-websocket");

var responseBody = require('../js/responseBody');

var frinedsService = require('../../service/frinedsService');
var userService = require('../../service/userService');
var messagesService = require('../../service/messagesService');

//监控的端口号
var port = 3377;
//记录当前用户数量
var userCount = 0;

// 创建一个连接
var server = ws.createServer(function (conn) {
    //获取连接路径中的参数
    const userid = conn.path.substring(1)*1;
    userCount++;
    console.log("用户  Id=" + userid + '  上线了，当前用户数：' + userCount);
    conn.userid = userid;

    //用户 连接 进入 修改数据库当前用户的登陆状态 
    userService.updateStatus(userid, 1).then(res => {
        //type = 0 表示好友上下线通知信息  status = 1 表示上线
        let sendMessage = {
            type: 0,
            status:1,
            userid:userid
        }
        //状态修改成功后 给好友发送消息 
        broadcast(responseBody(0, sendMessage, '用ID：' + userid + '，  上线了，当前用户数：' + userCount, 0),userid,0);
    })

    //向客户端推送消息
    conn.on("text", function (messages) {
        console.log("客户端发送来的消息---" + messages);
        const { type,data } = JSON.parse(messages);
        switch (type) {
            //用户之间的聊天消息
            case 0: {
                const { pullUserId, message, timestamp } = data;
                messagesService.insertMessage(userid, pullUserId, message, timestamp, 0,0).then(res => {
                    //type = 1 好友消息
                    let sendMessage = {
                        type: 1,
                        pullUserId: pullUserId,
                        pushUserId: userid,
                        message: message,
                        timestamp: timestamp,
                    }
                    broadcastOne(responseBody(0, sendMessage, 'success', 0), userid, pullUserId);
                }).catch(err => {
        
                });
                break;
            }
            //添加好友 消息
            case 1: {
                const { friendId,timestamp } = data;
                messagesService.insertMessage(userid, friendId, '', timestamp, 1, 0).then(res => {
                    userService.selectUserById(userid).then(res => {
                        //type = 1 添加好友的消息
                        let sendMessage = {
                            type: 2,
                            name:res.name,
                            pullUserId: friendId,
                            timestamp: timestamp,
                        };
                        broadcastOne(responseBody(0, sendMessage, 'success', 0), userid, friendId);
                    }).catch(err => {

                    })
                }).catch(err => {
        
                })
                break;
            }
            //处理添加好友得请求信息
            case 2: {
                const { id, friendId, status } = data;
                messagesService.updateNewFriendMessaes(id, status).then(res => {
                    if (res.affectedRows) {
                        //当为接受好友请求时 需添加好友
                        if (status == '2') {
                            
                        } else {
                            
                        }
                    } else {
                        
                    }
                }).catch(err => {

                })
            }
            case 3: {
                
            }
            case 4: {
                
            }
            default:
                break;
        }

    });

    //监听关闭连接操作
    conn.on("close", function (code, reason) {
        userCount--;
        console.log("用户  Id=" + userid + '  下线了，当前用户数：' + userCount);
        //用户 断开 连接 修改数据库当前用户的登陆状态 
        userService.updateStatus(userid, 0).then(res => {
            //type = 0 表示好友上下线通知信息  status = 1 表示下线
            let sendMessage = {
                type: 0,
                status:0,
                userid:userid
            }
            //状态修改成功后 给好友发送消息
            broadcast(responseBody(0, sendMessage, '用ID：' + userid + '，  下线了， 当前用户数：' + userCount, 0),userid,0);
        })
    });

    //错误处理
    conn.on("error", function (err) {
        console.log("监听到错误");
        console.log(err);
    });
}).listen(port);

/**多人 消息通知
 * 
 * @param {String} str 需要发送的数据
 * @param {Number} id  当前用户的 id
 * @param {Number} type 通知类型 0 连接通知  默认不传参数为消息通知
 */
function broadcast(str, id ,type = 1) {
    //查找当前Id 需要通知的好友
    frinedsService.selectFriendsById(id).then(res => {
        res.forEach((item, index) => {
            //遍历当前连接的所有用户
            server.connections.forEach(function (connection) {
                const { userid } = connection;
                //匹配连接用户中的好友id 且不通知自己
                //数据库保存的用户Id和好友id
                if ((item.myId == id && userid == item.friendId || item.myId == userid && id == item.friendId) && id != userid) {
                    switch (type) {
                        case 0:
                            connection.sendText(JSON.stringify(str));
                            break;
                        
                        default:
                            connection.sendText(JSON.stringify(str));
                            break;
                    }
                }
            })
        })
    })
}
/**单人 消息通知
 * 
 * @param {String} str 需要发送的数据
 * @param {Number} id  当前用户的 id
 * @param {Number} friendId 需要通知的好友id
 */
function broadcastOne(str, id, friendId) {
    //遍历当前连接的所有用户
    server.connections.forEach(function (connection, index) {
        const { userid } = connection;
        //匹配连接用户中的好友id
        if (userid == friendId) {
            connection.sendText(JSON.stringify(str));
        }
    })
}


module.exports = {
    broadcast,broadcastOne
};