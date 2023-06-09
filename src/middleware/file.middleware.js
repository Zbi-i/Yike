const Multer = require('koa-multer')
const Jimp = require('jimp')

const path = require('path')
const fs = require('fs')

const authService = require('../service/auth.service')
const { getUserId } = require('./auth.middleware')

const { AVATAR_PATH, PICTURE_PATH } = require('../constants/file.path')

// 处理头像上传
const avatarStorage = Multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      // 官方文档：注意 req.body 可能还没有完全填充，这取决于向客户端发送字段和文件到服务器的顺序。
      // 所以这里使用 await 等待异步的接收
      const userId = getUserId()
      const avatarPaht = path.resolve(AVATAR_PATH,userId)
      if(!fs.existsSync(avatarPaht)){
        fs.mkdir(avatarPaht, err => console.log(err));
      }
      cb(null, avatarPaht)
    } catch (error) {
      
    }
  }
})
const avatarUpload = Multer({storage:avatarStorage})
const avatarHandler = avatarUpload.single('avatar')

// 处理动态图片上传
let pictureStorage = Multer.diskStorage({
  destination: async (req, file, cb) => {
      const userId = getUserId()
      const picturePath = path.resolve(PICTURE_PATH,userId)
      if(!fs.existsSync(picturePath)){
        fs.mkdir(picturePath, err => console.log(err));
      }
      cb(null, picturePath)
  }
})
const pictureUpload = Multer({storage:pictureStorage})
const pictureHandler = pictureUpload.array('picture', 9)


const imageResize = async (ctx, next) => {
  try {
    const files = ctx.req?.files || [ctx.req?.file];
    files?.forEach(file => {
      if (!file) return;
      console.log('图片剪切s');
      const suffix = file.mimetype.split('/')[1]
      Jimp.read(file.path).then(image => {
        // image.resize(1280, Jimp.AUTO).write(`${file.path}-large.${suffix}`)
        image.resize(640, Jimp.AUTO).quality(60).write(`${file.path}-middle.${suffix}`)
        image.resize(320, Jimp.AUTO).quality(40).write(`${file.path}-small.${suffix}`)
      })
    })
  } catch (error) {
    console.log(error)
  }

  await next();
}

module.exports = {
    avatarHandler,
    pictureHandler,
    imageResize,
}
