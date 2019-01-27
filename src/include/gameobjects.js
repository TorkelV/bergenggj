import * as PIXI from "pixi.js";
let Sprite = PIXI.Sprite;

export class GameObject{
    constructor(sprite, rotation, distance){
        this.sprite = sprite;
        this.sprite.anchor.set(0.5, 1);
        this.sprite.scale.set(1, 2);
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


    destroy(){
        this.sprite.destroy();
        this.pixel.destroy();
    }

    getPosition(){
        return {r: this.rotation, d: this.distance};
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
        this.rotation += this.rotationSpeed * delta;
        this.distance += this.distanceSpeed * delta;
    }

}

export class Player extends GameObject{

    constructor(sprite,rotation,distance, network,textures){
        super(sprite,rotation,distance);
        this.network = network;
        this.hitting = false;
        this.textures = textures;
    }

    update(delta){
        super.update(delta);
        if(this.hitting && this.sprite._texture.textureCacheIds[0] !== "playerHitting"){
            this.sprite.texture = this.textures.playerHitting;
        } else if(!this.hitting && this.sprite._texture.textureCacheIds[0] !== "playerSprite"){
            this.sprite.texture = this.textures.playerSprite;
        }
        this.network.updatePlayer({type: "otherplayer", "rotation": this.rotation, "distance": this.distance, "hitting":this.hitting});
    }

}

export class OtherPlayer extends GameObject{

    constructor(sprite,rotation,distance,textures){
        super(sprite,rotation,distance);
        this.hitting = false;
        this.textures = textures;
    }

    update(delta){
        super.update(delta);
        if(this.hitting && this.sprite._texture.textureCacheIds[0] !== "playerHitting"){
            this.sprite.texture = this.textures.playerHitting;
        } else if(!this.hitting && this.sprite._texture.textureCacheIds[0] !== "playerSprite"){
            this.sprite.texture = this.textures.playerSprite;
        }
    }
}

export class Crow extends GameObject {
    constructor(sprite,rotation,distance){
        super(sprite,rotation,distance);
    }

    // eslint-disable-next-line no-unused-vars
    update(delta){

    }
}

export class Cat extends GameObject {
    constructor(sprite,rotation,distance){
        super(sprite,rotation,distance);
    }

    update(delta){

    }
}