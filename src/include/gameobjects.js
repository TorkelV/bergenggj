import * as PIXI from "pixi.js";
let Sprite = PIXI.Sprite;

let WIDTH = 1024;
let originX = WIDTH/2;
let originY = 200;

export class GameObject{
    constructor(sprite){
        this.sprite = sprite;
        this.pixel = new Sprite();
        this.time = 0;
    }


    addToStage(stage, container){
        stage.addChild(this.sprite);
        container.addChild(this.pixel);
    }


    render(delta){
        this.time += delta;

        let {x, y} = this.getXYfromRotDist(this.explorerRot, this.explorerDist);
        this.pixel.x = x;
        this.pixel.y = y;

        this.sprite.x = this.pixel.x;
        this.sprite.y = this.pixel.y;
        this.onRender(delta);
        return this;
    }

    getXYfromRotDist(rotation, distance) {
        let a = Math.cos(rotation + this.ViewRotation)*distance;
        let b = Math.sin(rotation + this.ViewRotation)*distance;
        let x = originX+a;
        let y = originY-b;
        return {x: x, y: y};
    }

    onRender(delta){}

}

export class Chest extends GameObject{

    constructor(sprite){
        super(sprite);
        this.speed = 5;
    }

    onRender(delta){
        console.log(super.pixel);
        let pixel = super.pixel;
        pixel.x += this.speed*(delta/60);
        pixel.y += this.speed*(delta/60);
    }

}

export class Player extends GameObject{

    constructor(sprite){
        super(sprite);
        this.vx = 0;
        this.vy = 0;
    }

    onRender(delta){
        console.log(super.pixel);
        let pixel = super.pixel;
        pixel.x  = pixel.x + delta * this.vx;
        pixel.y = pixel.y + delta * this.vy;
    }

}