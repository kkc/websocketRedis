
var clientID = process.argv[2] || 'client01';
var cameraID = process.argv[3] || uuid.v4();
var port = process.argv[4] || 8080;

var WebSocket = require('ws');

var ws = new WebSocket('ws://localhost:' + port);

var uuid = require('node-uuid');

console.log(ws);
ws.on('open', function open() {
  // register camera
  var msg = {
    'action': 'create_stream',
    'client': clientID,
    'id': cameraID
  };
  ws.send(JSON.stringify(msg));
});

ws.on('message', function message(msg) {
  console.log('get command', msg);
});
