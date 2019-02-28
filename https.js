const https = require('https');
const fs = require('fs');

// const options = {
//   pfx: fs.readFileSync('./keys/1272070_www.yemb.ren.pfx'),
//   passphrase: 'pfx-password.txt'
// };
// https.createServer(options, (req, res) => {
//   res.writeHead(200);
//   res.end('hello world\n');
// }).listen(8000);
const options = {
  key: fs.readFileSync('./keys/1870777_www.yemb.ren.key'),
  cert: fs.readFileSync('./keys/1870777_www.yemb.ren.pem')
};

https.createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('hello world\n');
}).listen(443, function() {
  console.log('server is run');
});
