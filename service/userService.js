//数据库配置
const mysql = require('../utils/mysql/mysql.js')()

module.exports = {
    /**用户注册
     * 
     * @param {String} name 用户名
     * @param {String} password 用户密码
     * @param {String} email 用户邮箱
     */
    userRegister(name, password,email) {
        let sql = "INSERT INTO `user` (`name`,`password`,email) VALUES (?,?,?)";
        return new Promise((resolve, reject) => {
            mysql.query(sql, [name, password,email], (err, data) => {
                console.log('用户注册--',err, data);
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            })
        })
    },
    /**通过用户名查找用户信息
     * 
     * @param {String} name 用户名
     */
    selectUserByName(name) {
        let sql = 'SELECT * FROM user WHERE name = ? LIMIT 1';
        return new Promise((resolve, reject) => {
            mysql.query(sql, name, (err, data) => {
                console.log('通过用户名 查询用户信息--',err, data);
                if (err) {
                    reject(err);
                } else {
                    //通过用户名查询的只会有一条信息
                    resolve(data[0]);
                }
            })
        })
    },
    /**通过用户id 查询用户信息
     * 
     * @param {Number} id 需要查询的用户id 
     */
    selectUserById(id) {
        let sql = "SELECT id,`name`,picName,email,loginStatus FROM user WHERE id = ? LIMIT 1";
        return new Promise((resolve, reject) => {
            mysql.query(sql, id, (err, data) => {
                console.log('通过用户id 查询用户信息--',id,err, data);
                if (err) {
                    reject(err);
                } else {
                    //通过id查询的只会有一条信息
                    resolve(data[0]);
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