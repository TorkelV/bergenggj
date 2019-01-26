/* eslint-disable */

import * as PIXI from "pixi.js";
import {Howl, Howler} from 'howler';
import { Controlls } from "./controlls";
let loader = PIXI.loader,
    Sprite = PIXI.Sprite,
    resources = PIXI.loader.resources,
    WIDTH = 1024,
    HEIGHT = 768;

    var sound = new Howl({
        src: ['sound/music.ogg']
    });
    sound.play();
    console.log('haiahiahiahi')
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
        this.speed = 2;

        this.controlls = new Controlls(() => { this.handleControllChange(); });

        this.start();

    }

    handleControllChange() {
        if (this.controlls.left == this.controlls.right) {
            this.sprites.explorer.vx = 0;
        }
        else if (this.controlls.left) {
            this.sprites.explorer.vx = -1 * this.speed;
        }
        else {
            this.sprites.explorer.vx = this.speed;
        }

        if (this.controlls.up == this.controlls.down) {
            this.sprites.explorer.vy = 0;
        }
        else if (this.controlls.up) {
            this.sprites.explorer.vy = -1 * this.speed;
        }
        else {
            this.sprites.explorer.vy = this.speed;
        }
    }

    start() {
        console.log("Running start()");
        document.body.appendChild(this.app.view);
        loader.add("img/treasureHunter.json").load(() => {
            this.textures = resources["img/treasureHunter.json"].textures;

            // this.sprites.treasure = new Sprite(this.textures["treasure.png"]);
            // this.sprites.treasure.x = this.app.stage.width - this.sprites.treasure.width - 48;
            // this.sprites.treasure.y = this.app.stage.height / 2 - this.sprites.treasure.height / 2;
            // this.app.stage.addChild(this.sprites.treasure);

            this.sprites.explorer = new Sprite(this.textures["explorer.png"]);
            // this.sprites.explorer.x = 68;
            // this.sprites.explorer.y = this.app.stage.height / 2 + 3 * this.sprites.explorer.height;
            this.sprites.explorer.x = 0;
            this.sprites.explorer.y = 0;
            this.sprites.explorer.vx = 0;
            this.sprites.explorer.vy = 0;
            this.app.stage.addChild(this.sprites.explorer);

            let graphics = new PIXI.Graphics();
            graphics.beginFill(0xe74c3c); // Red
            graphics.drawCircle(WIDTH/2-5, 40, 10); // drawCircle(x, y, radius)
            graphics.endFill();
            this.app.stage.addChild(graphics);

            console.log("Adding gameLoop(delta) to app.ticker");
            this.app.ticker.add(delta => this.gameLoop(delta));

        });
    }

    gameLoop(delta) {
        let vx = this.sprites.explorer.vx;
        let vy = this.sprites.explorer.vy;

        this.sprites.explorer.x = this.sprites.explorer.x + delta * vx;
        this.sprites.explorer.y = this.sprites.explorer.y + delta * vy;
    }

    static hitTestRectangle(r1, r2) {
        let combinedHalfWidths, combinedHalfHeights, vx, vy;
        r1.centerX = r1.x + r1.width / 2;
        r1.centerY = r1.y + r1.height / 2;
        r2.centerX = r2.x + r2.width / 2;
        r2.centerY = r2.y + r2.height / 2;
        r1.halfWidth = r1.width / 2;
        r1.halfHeight = r1.height / 2;
        r2.halfWidth = r2.width / 2;
        r2.halfHeight = r2.height / 2;
        vx = r1.centerX - r2.centerX;
        vy = r1.centerY - r2.centerY;
        combinedHalfWidths = r1.halfWidth + r2.halfWidth;
        combinedHalfHeights = r1.halfHeight + r2.halfHeight;
        return Math.abs(vx) < combinedHalfWidths && Math.abs(vy) < combinedHalfHeights;
    }

}