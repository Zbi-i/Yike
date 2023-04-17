const router = require('koa-router')
const likeRouter = new router({prefix: '/like'})

const { create } = require('../controller/like.controller')
const { verifyLogin  } = require('../middleware/auth.middleware');
// 判断是否已经点过喜欢了, 如果点过那么取消掉喜欢
const { verifyLike } = require('../middleware/like.middleware')

likeRouter.post('/', verifyLogin, verifyLike , create);

module.exports = likeRouter