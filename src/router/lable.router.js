const router = require('koa-router')
const lableRouter = new router({prefix: '/lable'})

const {
    verifyLogin
} = require('../middleware/auth.middleware')

const { 
    create,
    list
} = require('../controller/lable.controller')

// 创建标签
lableRouter.post('/', verifyLogin, create)
// 获取标签列表
lableRouter.get('/', list)

module.exports = lableRouter