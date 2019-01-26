/* eslint-disable */
const PORT = process.env.PORT || 5000
var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io').listen(server);

var userArray = [];
var totalUserCount = 0;
app.use('/',express.static('build/public'))
 
console.log('HELLO');
io.on('connection', (socket) =>{
  console.log('a user is connected')

    totalUserCount = io.engine.clientsCount;
    
 
 });

  setInterval(sendToAllconnectedClients, 33);

 function sendToAllconnectedClients() {
   io.emit('state' , {"date": Date.now(), "userCount": totalUserCount});
 }


 server.listen(PORT);
