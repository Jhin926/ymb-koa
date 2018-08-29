const Koa = require("koa");
const app = new Koa();
const bodyParser = require("koa-bodyparser");
let MongoClient = require('mongodb').MongoClient;

const FormatDate = (date, fmt) => {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
    }
  }
  return fmt
}

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
          reqBody.dt = +new Date();
          reqBody.formatDT = FormatDate(new Date(), 'yyyy-MM-dd hh:mm:ss');
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
