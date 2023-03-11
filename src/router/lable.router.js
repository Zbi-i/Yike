const router = require('koa-router')
const lableRouter = new router({prefix: '/lable'})

const {
    verifyLogin
} = require('../middleware/auth.middleware')

const { 
    create,
    list
} = require('../controller/lable.controller')

lableRouter.post('/', verifyLogin, create)
lableRouter.get('/', list)

module.exports = lableRouter