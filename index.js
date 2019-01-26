/* eslint-disable */
const PORT = process.env.PORT || 5000
var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io').listen(server);

var users = {};
app.use('/',express.static('build/public'))
 
console.log('HELLO');
io.on('connection', (socket) =>{
  console.log('a user is connected')

    socket.on('updatePlayerState', (state) => {
        updatePlayer(socket.id, state)
    });
 
 });

 function updatePlayer(id, state) {
    users[id] = state;
 }

setInterval(sendToAllconnectedClients, 33);

 function sendToAllconnectedClients() {
   io.emit('state', {"date": Date.now(), 
   "userCount": io.engine.clientsCount, "users": users});
 }

 server.listen(PORT);
