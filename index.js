/* eslint-disable */
const PORT = process.env.PORT || 5000
var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io').listen(server);

let users = {};
app.use('/',express.static('build/public'))

let worldState = {
    objects: {
        "1": {type: "crow", rotation: 5 * Math.PI / 4, distance: 550},
        "2": {type: "otherplayer", rotation: 0, distance: 100},
        "3": {type: "otherplayer", rotation: Math.PI, distance: 100}
    }
}
 
console.log('HELLO');
io.on('connection', (socket) =>{
  console.log('a user is connected')

    socket.on('updatePlayerState', (state) => {
        updatePlayer(socket.id, state)
    });
 
 });

 function updatePlayer(id, state) {
    users[id] = state;
    worldState.objects[id] = state;
 }

setInterval(sendToAllconnectedClients, 200);



 function sendToAllconnectedClients() {

   io.emit('state' , {"date": Date.now(), "userCount": io.engine.clientsCount});
   io.emit('objectState', worldState);

   io.emit('state', {"date": Date.now(), 
   "userCount": io.engine.clientsCount, "users": users});

 }

 server.listen(PORT);
