#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');
const http = require('http');

const port = process.env.PORT || 3000;
const nextBin = path.join(__dirname, '..', 'node_modules', '.bin', process.platform === 'win32' ? 'next.cmd' : 'next');

const child = spawn(nextBin, ['dev', '-p', String(port)], { stdio: ['inherit', 'pipe', 'pipe'] });

let opened = false;
function open(url) {
  const platform = process.platform;
  let cmd, args;
  if (platform === 'darwin') { cmd = 'open'; args = [url]; }
  else if (platform === 'win32') { cmd = 'cmd'; args = ['/c', 'start', '', url]; }
  else { cmd = 'xdg-open'; args = [url]; }
  spawn(cmd, args, { detached: true, stdio: 'ignore' }).unref();
}

function tryOpen() {
  if (opened) return;
  const req = http.get({ host: '127.0.0.1', port, path: '/' }, res => {
    if (res.statusCode) {
      opened = true;
      open(`http://localhost:${port}`);
    }
    res.resume();
  });
  req.on('error', () => {});
}

const poll = setInterval(tryOpen, 500);

child.stdout.on('data', d => {
  process.stdout.write(d);
  const s = d.toString();
  if (!opened && /Local: *http:\/\/localhost:\d+/.test(s)) {
    opened = true;
    open(`http://localhost:${port}`);
  }
});
child.stderr.on('data', d => process.stderr.write(d));
child.on('exit', code => {
  clearInterval(poll);
  process.exit(code);
});

