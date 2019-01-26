import * as PIXI from "pixi.js";
let Sprite = PIXI.Sprite;

export class GameObject{
    constructor(sprite, rotation, distance){
        this.sprite = sprite;
        this.sprite.anchor.set(0.5, 1);
        this.pixel = new Sprite();
        this.time = 0;
        this.rotation = rotation;
        this.distance = distance;
        this.rotationSpeed = 0;
        this.distanceSpeed = 0;
       
    }


    addToStage(stage, container){
        container.addChild(this.sprite);
        container.addChild(this.pixel);
    }


    getPosition(){
        return {r: this.rotation, d: this.distance}
    }

    setScreenCoordinate(x,y){
        this.pixel.x = x;
        this.pixel.y = y;
    }

    render(delta){
        this.time += delta;
        this.sprite.x = this.pixel.x;
        this.sprite.y = this.pixel.y;
        return this;
    }

    update(delta){
        // console.log(delta + " " + this.rotation + " " + this.distance + " " + this.rotationSpeed);
        this.rotation += this.rotationSpeed * delta;
        this.distance += this.distanceSpeed * delta;
    }

}

export class Chest extends GameObject{

    constructor(sprite){
        super(sprite);
        this.speed = 5;
    }

    udpate(delta){
        console.log(super.pixel);
        let pixel = super.pixel;
        pixel.x += this.speed*(delta/60);
        pixel.y += this.speed*(delta/60);
    }

}

export class Player extends GameObject{

    constructor(sprite,rotation,distance, network){
        super(sprite,rotation,distance);
        this.network = network;
    }

    update(delta){
        super.update(delta);
        this.network.updatePlayer({"rotation": this.rotation, "distance": this.distance})
    }

}