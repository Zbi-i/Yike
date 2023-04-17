const { getUserId } = require('../middleware/auth.middleware');
const likeService = require('../service/like.service');
class likeController {
    async create (ctx, next) {
        try {
            const { momentId } = ctx.request.body;
            const { id } = ctx.user;
            console.log(momentId, id)
            const result = await likeService.create(momentId, id)
            if (result.affectedRows > 0) ctx.body = true
        } catch (error) {
            console.log(error)
        }
       
    }
}

module.exports = new likeController()