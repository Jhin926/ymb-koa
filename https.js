const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('./214961025560978.key'),
  ca: fs.readFileSync('./chain.pem'),
  cert: fs.readFileSync('./public.pem')
};

https.createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('hello world\n');
}).listen(443, function() {
  console.log('server is run');
});
