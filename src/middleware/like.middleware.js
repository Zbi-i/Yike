const likeService = require('../service/like.service')
const verifyLike = async (ctx, next) => {
    try {
        const { momentId } = ctx.request.body;
        const { id } = ctx.user;
        const result =  await likeService.userIsLiek(momentId, id)
        console.log(momentId)
        if(result.count > 0){
            // 取消喜欢
            const likeResult = await likeService.remove(momentId, id)
            ctx.body = false
        } else {
        console.log(momentId)
           await next();
        }
    } catch (error) {
        console.log(error)
    }
    
}

module.exports = {
    verifyLike
}