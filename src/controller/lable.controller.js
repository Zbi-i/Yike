const lableService = require('../service/lable.service')

class lableController{
    async create(ctx, next) {
        const { name } = ctx.request.body;
        console.log(name)
        const result = await lableService.create(name)
        ctx.body = result;
    }
    
    async list(ctx, next) {
        const { offset, limit } = ctx.query
        const result = await lableService.getLables(offset, limit);
        ctx.body = result;
    }
}


module.exports = new lableController()