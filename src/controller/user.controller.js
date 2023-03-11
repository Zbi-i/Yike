const userService = require('../service/user.service');
const fileService = require('../service/file.service');
const fs = require('fs')
const path = require('path')
const { AVATAR_PATH } = require('../constants/file.path')

class  userController {
    async create (ctx, next) {
        // 获取用户信息
        const user = ctx.request.body;

        console.log(user)

        // 创建用户
        const result = await userService.create(user);
        console.log(result+ 666)

        // 返回数据
        ctx.body = `用户${user.username}注册成功~！`
    }
    async avatarInfo(ctx, next) {
        const { userId } = ctx.params;
        const [avatarInfo] = await fileService.getAvatarByUserId(userId)
        console.log(avatarInfo)
        ctx.response.set('content-type', avatarInfo.mimetype)
        console.log(path.resolve(AVATAR_PATH,userId,avatarInfo.name))
        ctx.body = fs.createReadStream(path.resolve(AVATAR_PATH, userId, avatarInfo.name))
    }
}

module.exports = new userController()