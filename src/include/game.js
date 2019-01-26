import * as PIXI from "pixi.js";
import { Controlls } from "./controlls";

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

        this.sprites = {};
        this.speedFactor = PI/200;

        this.ViewRotation = 0;
        this.ViewRotationSpeed = 0;

        this.explorerRot = 5.5*PI/4;
        // this.explorerDist = innerWallRadius + (outerWallRadius-innerWallRadius)/2;
        this.explorerDist = innerWallRadius + 20;

        this.controlls = new Controlls(() => { this.handleControllChange(); });

        this.start();

    }

    handleControllChange() {
        if (this.controlls.left == this.controlls.right) {
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
        loader.add("img/treasureHunter.json").load(() => {
            this.textures = resources["img/treasureHunter.json"].textures;

            let container = new PIXI.Container();

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

            this.sprites.explorer = new Sprite(this.textures["explorer.png"]);
            let {x, y} = this.getXYfromRotDist(this.explorerRot, this.explorerDist);
            this.sprites.explorer.x = x;
            this.sprites.explorer.y = y;
            container.addChild(this.sprites.explorer);
            // this.app.stage.addChild(this.sprites.explorer);

            container.scale.set(1, scaleY);
            this.app.stage.addChild(container);

            console.log("Adding gameLoop(delta) to app.ticker");
            this.app.ticker.add(delta => this.gameLoop(delta));

        });
    }

    getXYfromRotDist(rotation, distance) {
        let a = Math.cos(rotation + this.ViewRotation)*distance;
        let b = Math.sin(rotation + this.ViewRotation)*distance;
        let x = originX+a;
        let y = originY-b;
        return {x: x, y: y};
    }

    gameLoop(delta) {
        this.ViewRotation += this.ViewRotationSpeed * delta;

        let {x, y} = this.getXYfromRotDist(this.explorerRot, this.explorerDist);
        this.sprites.explorer.x = x;
        this.sprites.explorer.y = y;
    }

}