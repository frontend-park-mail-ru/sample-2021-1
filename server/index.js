const http = require('http');
const fs = require('fs');
const debug = require('debug');

const log = debug('server');

const server = http.createServer((req, res) => {
  log('request', req.url); // /main.css
  let file = 'index.html';

  if (req.url !== '/') {
    file = req.url.replace('/', '');
  }

  fs.readFile(`public/${file}`, (err, data) => {
    if (err) {
      log('error', err);

      res.end();

      return;
    }

    res.write(data);

    res.end();
  });

});

server.listen(3000);
