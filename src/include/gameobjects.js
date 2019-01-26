import * as PIXI from "pixi.js";
let Sprite = PIXI.Sprite;
export class GameObject{
    constructor(sprite){
        this.overlay = sprite;
        this.dummy = new Sprite();
        this.time = 0;
    }


    addToStage(stage){
        stage.addChild(this.dummy);
        this.dummy.addChild(this.overlay);
    }


    get sprite(){
        return this.dummy;
    }

    render(delta){
        this.time += delta;
        this.overlay.x = this.sprite.x;
        this.overlay.y = this.sprite.y;
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
        super.sprite.x += this.speed*(delta/60);
        super.sprite.y += this.speed*(delta/60);
    }

}

export class Player extends GameObject{

    constructor(sprite){
        super(sprite);
        this.vx = 0;
        this.vy = 0;
    }

    onRender(delta){
        super.sprite.x  = super.sprite.x + delta * this.vx;
        super.sprite.y = super.sprite.y + delta * this.vy;
    }

}