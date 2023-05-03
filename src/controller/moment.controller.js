const service = require('../service/moment.service')
const fileService = require('../service/file.service')
const { PICTURE_PATH } = require('../constants/file.path')
const path = require('path')
const fs = require('fs')
class momentController {
    // 发表心情
    async create(ctx, next){
        try {
            const { id } = ctx.user;
            const { content = '' } = ctx.req.body;
            console.log('content', content)
            const result = await service.create(id, content);
            ctx.momentId = result.insertId
            // 添加标签
            next()
        } catch (error) {
            console.log(error)
        }
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
    async userList(ctx, next){
        const { userId } = ctx.params;
        const { offset, size } = ctx.query;
        const [result] = await service.userListOfClassify(userId, offset, size);
        ctx.body = result;
    }
    async userLikeList(ctx, next){
        try {
            const { userId } = ctx.params;
            const { offset, size } = ctx.query;
            const [result] = await service.userLikeMomentList([userId, offset, size]);
            ctx.body = result;
        } catch (error) {
            console.log(error)
        }

    }
    async userPrivacyList(ctx, next){
        console.log(ctx.user)
        const { id } = ctx.user;
        const { offset, size } = ctx.query   
        const [result] = await service.userListOfClassify(id, offset, size, 'isPrivate');
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
        const { id } = ctx.user;

        const [pictureInfo] = await fileService.getPictureByMomentId(momentId);
        const { name } = pictureInfo;  
        const filePath = path.resolve(__dirname, '../../upload/picture/', JSON.stringify(id))
        
        const result = await service.remove(momentId);
        deletePictureFiles(filePath, name);
        ctx.body = result
    }
    // 给动态添加标签
    async addLable (ctx, next){
        const lables = JSON.parse(ctx.req.body.lables);
        const files = ctx.req.files;

        console.log(lables.length, lables)
        
        if(lables.length > 0) {
            const momentId = ctx.momentId;
            const result = await service.addLable(momentId, lables);
        }
        if (files && JSON.stringify(files) !== '[]'){
            await next()
        }else {
            ctx.body = { 
                data: "动态发文本表成功~",
                momentId: ctx.momentId
            }
        }
    }
    // 获取某条动态配图
    async pictureInfo (ctx, next){
        try {
            const { pictureSize, filename } = ctx.params;
            const newFilename = `${filename.split('.')[0]}-${pictureSize}.${filename.split('.')[1]}`;
            const [pictureInfo] = await fileService.getPictureByMomentId(filename)
            if (!pictureInfo) {
                const error = new Error('图片不存在')
                return ctx.app.emit('error', error, ctx)
            }
            ctx.response.set('content-type', pictureInfo.mimetype)
            ctx.body = fs.createReadStream(path.resolve(PICTURE_PATH, pictureInfo.user_id.toString(), newFilename))    
        } catch (error) {
            console.log(error)
        }
    }
}

// 删除本地文件
const deletePictureFiles = (filePath, filename) =>  {
    const fileList = ['-master', '-small', '-middle'];
    const nameText = filename.split('-')[0];
    const fileType = filename.split('-')[1].split('.')[1];

    for (let i in fileList){
        const newName = nameText + fileList[i] + '.' + fileType;
        const newPath = path.resolve(filePath, newName)
        if(fs.existsSync(newPath)){
            fs.unlinkSync(newPath)
            console.log(newName + "文件已删除！")
        }
    }
}

module.exports = new momentController()