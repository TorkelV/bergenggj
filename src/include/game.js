/* eslint-disable */

import * as PIXI from "pixi.js";
import { Controlls } from "./controlls";
import { Chest, Player, GameObject } from "./gameobjects"
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
        this.sprites = {};
        this.time = 0;
        this.chestsSpawned = 0;
        this.gameObjects = [];
        this.player = null;

        this.container = null;

        this.rotationSpeedFactor = 4;
        this.distanceSpeedFactor = 4;
        
        this.viewRotation = PI/16;

        this.controlls = new Controlls(() => { this.handleControllChange(); });
        this.Sound = new Sound();
        this.start();
        this.Network = new Network();
        this.Network.listen(this.test);

    }

    test(payload){
        // evil innerhtml
        document.getElementById('time').innerHTML = payload.date;
        document.getElementById('userCount').innerHTML = payload.userCount;

    }

    handleControllChange() {
        if (this.controlls.left == this.controlls.right) {
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

        if (this.controlls.up == this.controlls.down) {
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
        loader.add("img/treasureHunter.json").load(() => {
            this.textures = resources["img/treasureHunter.json"].textures;

            this.container = new PIXI.Container();

            this.player = new Player(new Sprite(this.textures["explorer.png"]), 3*Math.PI/2, innerWallRadius);
            this.gameObjects.push(this.player);
            this.player.addToStage(this.app.stage, this.container);

            let tmp1 = new GameObject(new Sprite(this.textures["explorer.png"]), 0, 100);
            tmp1.addToStage(this.app.stage, this.container);
            this.gameObjects.push(tmp1);

            let tmp2 = new GameObject(new Sprite(this.textures["explorer.png"]), PI, 100);
            tmp2.addToStage(this.app.stage, this.container);
            this.gameObjects.push(tmp2);

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
        this.gameObjects.forEach(e =>{
            e.update(delta);
        });

        this.fixPayerPositionIfOutsideOfBoundingArea();

        this.gameObjects.forEach(e =>{
            let {r,d} = e.getPosition();
            let {x,y} = this.getXYfromRotDist(r,d);
            e.setScreenCoordinate(x,y)
        });

        this.container.scale.set(1, scaleY);

        this.gameObjects.forEach(e =>{
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