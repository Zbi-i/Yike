const koaRouter = require('koa-router')
const userRouter = new koaRouter({prefix: '/users'}) 

const { create, avatarInfo, userInfo } = require("../controller/user.controller")
const { verifyUser } = require('../middleware/user.middleware')


userRouter.post('/', verifyUser, create)
userRouter.get('/:userId/avatar', avatarInfo)
// 检查用户名/邮箱是否已经存在
userRouter.post('/info', userInfo)


module.exports = userRouter
