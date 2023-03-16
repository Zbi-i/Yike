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
        // http://101.42.174.152:8000/users/26/avatar
        const result = await fileService.uploadAvatar(newFileName, originalname, mimetype, size, id)
        ctx.body = result 
    }
    savaPictureInfo (ctx, next) {
        try {
            const files = ctx.req.files;
            const { id } = ctx.user;
            const momentId = ctx.momentId;
            files.forEach(async file => {
                const { filename, mimetype, size, path } = file;
                // 给上传的图片文件添加后缀名
                const suffix = '-master' + '.' + mimetype.split('/')[1];
                const newFileName = filename + suffix;
                const newPaht = path + suffix;
                fs.rename(path, newPaht, err => {
                    if (err) console.log(err)
                })
                const result = await fileService.uploadPictrue(newFileName, mimetype, size, id, momentId)
                ctx.body = result
            });
        } catch (error) {
            console.log(error)
        }   
    }
}

module.exports = new fileController()