/* eslint-disable */
class WorldState{

    constructor(){
        this.gameObjects = [];
        this.objects = {};
        this.id = 0;
        this.maxCrows = 5;
        setTimeout(this.spawnCrows.bind(this), 5000);
        setTimeout(this.spawnCats.bind(this), 5000);
    }

    get nextId(){
        return ++this.id;
    }

    stopCrowSpawner(){
        clearInterval(this.crowSpawner);
    }

    spawnCrows(){
        this.crowSpawner = setInterval(()=>{
            if(this.gameObjects.filter(e=>e.type==='crow').length < this.maxCrows){
                this.gameObjects.push(new SCrow(this.nextId,5*Math.PI/4,550))
            }
        },5000)
    }

    stopCatSpawner(){
        clearInterval(this.catSpawner);
    }

    spawnCats(){
        this.catSpawner = setInterval(()=>{
            this.gameObjects.push(new SCat(this.nextId,5*Math.PI/4,550))
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
    constructor(id,rotation, distance){
        this.rotation = rotation;
        this.distance = distance;
        this.type = "";
        this.id = id;
    }

    update(rotation,distance,objects){

    }
}

class SCrow extends SGameObject{
    constructor(id,rotation, distance){
        super(id,rotation,distance);
        this.type = "crow";
    }

    update(objects){
        let players =  Object.values(objects).filter(e=>e.type==="otherplayer");
        this.position += 0.005;
        this.rotation += 0.005;
    }

}

class SCat extends SGameObject{
    constructor(id,rotation, distance){
        super(id,rotation,distance);
        this.type = "cat";
    }

    update(objects){
        let players =  Object.values(objects).filter(e=>e.type==="otherplayer");
        this.position += 0.005;
        this.rotation += 0.005;
    }

}




const PORT = process.env.PORT || 5000
var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io').listen(server);

app.use('/',express.static('build/public'))

let worldState = new WorldState()
 
io.on('connection', (socket) =>{
    socket.on('updatePlayerState', (state) => {
        updatePlayer(socket.id, state)
    });
    socket.on('disconnect', function(){
        removePlayer(socket.id);
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

 function removePlayer(id) {
  delete worldState.objects[id];
 }


 server.listen(PORT);


