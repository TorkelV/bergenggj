/* eslint-disable */

import * as PIXI from "pixi.js";
import { Controlls } from "./controlls";
import { OtherPlayer, GameObject, Crow, Player } from "./gameobjects"
import { Const } from "./const"
import { Sound } from './sound';
import { Network} from './network';

let loader = PIXI.loader,
    Sprite = PIXI.Sprite,
    resources = PIXI.loader.resources,
    PI = Math.PI;

export class Game {

    constructor() {
        this.app = new PIXI.Application({
            width: Const.gameWidth,
            height: Const.gameHeight,
            antialias: true,
            transparent: false,
            resolution: 1
        });
        this.time = 0;
        this.gameObjects = {};
        this.player = null;
        this.sprites = {};
        this.textures = null;

        this.container = null;
        this.ground = null;

        this.viewRotation = 0;
        this.viewRotationSpeed = 0;

        this.controlls = new Controlls(() => { this.handleControllChange(); });
        this.Sound = new Sound();
        this.Network = new Network();

        this.start();


        setTimeout(()=>{
            this.Network.listenState(this.loadState.bind(this));
        }, 2000);


    }



    createGameObject(type,rotation,distance){
        if(type === "crow"){
            return new Crow(new Sprite(this.textures.crow),rotation,distance);
        }
        else if(type === "otherplayer"){
            return new OtherPlayer(new Sprite(this.textures["explorer.png"]),rotation,distance);
        }else if(type === "cat"){
            return new Cat(new Sprite(this.textures.cat),rotation,distance);
        }
    }


    loadState(data) {
        Object.keys(data).forEach(k => {
            let o = data[k];
            if(k in this.gameObjects && k !== this.Network.getClientId()){
                this.gameObjects[k].rotation = o.rotation;
                this.gameObjects[k].distance = o.distance;
            }else if( !(k in this.gameObjects) ){
                this.gameObjects[k] = this.createGameObject(o.type, o.rotation, o.distance);
                this.gameObjects[k].addToStage(this.app.stage, this.container);
            }
            Object.keys(this.gameObjects).forEach(ck=> {
                if( !(ck in data)){
                    this.gameObjects[ck].destroy();
                    delete this.gameObjects[ck];
                }
            })
        });
    }


    handleControllChange() {

        if (this.controlls.left === this.controlls.right) {
            this.player.rotationSpeed = 0;
        }
        else if (this.controlls.left) {
            let angSpeed = Math.atan(Const.rotationSpeedFactor / this.player.distance);
            this.player.rotationSpeed = -1 * angSpeed;
        }
        else {
            let angSpeed = Math.atan(Const.rotationSpeedFactor / this.player.distance);
            this.player.rotationSpeed = angSpeed;
        }

        if (this.controlls.up === this.controlls.down) {
            this.player.distanceSpeed = 0;
        }
        else if (this.controlls.up) {
            this.player.distanceSpeed = -1 * Const.distanceSpeedFactor;
        }
        else {
            this.player.distanceSpeed = Const.distanceSpeedFactor;
        }
    }

    start() {
        console.log("Running start()");
        document.body.appendChild(this.app.view);
        loader.add("img/treasureHunter.json")
        .add("crow", "img/crow.png")
        .add("house", "img/house.png")
        .add("player", "img/player.png")
        .add("ground", "img/ground.png")
        .load(() => 
        {
            this.textures = resources["img/treasureHunter.json"].textures;
            this.textures.crow = resources["crow"].texture;
            this.textures.house = resources["house"].texture;
            this.textures.player = resources["player"].texture;
            this.textures.ground = resources["ground"].texture;
            this.container = new PIXI.Container();

            this.ground = new Sprite(this.textures.ground);
            this.ground.anchor.set(0.5, 0.5);
            this.ground.scale.set(3, 3);
            this.ground.position.set(Const.originX, Const.originY);
            this.container.addChild(this.ground);

            let house = new Sprite(this.textures.house);
            house.anchor.set(0.5);
            house.scale.set(0.25, 0.25);
            house.position.set(Const.originX, Const.originY);
            this.container.addChild(house);

            this.player = new Player(new Sprite(this.textures.player), 3*Math.PI/2, Const.innerWallRadius, this.Network);
            this.gameObjects[this.Network.getClientId()] = this.player;
            this.player.addToStage(this.app.stage, this.container);

            // let innerWall = new PIXI.Graphics();
            // innerWall.lineStyle(3, 0xFFFFFF, 0.5);
            // innerWall.drawCircle(originX, originY, innerWallRadius); // drawCircle(x, y, radius)
            // this.container.addChild(innerWall);

            // let outerWall = new PIXI.Graphics();
            // outerWall.lineStyle(3, 0xFFFFFF, 0.5);
            // outerWall.drawCircle(originX, originY, outerWallRadius); // drawCircle(x, y, radius)
            // this.container.addChild(outerWall);

            this.app.stage.addChild(this.container);

            console.log("Adding gameLoop(delta) to app.ticker");
            this.app.ticker.add(delta => this.gameLoop(delta));
            this.Sound.maintheme();
        });
    }

    getXYfromRotDist(rotation, distance) {
        let a = Math.cos(rotation - this.viewRotation)*distance;
        let b = Math.sin(rotation - this.viewRotation)*distance;
        let x = Const.originX+a;
        let y = Const.originY-b;
        return {x: x, y: y};
    }

    gameLoop(delta) {
        this.container.scale.set(1, 1);
        this.time += delta;
        Object.keys(this.gameObjects).forEach(k =>{
            const e = this.gameObjects[k];
            e.update(delta);
        });

        this.fixPayerPositionIfOutsideOfBoundingArea();
        this.ground.rotation = this.viewRotation;

        Object.keys(this.gameObjects).forEach(k =>{
            const e = this.gameObjects[k];
            let {r,d} = e.getPosition();
            let {x,y} = this.getXYfromRotDist(r,d);
            e.setScreenCoordinate(x,y)
        });

        this.container.scale.set(1, Const.scaleY);

        Object.keys(this.gameObjects).forEach(k =>{
            const e = this.gameObjects[k];
            e.render(delta);
        });
    }

    fixPayerPositionIfOutsideOfBoundingArea() {
        if (this.player.distance < Const.innerWallRadius) {
            this.player.distance = Const.innerWallRadius;
        }
        if (this.player.distance > Const.outerWallRadius) {
            this.player.distance = Const.outerWallRadius;
        }

        let maxBoundRotation = Const.maxBoundAngle + this.viewRotation;
        let minBoundRotation = Const.minBoundAngle + this.viewRotation;
        if (this.player.rotation > maxBoundRotation) {
            this.viewRotation = this.player.rotation - Const.maxBoundAngle;
        }
        if (this.player.rotation < minBoundRotation) {
            this.viewRotation = this.player.rotation - Const.minBoundAngle;
        }
        // if (this.ViewRotation + this.player.rotation > maxBoundAngle) {
        //     let diff = this.player.rotation - this.ViewRotation;
        //     this.ViewRotation += diff;
        // }

        // if (this.player.rotation > 2*PI) {
        //     this.player.rotation -= 2*PI;
        //     console.log("Player rotation overflow");
        // }
        // if (this.player.rotation < 0) {
        //     this.player.rotation += 2*PI;
        //     console.log("Player rotation underflow");
        // }
        // if (this.viewRotation > 2*PI) {
        //     this.viewRotation -= 2*PI;
        //     console.log("View rotation overflow");
        // }
        // if (this.viewRotation < 0) {
        //     this.viewRotation += 2*PI;
        //     console.log("View rotation underflow");
        // }

    }

}