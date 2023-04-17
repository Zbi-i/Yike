const koa = require('koa');
const app = new koa();

const useRoutes = require('../router')

const bodyParser = require('koa-bodyparser')
const errorHandle = require('./error-handle')

app.use(async (ctx, next)=> {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set("Access-Control-Allow-Credentials", "true");
    // 允许的访问方法
    ctx.set("Access-Control-Allow-Methods","POST, GET, PUT, OPTIONS, DELETE, PATCH");
    
    return next()
 });

app.useRoutes = useRoutes;
app.use(bodyParser())
app.useRoutes()



app.on('error', errorHandle)

module.exports = app