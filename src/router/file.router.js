const router = require('koa-router');
const fileRouter = new router({prefix: '/upload'})

const {
    verifyLogin
} = require('../middleware/auth.middleware')
const {
    avatarHandler,
    pictureHandler,
    imageResize
} = require('../middleware/file.middleware')
const {
    savaAvatarInfo,
    savaPictureInfo
} = require('../controller/file.controller')

fileRouter.post('/avatar', verifyLogin, avatarHandler, imageResize, savaAvatarInfo)
fileRouter.post('/picture', verifyLogin, pictureHandler, imageResize, savaPictureInfo)

module.exports = fileRouter