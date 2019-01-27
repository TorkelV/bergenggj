import * as PIXI from "pixi.js";
import { Const } from "./const";
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
        this.scale = {x: 1, y: 2};
        this.previousScaleDirection = 1;
        this.scaleDirection = 1;
        this.hittable = false;
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

    getScaleFactor() {
        let movableDist = Const.outerWallRadius - Const.innerWallRadius;
        let movedDist = this.distance - Const.innerWallRadius;
        return movedDist / movableDist / 2 + 0.5;
    }

    setScreenCoordinate(x,y){
        this.pixel.x = x;
        this.pixel.y = y;
    }

    setScaleDirection(rotation) {
        this.scaleDirection = this.previousScaleDirection;
        if (rotation != this.rotation) {
            this.scaleDirection = this.rotation > rotation ? 1 : -1;
            this.previousScaleDirection = this.scaleDirection;
        }
    }

    render(delta){
        this.time += delta;

        let scaleByDistFacotor = this.getScaleFactor();
        let playerScaleDirectionBugCompensator = 1;
        if (this instanceof Player) {
            playerScaleDirectionBugCompensator = -1;
        }

        this.sprite.x = this.pixel.x;
        this.sprite.y = this.pixel.y;

        let xScale = this.scale.x * scaleByDistFacotor * this.scaleDirection * playerScaleDirectionBugCompensator;
        this.sprite.scale.set(xScale, this.scale.y * scaleByDistFacotor);
        return this;
    }

    update(delta){
        let newRotation = this.rotation + this.rotationSpeed * delta;
        this.setScaleDirection(newRotation);
        this.rotation = newRotation;
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

    setHitting(spaceIsDown) {
        let freshHitAction = false;
        if (!this.hitting && spaceIsDown) {
            freshHitAction = true;
        }
        this.hitting = spaceIsDown;
        return freshHitAction;
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
        this.hittable = true;
    }

    // eslint-disable-next-line no-unused-vars
    update(delta){

    }
}

export class Cat extends GameObject {
    constructor(sprite,rotation,distance){
        super(sprite,rotation,distance);
        this.hittable = true;
    }

    update(delta){

    }
}