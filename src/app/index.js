const koa = require('koa');
const app = new koa();

const useRoutes = require('../router')

const bodyParser = require('koa-bodyparser')
const errorHandle = require('./error-handle')

app.useRoutes = useRoutes;
app.use(bodyParser())
app.useRoutes()

app.on('error', errorHandle)

module.exports = app