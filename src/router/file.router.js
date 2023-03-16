const router = require('koa-router');
const fileRouter = new router({prefix: '/upload'})

const {
    verifyLogin
} = require('../middleware/auth.middleware')
const {
    avatarHandler,
    pictureHandler,
    momentPictureHandle,
    imageResize
} = require('../middleware/file.middleware')
const {
    savaAvatarInfo,
    savaPictureInfo
} = require('../controller/file.controller')

fileRouter.post('/avatar', verifyLogin, avatarHandler, imageResize, savaAvatarInfo)

// 这个方法已经和发表动态写在一起了 请去 moment.router.js 中查看
// fileRouter.post('/picture', verifyLogin, pictureHandler, imageResize, savaPictureInfo)

module.exports = fileRouter