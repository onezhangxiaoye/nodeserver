//数据库配置
const mysql = require('../mysql/mysql.js')()

module.exports = {
    selectUserByName() {
        
    },
    /**通过用户id 查询用户信息
     * 
     * @param {Number} id 需要查询的用户id 
     */
    selectUserById(id) {
        let sql = "SELECT * FROM user WHERE id = ? LIMIT 1";
        return new Promise((resolve, reject) => {
            mysql.query(sql, id, (err, data) => {
                console.log('通过用户id 查询用户信息--',id,err, data);
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            })
        })
    },
    /**更新用户的登陆状态
     * 
     * @param {Number} id 需要更新登陆状态是的 id
     * @param {Number} loginStatus 当前需要改变为 的登陆状态
     */
    updateStatus(id,loginStatus) {
        let sql = 'UPDATE `user` SET loginStatus = ? WHERE id = ?';
        return new Promise((resolve, reject) => {
            //执行sql查询语句
            mysql.query(sql, [loginStatus, id], (err, data) => {
                console.log(id,err, data);
                if (err) {
                    reject(err);
                } else {
                    resolve(data); 
                }
            });
        })
    }
}