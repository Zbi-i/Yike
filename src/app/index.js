const koa = require('koa');
const app = new koa();

const useRoutes = require('../router')

const bodyParser = require('koa-bodyparser')
const errorHandle = require('./error-handle')

app.use(async (ctx, next)=> {
    ctx.set('Access-Control-Allow-Origin', 'http://localhost:8001');
    return next()
 });

app.useRoutes = useRoutes;
app.use(bodyParser())
app.useRoutes()



app.on('error', errorHandle)

module.exports = app