const { getUserByName } = require('../service/user.service')
const errorType = require('../constants/error-types')
const verifyUser = async (ctx, next) => {
    const { username, password } = ctx.request.body;
    // 判断用户名或者密码是否为空
    if( !username || !password) {
        console.log("用户名或密码不能为空!")
        const error = new Error(errorType.USERNAME_OR_PASSWORD_IS_NOT_NULL)
        return ctx.app.emit('error', error, ctx)
    }
    // 判断用户名是否已被注册
    const result = await getUserByName(username)
    if (result.length) {
        console.log("用户名已存在!")
        const error = new Error(errorType.THE_USERNAME_IS_ALREADLY_IN_USE)
        return ctx.app.emit('error', error, ctx)
    }
    // 判断密码长度不小于6位
    if (password.length < 6){
        console.log("密码长度小于6位!")
        const error = new Error(errorType.THE_PASSWORD_CONTAINS_LESS_THAN_SIX_CHARACTERS)
        return ctx.app.emit('error', error, ctx)
    }
    
    await next()
}

module.exports = {
    verifyUser
}