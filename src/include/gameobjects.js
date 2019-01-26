import * as PIXI from "pixi.js";
let Sprite = PIXI.Sprite;
export class GameObject{
    constructor(sprite){
        this.sprite = sprite;
        this.object = new Sprite();
        this.time = 0;
    }


    addToStage(stage){
        stage.addChild(this.object);
        stage.addChild(this.sprite);
    }


    render(delta){
        this.time += delta;
        this.sprite.x = this.object.x;
        this.sprite.y = this.object.y;
        this.onRender(delta);
        return this;
    }

    onRender(delta){}

}

export class Chest extends GameObject{

    constructor(sprite){
        super(sprite);
        this.speed = 5;
    }

    onRender(delta){
        let object = super.object;
        object.x += this.speed*(delta/60);
        object.y += this.speed*(delta/60);
    }

}

export class Player extends GameObject{

    constructor(sprite){
        super(sprite);
        this.vx = 0;
        this.vy = 0;
    }

    onRender(delta){
        let object = super.object;
        object.x  = object.x + delta * this.vx;
        object.y = object.y + delta * this.vy;
    }

}