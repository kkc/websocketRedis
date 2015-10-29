
var WebSocket = require('ws');

var ws = new WebSocket('ws://localhost:8080');

var uuid = require('node-uuid');

ws.on('open', function open() {
  // register camera
  var msg = {
    'action': 'register_camera',
    //'id': uuid.v4()
    'id': 'camera01'
  };
  ws.send(JSON.stringify(msg));
});

ws.on('message', function message(msg) {
  console.log('get command', msg);
  if (msg.action === 'create_stream') {
    ws.send(JSON.stringify({'action': 'get_command', 'id': 'camera01'}));
  }
});