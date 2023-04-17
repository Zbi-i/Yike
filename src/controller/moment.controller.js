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
            const files = ctx.req.files;
            console.log("files", files)
            const content = ctx.req.body?.content || '' ;
            console.log(content)
            const result = await service.create(id, content);
            ctx.momentId = result.insertId
            if (JSON.stringify(files) !== '[]'){
                await next()
            }else {
                ctx.body = "动态发表成功~"
            }
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
        const { lables } = ctx.request.body;
        const { momentId } = ctx.params;
        const result = await service.addLable(momentId, lables);
        ctx.body = result
    }
    // 获取某条动态配图
    async pictureInfo (ctx, next){
        const { userId, momentId, filename } = ctx.params;
        console.log(userId, momentId, filename)
        const [pictureInfo] = await fileService.getPictureByMomentId(momentId, filename)
        console.log(pictureInfo)
        ctx.response.set('content-type', pictureInfo.mimetype)
        console.log(path.resolve(PICTURE_PATH,userId,pictureInfo.picture_path))
        ctx.body = fs.createReadStream(path.resolve(PICTURE_PATH,userId,pictureInfo.picture_path)) 
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