/* eslint-disable */

import * as PIXI from "pixi.js";
import { Controlls } from "./controlls";
import { Crow, Player } from "./gameobjects"
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

let innerWallRadius = 100;
let outerWallRadius = 700;
let scaleY = 0.7;

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
        this.speedFactor = PI/200;
        this.ViewRotation = 0;
        this.ViewRotationSpeed = 0;

        this.controlls = new Controlls(() => { this.handleControllChange(); });
        this.Sound = new Sound();
        this.start();
        this.Network = new Network();

        //this.Network.listen(this.loadState);

    }

    createGameObject(type,rotation,distance){
        if(type === "crow"){
            return new Crow(new Sprite(this.textures.crow),rotation,distance);
        }else if(type === "player"){
            return new Player(new Sprite(this.textures["explorer.png"]),rotation,distance);
        }
    }


    loadState(data) {
        data.new.forEach(o => {
            this.gameObjects[o.id] = this.createGameObject(o.type, o.rotation, o.distance);
            this.gameObjects[o.id].addToStage(o.rotation, o.distance);
        });
        data.killed.forEach(o => {
            this.gameObjects[o].destroy();
            delete this.gameObjects[o.id];
        })
        data.moved.forEach(o => {
            this.gameObjects[o.id].rotation = o.rotation;
            this.gameObjects[o.id].distance = o.distance;
        })
    }

    test(payload){
        // evil innerhtml
        document.getElementById('time').innerHTML = payload.date;
        document.getElementById('userCount').innerHTML = payload.userCount;

    }

    handleControllChange() {
        if (this.controlls.left === this.controlls.right) {
            this.ViewRotationSpeed = 0;
        }
        else if (this.controlls.left) {
            this.ViewRotationSpeed = -1 * this.speedFactor;
        }
        else {
            this.ViewRotationSpeed = this.speedFactor;
        }

        // if (this.controlls.up == this.controlls.down) {
        //     this.sprites.explorer.vy = 0;
        // }
        // else if (this.controlls.up) {
        //     this.sprites.explorer.vy = -1 * this.speed;
        // }
        // else {
        //     this.sprites.explorer.vy = this.speed;
        // }
    }

    start() {
        console.log("Running start()");
        document.body.appendChild(this.app.view);
        loader.add("img/treasureHunter.json").add("crow", "img/crow.png").load(() => {
            this.textures = resources["img/treasureHunter.json"].textures;
            this.textures.crow = resources["crow"].texture;
            this.container = new PIXI.Container();
            this.player = new Player(new Sprite(this.textures["explorer.png"]), 5*Math.PI/4, innerWallRadius+50);
            this.gameObjects.player = this.player;
            this.player.addToStage(this.app.stage, this.container);
            let circle = new PIXI.Graphics();
            let circleRadius = 20;
            circle.beginFill(0xe74c3c);
            circle.drawCircle(originX, originY, circleRadius); // drawCircle(x, y, radius)
            circle.endFill();
            container.addChild(circle);
            // this.app.stage.addChild(circle);

            let innerWall = new PIXI.Graphics();
            innerWall.lineStyle(3, 0xFFFFFF, 0.5);
            innerWall.drawCircle(originX, originY, innerWallRadius); // drawCircle(x, y, radius)
            container.addChild(innerWall);
            // this.app.stage.addChild(innerWall);

            let outerWall = new PIXI.Graphics();
            outerWall.lineStyle(3, 0xFFFFFF, 0.5);
            outerWall.drawCircle(originX, originY, outerWallRadius); // drawCircle(x, y, radius)
            container.addChild(outerWall);
            // this.app.stage.addChild(outerWall);

            container.scale.set(1, scaleY);
            this.app.stage.addChild(container);

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
        let a = Math.cos(rotation + this.ViewRotation)*distance;
        let b = Math.sin(rotation + this.ViewRotation)*distance;
        let x = originX+a;
        let y = originY-b;
        return {x: x, y: y};
    }

    gameLoop(delta) {
        this.ViewRotation += this.ViewRotationSpeed * delta;
        this.time += delta;
        Object.keys(this.gameObjects).forEach(k =>{
            const e = this.gameObjects[k];
            e.update(delta);
            let {r,d} = e.getPosition();
            let {x,y} = this.getXYfromRotDist(r,d);
            e.render(delta,x,y)
        });
    }

}