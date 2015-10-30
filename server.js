var http = require('http');
var WebSocketServer = require('ws').Server;
var redis = require('redis');

// Setup Redis pub/sub.
// NOTE: You must create two Redis clients, as 
// the one that subscribes can't also publish.
var host = '127.0.0.1';
var port = 6379;
var pub = redis.createClient(port, host);
var sub = redis.createClient(port, host, { detect_buffers: true });
sub.subscribe('cameras');

// Listen for messages being published to this server.
sub.on('message', function(channel, msg) {
	var data = JSON.parse(msg);
	if (data.action === 'create_stream' && cameras.hasOwnProperty(data.id)) {
		cameras[data.id].send(msg);
	} else if (data.action === 'get_command' && clients.hasOwnProperty(data.client)) {
    clients[data.client].send(msg);
  }
});


var host = process.argv[2] || '127.0.0.1';
var port = process.argv[3] || '8080';
var cameras = {};
var clients = {};
var ws = new WebSocketServer({host:host, port:port});

console.log('create Server:', host, port);
ws.on('connection', function(conn) {
  conn.on('message', function(msg) {
		var data = JSON.parse(msg);
		console.log('debug:', data);
		// camera part:
		if (data.action === 'register_camera') {
			console.log('register camera:', data.id);
			cameras[data.id] = conn;
      conn.camera = data.id;
			conn.send('registerOK');
		} else if (data.action === 'get_command') {
      pub.publish('cameras', msg);
    }

		// client part:
		if (data.action === 'create_stream') {
			console.log('client create stream:', data); 
      clients[data.client] = conn;
      conn.client = data.client;
			pub.publish('cameras', msg);
		}
  });

  // Remove the client from the list.
  conn.on('close', function() {
    if (conn.hasOwnProperty('camera')) {
      delete cameras[conn.camera];
    } else if (conn.hasOwnProperty('client')) {
      delete clients[conn.client];
    }
  });
});
