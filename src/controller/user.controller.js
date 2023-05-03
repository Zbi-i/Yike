const userService = require('../service/user.service');
const fileService = require('../service/file.service');
const fs = require('fs')
const path = require('path')
const { AVATAR_PATH } = require('../constants/file.path')

class  userController {
    async create (ctx, next) {
        // 获取用户信息
        const user = ctx.request.body;

        // 创建用户
        const result = await userService.create(user);

        // 返回数据
        ctx.body = `用户${user.username}注册成功~！`
    }
    // 获取用户头像信息
    async avatarInfo(ctx, next) {
        try {
            const { userId } = ctx.params;
            const { avatarSize } = ctx.params;
            const [userInfo] = await userService.getUserInfo(userId)
            const { avatarName, mimetype } = userInfo
            const newFilename = `${avatarName.split('.')[0]}-${avatarSize}.${avatarName.split('.')[1]}`;
            ctx.response.set('content-type', mimetype)
            ctx.body = fs.createReadStream(path.resolve(AVATAR_PATH, userId, newFilename))
        } catch (error) {
            console.log(error)
        }
        
    }
    async userInfo(ctx, next) {
        const [str] = Object.keys(ctx.request.body)
        const strValue = ctx.request.body[str];
        try {
            const [result] = await userService.getUserByName(str, strValue);
            const isStrValue = result?.[str] || '';
            ctx.body = isStrValue;
        } catch (error) {
            console.log(error)
        }
    }
    async getUserInfo(ctx, next) {
        const { userId } = ctx.params;
        const [result] = await userService.getUserInfo(userId);
        ctx.body = result
    }
}

module.exports = new userController()