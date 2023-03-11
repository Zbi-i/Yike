const { getUserByName } = require('../service/user.service');
const { checkPermission } = require('../service/auth.service')
const passwordHandle = require('../units/password-handle');
const errorType = require('../constants/error-types');
const jwt = require('jsonwebtoken');
const { PUBLICK_KEY } = require('../app/config')

// 验证用户登录
const verifyAuth = async (ctx, next) => {
    const { username, password } = ctx.request.body; 
    
    // 判断用户名和密码是否为空
    if(!username || !password){
        const error = new Error(errorType.USERNAME_OR_PASSWORD_IS_NOT_NULL);
        return ctx.app.emit('error', error, ctx);
    }

    // 对用户密码进行MD5加密 再从数据库获取加密的密码
    const md5password = passwordHandle(password);
    const result = await getUserByName(username);
    const user = result[0];

    // 判断用户是否存在 如果不存在 result.password == undefined
    if (user.username === undefined) {
        const error = new Error(errorType.THE_USER_DOES_NOT_EXIST);
        return ctx.app.emit('error', error, ctx);
    }
    // 判断密码是否正确
    if(md5password !== user.password){
        const error = new Error(errorType.THE_USER_NAME_OR_PASSWORD_IS_INCORRECT);
        return ctx.app.emit('error', error, ctx);
    }

    ctx.user = user;
    await next();
}
// 验证用户令牌
const verifyLogin = async (ctx, next) => {
    const authorization = ctx.headers.authorization;
    if (!authorization) {
        const error = new Error(errorType.UNAUTHORIZATION)
        return ctx.app.emit('error', error, ctx)
    }
    const token = authorization.replace('Bearer ', '');
    try {
        const result = jwt.verify(token, PUBLICK_KEY, {
            algorithms: 'RS256'
        })
        ctx.user = result;
        await next()
    } catch (err) {
        const error = new Error(errorType.UNAUTHORIZATION)
        return ctx.app.emit('error', error, ctx)
    }
}
// 验证用户是否具备权限
const verifyPermission = async (ctx, next) => {
    try {
        const [keyName] = Object.keys(ctx.params);
        const tableName = keyName.replace('Id', '');
        const { momentId } = ctx.params;
        const { id } =  ctx.user;
        console.log(tableName, momentId, id)
        const result = await checkPermission(tableName, momentId, id)
        if(!result){
            const error = new Error(errorType.UNPERMISSION)
            return ctx.app.emit('error', error, ctx)
        }
        await next()
    } catch (error) {
        console.log(error)
    }
    
}
module.exports = {
    verifyAuth,
    verifyLogin,
    verifyPermission
}