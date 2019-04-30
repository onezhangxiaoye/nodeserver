//数据库配置
const mysql = require('../mysql/mysql.js')()

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

    addFriend() {
        let sql = "INSERT INTO friends VALUES (NULL, ?, ?, NULL, NULL)";
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
    }
}