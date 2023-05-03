const koaRouter = require('koa-router')
const userRouter = new koaRouter({prefix: '/users'}) 

const { create, avatarInfo, userInfo, getUserInfo } = require("../controller/user.controller")
const { verifyUser } = require('../middleware/user.middleware')


userRouter.post('/', verifyUser, create)
// 获取用户头像
userRouter.get('/:userId/avatar/:avatarSize', avatarInfo)
// 检查用户名/邮箱是否已经存在
userRouter.post('/info', userInfo)
// 根据id查找用户信息
userRouter.get('/:userId', getUserInfo)


module.exports = userRouter
