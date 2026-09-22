'use strict';
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

// Explicit public files only: never expose package metadata, .git or credentials.
const files = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/index.html', ['index.html', 'text/html; charset=utf-8']],
  ['/app.js', ['app.js', 'text/javascript; charset=utf-8']],
  ['/README.md', ['README.md', 'text/plain; charset=utf-8']]
]);
const server = http.createServer((req, res) => {
  if (!['GET', 'HEAD'].includes(req.method)) {
    res.writeHead(405, { Allow: 'GET, HEAD' });
    return res.end();
  }
  const entry = files.get(req.url.split('?')[0]);
  if (!entry) { res.writeHead(404); return res.end('Not found'); }
  fs.readFile(path.join(__dirname, entry[0]), (error, body) => {
    if (error) { res.writeHead(500); return res.end('Unable to load page'); }
    res.writeHead(200, { 'Content-Type': entry[1], 'Content-Length': body.length });
    res.end(req.method === 'HEAD' ? undefined : body);
  });
});
server.listen(Number(process.env.PORT || 8080), '0.0.0.0');
