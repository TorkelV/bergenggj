/* eslint-disable */

import * as PIXI from "pixi.js";
import { Controlls } from "./controlls";
import { OtherPlayer, GameObject, Crow, Player } from "./gameobjects"

import { Sound } from './sound';
import { Network} from './network';

let loader = PIXI.loader,
    Sprite = PIXI.Sprite,
    resources = PIXI.loader.resources,
    PI = Math.PI,
    WIDTH = 1024,
    HEIGHT = 768;

let originX = WIDTH/2;
let originY = 200;

let innerWallRadius = 550;
let outerWallRadius = 1300;
let minBoundAngle = 5.5*PI/4;
let maxBoundAngle = 6.5*PI/4;
let scaleY = 0.5;

export class Game {

    constructor() {
        this.app = new PIXI.Application({
            width: WIDTH,
            height: HEIGHT,
            antialias: true,
            transparent: false,
            resolution: 1
        });
        this.time = 0;
        this.gameObjects = {};
        this.player = null;
        this.sprites = {};
        this.container = null;
        this.textures = null;

        this.container = null;

        this.rotationSpeedFactor = 4;
        this.distanceSpeedFactor = 4;
        
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
        }else if(type === "otherplayer"){
            return new OtherPlayer(new Sprite(this.textures["explorer.png"]),rotation,distance);
        }
    }


    loadState(data) {
        Object.keys(data.objects).forEach(k => {
            let o = data.objects[k];
            if(k in this.gameObjects && k !== this.Network.getClientId()){
                this.gameObjects[k].rotation = o.rotation;
                this.gameObjects[k].distance = o.distance;
            }else if(!(k in this.gameObjects)){
                this.gameObjects[k] = this.createGameObject(o.type, o.rotation, o.distance);
                this.gameObjects[k].addToStage(this.app.stage, this.container);
            }
            Object.keys(this.gameObjects).forEach(ck=> {
                if( !(ck in data.objects)){
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
            let angSpeed = Math.atan(this.rotationSpeedFactor / this.player.distance);
            this.player.rotationSpeed = -1 * angSpeed;
        }
        else {
            let angSpeed = Math.atan(this.rotationSpeedFactor / this.player.distance);
            this.player.rotationSpeed = angSpeed;
        }

        if (this.controlls.up === this.controlls.down) {
            this.player.distanceSpeed = 0;
        }
        else if (this.controlls.up) {
            this.player.distanceSpeed = -1 * this.distanceSpeedFactor;
        }
        else {
            this.player.distanceSpeed = this.distanceSpeedFactor;
        }
    }

    start() {
        console.log("Running start()");
        document.body.appendChild(this.app.view);
        loader.add("img/treasureHunter.json").add("crow", "img/crow.png").load(() => {
            this.textures = resources["img/treasureHunter.json"].textures;
            this.textures.crow = resources["crow"].texture;
            this.container = new PIXI.Container();

            this.player = new Player(new Sprite(this.textures["explorer.png"]), 3*Math.PI/2, innerWallRadius, this.Network);
            this.gameObjects[this.Network.getClientId()] = this.player;

            this.player.addToStage(this.app.stage, this.container);

            let circle = new PIXI.Graphics();
            let circleRadius = 6;
            circle.beginFill(0xe74c3c);
            circle.drawCircle(originX, originY, circleRadius); // drawCircle(x, y, radius)
            circle.endFill();
            this.container.addChild(circle);

            let innerWall = new PIXI.Graphics();
            innerWall.lineStyle(3, 0xFFFFFF, 0.5);
            innerWall.drawCircle(originX, originY, innerWallRadius); // drawCircle(x, y, radius)
            this.container.addChild(innerWall);

            let outerWall = new PIXI.Graphics();
            outerWall.lineStyle(3, 0xFFFFFF, 0.5);
            outerWall.drawCircle(originX, originY, outerWallRadius); // drawCircle(x, y, radius)
            this.container.addChild(outerWall);

            this.app.stage.addChild(this.container);

            console.log("Adding gameLoop(delta) to app.ticker");
            this.app.ticker.add(delta => this.gameLoop(delta));
            this.Sound.maintheme();
        });
    }

    // addNPCs(){
    //     if(this.time - this.chestsSpawned* 120 >0){
    //         let chest = new Chest(new Sprite(this.textures["treasure.png"]))
    //         this.gameObjects.push(chest);
    //         chest.addToStage(this.app.stage);
    //         this.chestsSpawned += 1;
    //     }
    // }

    getXYfromRotDist(rotation, distance) {
        let a = Math.cos(rotation - this.viewRotation)*distance;
        let b = Math.sin(rotation - this.viewRotation)*distance;
        let x = originX+a;
        let y = originY-b;
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

        Object.keys(this.gameObjects).forEach(k =>{
            const e = this.gameObjects[k];
            let {r,d} = e.getPosition();
            let {x,y} = this.getXYfromRotDist(r,d);
            e.setScreenCoordinate(x,y)
        });

        this.container.scale.set(1, scaleY);

        Object.keys(this.gameObjects).forEach(k =>{
            const e = this.gameObjects[k];
            e.render(delta);
        });
    }

    fixPayerPositionIfOutsideOfBoundingArea() {
        if (this.player.distance < innerWallRadius) {
            this.player.distance = innerWallRadius;
        }
        if (this.player.distance > outerWallRadius) {
            this.player.distance = outerWallRadius;
        }

        let maxBoundRotation = maxBoundAngle + this.viewRotation;
        let minBoundRotation = minBoundAngle + this.viewRotation;
        if (this.player.rotation > maxBoundRotation) {
            this.viewRotation = this.player.rotation - maxBoundAngle;
        }
        if (this.player.rotation < minBoundRotation) {
            this.viewRotation = this.player.rotation - minBoundAngle;
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