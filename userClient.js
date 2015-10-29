
var WebSocket = require('ws');

var ws = new WebSocket('ws://localhost:8080');

var uuid = require('node-uuid');

ws.on('open', function open() {
  // register camera
  var msg = {
    'action': 'create_stream',
    'id': 'camera01'
  };
  ws.send(JSON.stringify(msg));
});

ws.on('message', function message(msg) {
  console.log('get command', msg);
});
