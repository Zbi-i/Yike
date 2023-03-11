const service = require('../service/moment.service')
const fileService = require('../service/file.service')
const { PICTURE_PATH } = require('../constants/file.path')
const path = require('path')
const fs = require('fs')
class momentController {
    // 发表心情
    async create(ctx, next){
        const { userId, content } = ctx.request.body
        const result = service.create(userId,content)
        ctx.body = "心情发表成功~"
    }
    // 获取某一条动态
    async detail(ctx, next){
        const momentId = ctx.params.momentId;
        const result = await service.detail(momentId);
        ctx.body = result;
    }
    // 获取多条动态
    async list(ctx, next){
        const { offset, size } = ctx.query   
        const [result] = await service.list(offset, size)
        ctx.body = result;
    }
    // 修改动态
    async updated(ctx, next){
        const { momentId } = ctx.params;
        const { content } = ctx.request.body

        const result = await service.updated(momentId, content)

        ctx.body = result
    }
    // 删除动态
    async remove(ctx, next){
        const { momentId } = ctx.params;
        const result = await service.remove(momentId);
        ctx.body = result
    }
    // 给动态添加标签
    async addLable (ctx, next){
        const { lables } = ctx.request.body;
        const { momentId } = ctx.params;
        const result = await service.addLable(momentId, lables);
        ctx.body = result
    }
    // 获取某条动态配图
    async pictureInfo (ctx, next){
        const { userId, fileName, momentId } = ctx.params;
        const [pictureInfo] = await fileService.getPictureByMomentId(momentId, fileName)
        ctx.response.set('content-type', pictureInfo.mimetype)
        ctx.body = fs.createReadStream(path.resolve(PICTURE_PATH,userId,pictureInfo.name)) 
    }
}

module.exports = new momentController()