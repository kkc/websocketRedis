
var WebSocket = require('ws');

var ws = new WebSocket('ws://localhost:8080');

var uuid = require('node-uuid');
var port = process.argv[2] || 8080;
var id = process.argv[3] || uuid.v4();

ws.on('open', function open() {
  // register camera
  var msg = {
    'action': 'register_camera',
    //'id': uuid.v4()
    'id': id
  };
  ws.send(JSON.stringify(msg));
});

ws.on('message', function message(msg) {
  console.log('get command', msg);
  if (msg === 'registerOK') {
    console.log('registerOK');
    return;
  }
  var data = JSON.parse(msg);
  if (data.action === 'create_stream') {
    console.log('create stream:', data); 
    ws.send(JSON.stringify({'action': 'get_command', 'id': id, 'client': data.client}));
  }
});
