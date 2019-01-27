export class WorldState{

    constructor(){
        this.gameObjects = [];
        this.objects = {};
        this.id = 0;
        setTimeout(this.spawnCrows, 5000);
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
            e.update();
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

class SCrow extends SGameObject(){
    constructor(rotation, distance){
        super(rotation,distance);
        this.type = "crow";
    }

    update(rotation,distance,objects){
       let players =  objects.values().filter(e=>e.type==="otherplayer");



    }

}