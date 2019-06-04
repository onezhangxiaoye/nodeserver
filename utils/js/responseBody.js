/**
 * 
 * @param {Number} type 返回类型 0成功 1其他
 * @param {Object} data 需要返回的数据
 * @param {String} message 返回的提示信息
 * @param {Number} code 返回的状态码
 */
module.exports = (type, data = {}, message = 'success', code = 0) => {
    let responseData = {
        code: code,
        data: data,
        message:message
    }
    switch (type) {
        //成功信息体
        case '0':

            break;
        //错误信息体
        case '1':
            
            break;
    
        default:
            break;
    }
    return responseData;
}