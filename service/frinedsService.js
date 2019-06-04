//数据库配置
const mysql = require('../utils/mysql/mysql.js')()

module.exports = {
    
    /**通过用户id 查询所有好友关系
     * 
     * @param {Number} id 需要查询的用户id 
     */
    selectFriendsById(id) {
        let sql = "SELECT * FROM friends WHERE myId = ? OR friendId = ?";
        return new Promise((resolve, reject) => {
            mysql.query(sql, [id, id], (err, data) => {
                console.log('通过用户id 查询所有好友关系---',id,err, data);
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            })
        })
    },
    /**增加好友信息
     * 
     * @param {Number} myId 申请人id
     * @param {Number} friendId 好友Id
     * @param {String} timestamp 时间戳
     */
    addFriend(myId,friendId,timestamp) {
        let sql = "INSERT INTO friends (`myId`,`friendId`,`timestamp`) VALUES (?,?,?);";
        return new Promise((resolve, reject) => {
            mysql.query(sql, [myId,friendId,timestamp], (err, data) => {
                console.log('增加好友信息---',err, data);
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            })
        })
    }
}