const errorType = require('../constants/error-types')

const errorHandle = (error, ctx) => {
    let status, message;
    switch(error.message){
        case errorType.USERNAME_OR_PASSWORD_IS_NOT_NULL:
            status = 412; // 为满足前提条件
            message = "用户名或密码不能为空~"
        break;
        case errorType.THE_USERNAME_IS_ALREADLY_IN_USE:
            status = 409; // 冲突
            message = "用户名已被使用~"
        break;
        case errorType.THE_PASSWORD_CONTAINS_LESS_THAN_SIX_CHARACTERS:
            status = 412;
            message = "密码长度小6位！"
        break;
        case errorType.THE_USER_NAME_OR_PASSWORD_IS_INCORRECT:
            status = 401;
            message = "用户名或密码错误！"
        break;
        case errorType.THE_USER_DOES_NOT_EXIST:
            status = 401;
            message = "用户不存在！"
        break;
        case errorType.UNAUTHORIZATION:
            status = 401;
            message = "登录验证错误，未授权的登录！"
        break;
        case errorType.UNPERMISSION:
            status = 401;
            message = "您没有权限执行该操作~"
        break;
        default:
            status = 400;
            message = 'NOT FOUNT~'
        break;
    }

    ctx.status = status;
    ctx.response.body = message
}

module.exports = errorHandle