//数据库配置
const mysql = require('../mysql/mysql.js')()

module.exports = {
    
    /**通过用户id 查询所有好友关系
     * 
     * @param {Number} id 需要查询的用户id 
     */
    buy() {
        let sql = "UPDATE numtest SET num = IF (num > 0, num - 1, num) WHERE id =  1;";
        return new Promise((resolve, reject) => {
            mysql.query(sql, [], (err, data) => {
                console.log('测试测试---', err, data);
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            })
        })
    }
}