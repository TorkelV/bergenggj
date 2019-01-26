/* eslint-disable */
const PORT = process.env.PORT || 5000
var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io').listen(server);

var userArray = [];
app.use('/',express.static('build/public'))
 
console.log('HELLO');
io.on('connection', (socket) =>{
  console.log('a user is connected')

    
 
 });

  setInterval(sendToAllconnectedClients, 33);

  const state = {
      objects: {
          "1": {type: "crow", rotation: 5 * Math.PI / 4, distance: 550},
          "2": {type: "otherplayer", rotation: 0, distance: 100},
          "3": {type: "otherplayer", rotation: Math.PI, distance: 100}
      }
  }

 function sendToAllconnectedClients() {
   io.emit('state' , {"date": Date.now(), "userCount": io.engine.clientsCount});
   io.emit('objectState', state);
 }


 server.listen(PORT);
