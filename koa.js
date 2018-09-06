// 注意：引入的方式
// 引入koa
const koa = require('koa');
const app = new koa();

const static = require('koa-static');
// 配置静态web服务的中间件
app.use(static(__dirname+'./www'));
                
// 监听端口≈
app.listen(8080,function(){
    console.log('启动成功');
});
