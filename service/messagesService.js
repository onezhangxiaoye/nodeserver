//数据库配置
const mysql = require('../utils/mysql/mysql.js')()

module.exports = {

    /**新增消息
     * 
     * @param {Number} pushUserId 发送者id
     * @param {Number} pullUserId 接收着id
     * @param {String} message 消息内容
     * @param {String} timestamp 消息时间戳
     * @param {Number} status 消息状态
     */
    insertMessage(pushUserId, pullUserId,message,timestamp,messageType,status) {
        let sql = 'INSERT INTO messages VALUES (NULL, ?, ?, ?, ?, ?, ?)';
        return new Promise((resolve, reject) => {
            //执行sql查询语句
            mysql.query(sql, [pushUserId, pullUserId,timestamp,message,messageType,status], (err, data) => {
                console.log('新增消息-',err, data);
                if (err) {
                    reject(err);
                } else {
                    resolve(data); 
                }
            });
        })
    },
    /**查询当前Id的好友消息
     * 
     * @param {Number} userId 需要查询好友消息的用户id
     */
    findNewFriendMessaes(userId) {
        let sql = 'SELECT * FROM messages WHERE pullUserId = ? AND messageType = 1;';
        return new Promise((resolve, reject) => {
            //执行sql查询语句
            mysql.query(sql, userId, (err, data) => {
                console.log('查询当前Id的好友消息-',err, data);
                if (err) {
                    reject(err);
                } else {
                    resolve(data); 
                }
            });
        })
    },
    /**更新添加好友信息 的状态
     * 
     * @param {Number} id 需要修改的信息id
     * @param {Number} messageType 信息处理类型
     */
    updateNewFriendMessaes(id,status) {
        let sql = 'UPDATE messages SET `status` = ? WHERE messageId = ?;';
        return new Promise((resolve, reject) => {
            //执行sql语句
            mysql.query(sql, [status,id], (err, data) => {
                console.log('更新添加好友信息 的状态-',id,status,err, data);
                if (err) {
                    reject(err);
                } else {
                    resolve(data); 
                }
            });
        })
    }
}