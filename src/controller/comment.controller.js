const commentService = require('../service/comment.service')
class commentController{
    async create(ctx, next) {
        try {
            const { momentId } = ctx.params;
            const { id } = ctx.user;
            const { content } = ctx.request.body;
            const result = await commentService.create(id, momentId, content)

            ctx.body = result
        } catch (error) {
            console.log(error)
        }  
    }
    async remove(ctx, next){
        const { commentId } = ctx.params;
        const result = await commentService.remove(commentId)

        ctx.body = result;
    }

    async reply(ctx, next){
        try {
            const { momentId } = ctx.params;
            const { id } = ctx.user;
            const { content, commentId } = ctx.request.body;
            const result = await commentService.reply(id, momentId, commentId, content)
            ctx.body = result
        } catch (error) {
            console.log(error)
        }
        
    }
}

module.exports = new commentController()