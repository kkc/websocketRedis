
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
  if (msg === 'registerOK') return;
  var data = JSON.parse(msg);
  console.log(data);
  if (data.action === 'create_stream') {
    console.log('return', data); 
    ws.send(JSON.stringify({'action': 'get_command', 'id': 'camera01', 'client': data.client}));
  }
});
