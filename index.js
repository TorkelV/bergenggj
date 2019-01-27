/* eslint-disable */
class WorldState{

    constructor(){
        this.gameObjects = [];
        this.objects = {};
        this.id = 0;
        setTimeout(this.spawnCrows.bind(this), 5000);
    }

    get nextId(){
        return ++this.id;
    }

    stopCrowSpawner(){
        clearInterval(this.crowSpawner);
    }

    spawnCrows(){
        this.crowSpawner = setInterval(()=>{
            this.gameObjects.push(new SCrow(this.nextId,0,0))
        },5000)
    }


    update(){
        this.gameObjects.forEach(e=>{
            e.update(this.objects);
            this.objects[e.id] = {type: e.type, rotation: e.rotation, distance: e.distance};
        })
    }

}

class SGameObject{
    constructor(rotation, distance){
        this.rotation = rotation;
        this.distance = distance;
        this.type = "";
    }

    update(rotation,distance,objects){

    }
}

class SCrow extends SGameObject{
    constructor(rotation, distance){
        super(rotation,distance);
        this.type = "crow";
    }

    update(objects){
        let players =  Object.values(objects).filter(e=>e.type==="otherplayer");
        this.position;
        this.rotation;
    }

}


const PORT = process.env.PORT || 5000
var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io').listen(server);

app.use('/',express.static('build/public'))

let worldState = new WorldState()
 
console.log('HELLO');
io.on('connection', (socket) =>{
  console.log('a user is connected')

    socket.on('updatePlayerState', (state) => {
        updatePlayer(socket.id, state)
    });
 
 });

 function updatePlayer(id, state) {
    worldState.objects[id] = state;
 }

setInterval(sendToAllconnectedClients, 33);
setInterval(updateWorldState,33);

function updateWorldState(){
    worldState.update();
}


 function sendToAllconnectedClients() {

   io.emit('objectState', worldState.objects);

 }

 server.listen(PORT);


