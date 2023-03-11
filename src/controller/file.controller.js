const fileService = require('../service/file.service');
const fs = require('fs');
class fileController{
    async savaAvatarInfo (ctx, next) {
        const { filename, mimetype, size, path, originalname } = ctx.req.file;
        const { id } = ctx.user;
        // 给上传的图片文件添加后缀名
        const suffix = '.' + mimetype.split('/')[1];
        const newFileName = filename + suffix;
        const newPaht = path + suffix;
        fs.rename(path, newPaht, err => {
            console.log(err)
        })
        // 保存到数据库
        const result = await fileService.uploadAvatar(newFileName, originalname, mimetype, size, id)
        ctx.body = result 
    }
    savaPictureInfo (ctx, next) {
        const files = ctx.req.files;
        const { id } = ctx.user;
        const { momentId} = ctx.query;
        files.forEach(async file => {
            const { filename, mimetype, size, path } = file;
            // 给上传的图片文件添加后缀名
            const suffix = '.' + mimetype.split('/')[1];
            const newFileName = filename + suffix;
            const newPaht = path + suffix;
            fs.rename(path, newPaht, err => {
                console.log(err)
            })
            await fileService.uploadPictrue(newFileName, mimetype, size, id, momentId)
        });
        ctx.body = "动态发表成功~"       
    }
}

module.exports = new fileController()