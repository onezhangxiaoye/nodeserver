//数据库配置
const mysql = require('../mysql/mysql.js')()

module.exports = {

    /**新增消息
     * 
     * @param {Number} pushUserId 发送者id
     * @param {Number} pullUserId 接收着id
     * @param {String} message 消息内容
     * @param {String} timestamp 消息时间戳
     */
    insertMessage(pushUserId, pullUserId,message,timestamp) {
        let sql = 'INSERT INTO messages VALUES (NULL, ?, ?, ?, ?, null)';
        return new Promise((resolve, reject) => {
            //执行sql查询语句
            mysql.query(sql, [pushUserId, pullUserId,message,timestamp], (err, data) => {
                console.log('新增消息',err, data);
                if (err) {
                    reject(err);
                } else {
                    resolve(data); 
                }
            });
        })
    },
}