## Websocket + SocketIO POC ##

Starting Step

1. Server
2. Camera
3. User

### POC step ###

#### create servers ####
```
node server 127.0.0.1 8080
node server 127.0.0.1 8081
node server 127.0.0.1 8082
```

#### create cameras ####
```
node cameraClient.js 8080 camera01
node cameraClient.js 8080 camera02
node cameraClient.js 8081 camera03
```

#### create clients ####
```
node userClient.js client01 camera01 8080
node userClient.js client02 camera01 8080
node userClient.js client02 camera02 8081
node userClient.js client03 camera01 8081
```
