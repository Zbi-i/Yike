const router = require('koa-router')
const { verifyLogin, verifyPermission } = require('../middleware/auth.middleware')
const { create, detail, list, updated, remove, addLable, pictureInfo } = require('../controller/moment.controller')
const momentRouter = new router({prefix: '/moment'})
const {
    pictureHandler,
    imageResize,
} = require('../middleware/file.middleware')
const {
    savaPictureInfo
} = require('../controller/file.controller')

// 发表动态
momentRouter.post('/', verifyLogin, pictureHandler, create, imageResize, savaPictureInfo)
// 获取一组动态
momentRouter.get('/list', list)
// 获取某一条动态
momentRouter.get('/:momentId', detail)
// 获取某条动态配图
momentRouter.get('/:userId/:momentId/:fileName', pictureInfo)

// 1.判断用户是否登录 2.判断是否具备权限（用户只可以修改删除自己发布的内容）
// 修改某一条动态
momentRouter.patch('/:momentId', verifyLogin, verifyPermission, updated)
// 删除某一条动态
momentRouter.delete('/:momentId', verifyLogin, verifyPermission, remove)
// 给动态添加标签
momentRouter.post('/:momentId/lable', verifyLogin, verifyPermission, addLable)

module.exports = momentRouter;