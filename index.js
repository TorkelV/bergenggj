/* eslint-disable */

class Const {}
Const.gameWidth = 1024;
Const.gameHeight = 768;
Const.originX = Const.gameWidth / 2;
Const.originY = 250;        
Const.innerWallRadius = 550;
Const.outerWallRadius = 1200;
Const.minBoundAngle = 5.8 * Math.PI / 4;
Const.maxBoundAngle = 6.2 * Math.PI / 4;
Const.scaleY = 0.5;
Const.rotationSpeedFactor = 4;
Const.distanceSpeedFactor = 4;

class WorldState{

    constructor(){
        this.gameObjects = [];
        this.objects = {};
        this.id = 0;
        this.maxCrows = 5;
        this.maxCats = 5;
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
            if(this.gameObjects.filter(e=>e.type==='crow').length < this.maxCats){
                this.gameObjects.push(new SCat(this.nextId,5*Math.PI/4,550))
            }
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

    getDistance(player) {
        let ax = Math.cos(player.rotation) * player.distance;
        let ay = Math.sin(player.rotation) * player.distance;
        let bx = Math.cos(this.rotation) * this.distance;
        let by = Math.sin(this.rotation) * this.distance;
        let cx = ax - bx;
        let cy = ay - by;
        return Math.sqrt(cx*cx+cy*cy);
    }

    getMovementTowards(player) {
        let r = 0;
        let d = 0;
        if (player.distance > this.distance) {
            d = 1;
        }
        else if (player.distance < this.distance) {
            d = -1;
        }
        if (player.rotation > this.rotation) {
            r = 1;
        }
        else if (player.rotation < this.rotation) {
            r = -1;
        }
        return {r: r, d: d};
    }
    
    update(objects){
        let players =  Object.values(objects).filter(e=>e.type==="otherplayer");
        let closestPlayer = null;
        let closestPlayerDist = Number.MAX_VALUE;
        for (let player of players) {
            let dist = this.getDistance(player);
            if (dist < closestPlayerDist) {
                closestPlayerDist = dist;
                closestPlayer = player;
            }
        }
        let {r, d} = this.getMovementTowards(closestPlayer);

        let delta = 1;
        let angSpeed = Math.atan(Const.rotationSpeedFactor / this.distance);
        let rotationSpeed = angSpeed * r;
        this.rotation += rotationSpeed * delta;

        let distanceSpeed = Const.distanceSpeedFactor * d;
        this.distance += distanceSpeed * delta;
    }
}

class SCat extends SGameObject{
    constructor(id,rotation, distance){
        super(id,rotation,distance);
        this.type = "cat";
    }

    getDistance(player) {
        let ax = Math.cos(player.rotation) * player.distance;
        let ay = Math.sin(player.rotation) * player.distance;
        let bx = Math.cos(this.rotation) * this.distance;
        let by = Math.sin(this.rotation) * this.distance;
        let cx = ax - bx;
        let cy = ay - by;
        return Math.sqrt(cx*cx+cy*cy);
    }

    getMovementTowards(player) {
        let r = 0;
        let d = 0;
        if (player.distance > this.distance) {
            d = 1;
        }
        else if (player.distance < this.distance) {
            d = -1;
        }
        if (player.rotation > this.rotation) {
            r = 1;
        }
        else if (player.rotation < this.rotation) {
            r = -1;
        }
        return {r: r, d: d};
    }

    update(objects){
        let players =  Object.values(objects).filter(e=>e.type==="otherplayer");
        let closestPlayer = null;
        let closestPlayerDist = Number.MAX_VALUE;
        for (let player of players) {
            let dist = this.getDistance(player);
            if (dist < closestPlayerDist) {
                closestPlayerDist = dist;
                closestPlayer = player;
            }
        }
        let {r, d} = this.getMovementTowards(closestPlayer);

        let delta = 1;
        let angSpeed = Math.atan(Const.rotationSpeedFactor / this.distance);
        let rotationSpeed = angSpeed * r;
        this.rotation += rotationSpeed * delta;

        let distanceSpeed = Const.distanceSpeedFactor * d;
        this.distance += distanceSpeed * delta;
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


