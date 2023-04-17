const jwt = require('jsonwebtoken')
const { PRIVATE_KEY } = require('../app/config')
class authController {
    async login (ctx, next) {
        // 获取用户的信息
        const { id, username, avatar } = ctx.user;
        // 生成token
        const token = jwt.sign({id, username}, PRIVATE_KEY ,{
            expiresIn: 60 * 60 * 24 * 7,
            algorithm: 'RS256'
        })
        // 返回数据
        ctx.body = {
            'user': {
                "id": id,
                "username": username,
            },
            "token": token
        };
    }
    async getLoginUser (ctx, next){
        const user = ctx.user || {}
        return user;
    }
    async success (ctx, next) {
        ctx.body = `用户${ctx.user.username}授权成功~！`
    }
}

module.exports = new authController()