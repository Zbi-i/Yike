const router = require('koa-router');
const commentRouter = new router({prefix: '/comment'})

const {
    verifyLogin,
    verifyPermission
} = require('../middleware/auth.middleware');
const { create, remove, reply } = require('../controller/comment.controller');

// 发表评论
commentRouter.post('/:momentId', verifyLogin, create)
// 删除评论
commentRouter.delete('/:commentId', verifyLogin, verifyPermission, remove)
// 回复评论
commentRouter.post('/:commentId/reply', verifyLogin, verifyPermission, reply)


module.exports = commentRouter