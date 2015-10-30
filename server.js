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
	var data = JSON.parse(msg);
	if (data.action === 'create_stream' && cameras.hasOwnProperty(data.id)) {
		cameras[data.id].send(msg);
	} else if (data.action === 'get_command' && clients.hasOwnProperty(data.client)) {
    clients[data.client].send(msg);
  }
});


var cameras = {};
var clients = {};
var ws = new WebSocketServer({host:'127.0.0.1', port:8080});

ws.on('connection', function(conn) {
  // Listen for data coming from clients.
  conn.on('message', function(msg) {
    // Publish this message to the Redis pub/sub.
		var data = JSON.parse(msg);
		console.log('debug', data);
		// camera part:
		if (data.action === 'register_camera') {
			console.log('register camera:', data.id);
			cameras[data.id] = conn;
			conn.send('registerOK');
    	//pub.publish('global', data);
		} else if (data.action === 'get_command') {
      pub.publish('cameras', msg);
    }

		// client part:
		if (data.action === 'create_stream') {
			console.log('publish cameras', data); 
      clients[data.client] = conn;
			pub.publish('cameras', msg);
		}
  });

  // Remove the client from the list.
  conn.on('close', function() {
    clients.splice(clients.indexOf(conn), 1);
  });
});
