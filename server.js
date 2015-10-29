var http = require('http');
var WebSocketServer = require('ws').Server;
var redis = require('redis');

// Setup Redis pub/sub.
// NOTE: You must create two Redis clients, as 
// the one that subscribes can't also publish.
var pub = redis.createClient();
var sub = redis.createClient();
sub.subscribe('cameras');

// Listen for messages being published to this server.
sub.on('message', function(channel, msg) {
  // Broadcast the message to all connected clients on this server.
	var message = JSON.parse(msg);
	console.log(message);
	console.log(cameras.hasOwnProperty(message.id));
	if (cameras.hasOwnProperty(message.id)) {
		cameras[message.id].send(msg);
	}
});

var cameras = {};
var clients = [];
var ws = new WebSocketServer({host:'127.0.0.1', port:8080});

ws.on('connection', function(conn) {
  // Add this client to the client list.
  clients.push(conn);

  // Listen for data coming from clients.
  conn.on('message', function(msg) {
    // Publish this message to the Redis pub/sub.
		var message = JSON.parse(msg);
		console.log('debug', message);
		// camera part:
		if (message.action === 'register_camera') {
			console.log('register camera:', message.id);
			cameras[message.id] = conn;
			conn.send('registerOK');
    	//pub.publish('global', message);
		}


		// client part:
		if (message.action === 'create_stream') {
			console.log('publish cameras', message); 
			pub.publish('cameras', msg);
		}
  });

  // Remove the client from the list.
  conn.on('close', function() {
    clients.splice(clients.indexOf(conn), 1);
  });
});
