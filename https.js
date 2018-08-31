const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('./ali.key'),
  cert: fs.readFileSync('./ali.pem')
};

https.createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('hello world\n');
}).listen(443, function() {
  console.log('server is run');
});
