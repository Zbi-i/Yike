const router = require('koa-router')
const loginRouter = new router({prefix: '/login'})

const { verifyAuth, verifyLogin } = require('../middleware/auth.middleware')
const { login, success } = require('../controller/auth.controller')

loginRouter.post('/', verifyAuth, login)
loginRouter.get('/test', verifyLogin, success)

module.exports = loginRouter
