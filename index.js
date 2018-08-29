const Koa = require('koa');
const app = new Koa();
app.use((ctx) => {
  ctx.body = "hello world";
});
app.listen(8099);
console.log("德玛西亚");
