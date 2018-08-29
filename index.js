const Koa = require("koa");
const app = new Koa();
const bodyParser = require("koa-bodyparser");
let MongoClient = require('mongodb').MongoClient;

app.use(bodyParser());

app.use(async ctx => {
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Methods', 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS');

  if (ctx.path === "/save" && ctx.method === "GET") {
    const reqBody = ctx.request.query;
    await MongoClient.connect('mongodb://127.0.0.1:27017', {useNewUrlParser:true}, (err, db) => {
      if (err) throw err;
      const list = db.db('qrcode').collection('users');
      list.find({"phoneNo": reqBody.phoneNo}).toArray((err, result) => {
        if (err) throw err;
        if (result.length <= 0) {
          list.insertOne(reqBody, (err, result) => {
            if (err) throw err;
            ctx.body = 'success';
          });
        }else {
          ctx.body = 'user has register'
        }
      });
    });
  } else {
    ctx.body = "<h2>404</h2>";
  }
});

app.listen(80, () => {
  console.log("server is run");
});
