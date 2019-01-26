import * as PIXI from "pixi.js";
let Point = PIXI.Sprite;

export class GameObject{
    constructor(sprite, rotation, distance){
        this.sprite = sprite;
        this.pixel = new Point(0, 0);
        this.time = 0;
        this.rotation = rotation;
        this.distance = distance;
        this.rotationSpeed = 0;
    }


    addToStage(stage, container){
        stage.addChild(this.sprite);
        container.addChild(this.pixel);
    }


    getPosition(){
        return {r: this.rotation, d: this.distance}
    }

    render(delta,x,y){
        this.time += delta;
        this.pixel.x = x;
        this.pixel.y = y;

        this.sprite.x = this.pixel.x + this.sprite.width / 2;
        this.sprite.y = this.pixel.y - this.sprite.height;
        return this;
    }

    update(delta){
        // console.log(delta + " " + this.rotation + " " + this.distance + " " + this.rotationSpeed);
        this.rotation += this.rotationSpeed * delta;
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

    constructor(sprite,rotation,distance){
        super(sprite,rotation,distance);
    }

    update(delta){
        super.update(delta);
    }

}