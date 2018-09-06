const Koa = require("koa");
const https = require("https");
const fs = require("fs");
const app = new Koa();
const bodyParser = require("koa-bodyparser");
let MongoClient = require("mongodb").MongoClient;

const static = require('koa-static');
app.use(static(__dirname + './www'))

var options = {
  key: fs.readFileSync('./214961025560978.key'),
  ca: fs.readFileSync('./chain.pem'),
  cert: fs.readFileSync('./public.pem')
};

function padLeftZero(str) {
  return ("00" + str).substr(str.length);
}
const FormatDate = (date, fmt) => {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  let o = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + "";
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? str : padLeftZero(str)
      );
    }
  }
  return fmt;
};

app.use(bodyParser());

app.use(async ctx => {
  ctx.set("Access-Control-Allow-Origin", "https://yemb.gitee.io");
  ctx.set(
    "Access-Control-Allow-Methods",
    "GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS"
  );

  if (ctx.path === "/save" && ctx.method === "GET") {
    const reqBody = ctx.request.query;

    const db = await MongoClient.connect(
      "mongodb://127.0.0.1:27017",
      { useNewUrlParser: true }
    );

    const col = await db.db("qrcode").collection("users");

    const list = await col.find({"phoneNo": reqBody.phoneNo}).toArray();
    if (list.length > 0) {
      ctx.body = "当前手机号已经存在";
    } else {
      reqBody.dt = +new Date();
      reqBody.formatDT = FormatDate(new Date(), "yyyy-MM-dd hh:mm:ss");
      col.insertOne(reqBody);
      ctx.body = "添加成功";
    }
  } else {
    ctx.body = "<h2>404</h2>";
  }
});

const port =443;

https.createServer(options, app.callback()).listen(port, () => {
  console.log(`server is run at http://localhost:${port}`);
});
// app.listen(port, () => {
//   console.log(`server is run at http://localhost:${port}`);
// });
