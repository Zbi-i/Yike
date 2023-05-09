const router = require('koa-router')
const { verifyLogin, verifyPermission } = require('../middleware/auth.middleware')
const { 
    create, 
    detail, 
    list, 
    userList,
    userLikeList, 
    userPrivacyList, 
    updated, 
    remove, 
    addLable, 
    pictureInfo,
    yikeList,
    yikeDetail
} = require('../controller/moment.controller')
const momentRouter = new router({prefix: '/moment'})
const {
    pictureHandler,
    imageResize,
} = require('../middleware/file.middleware')
const {
    savaPictureInfo
} = require('../controller/file.controller')

// 发表动态
// verifyLogin 判断是否登录
// pictureHandler 处理动态配图
// create 创建动态文本
// imageResize 裁剪图片
// savapictureInfo 保存图片信息到数据库
momentRouter.post('/', verifyLogin, pictureHandler, create, addLable, imageResize, savaPictureInfo)
// 获取一组动态
momentRouter.get('/list', list)
// 获取某一条动态
momentRouter.get('/:momentId', detail)

// 获取某一个用户的动态
momentRouter.get('/user/:userId', userList)
// 获取某一个用户喜欢过的动态
momentRouter.get('/user/:userId/like', userLikeList)
// 获取某一个用户隐私的动态
momentRouter.post('/user/private', verifyLogin, userPrivacyList)

// 获取某条动态配图
momentRouter.get('/picture/:pictureSize/:filename', pictureInfo)

// 获取一组时刻
momentRouter.get('/yike/list', yikeList)
// 获取一条时刻
momentRouter.get('/yike/:yikeId', yikeDetail)

// 1.判断用户是否登录 2.判断是否具备权限（用户只可以修改删除自己发布的内容）
// 修改某一条动态
momentRouter.patch('/:momentId', verifyLogin, verifyPermission, updated)
// 删除某一条动态
momentRouter.delete('/:momentId', verifyLogin, verifyPermission, remove)
// 给动态添加标签
// momentRouter.post('/:momentId/lable', verifyLogin, verifyPermission, addLable)

module.exports = momentRouter;