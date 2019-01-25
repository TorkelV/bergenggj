import * as PIXI from "pixi.js";
import { Controlls } from "./controlls";

let loader = PIXI.loader,
    Sprite = PIXI.Sprite,
    resources = PIXI.loader.resources;

export class Game {

    constructor() {
        this.app = new PIXI.Application({
            width: 512,
            height: 512,
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

            this.sprites.dungeon = new Sprite(this.textures["dungeon.png"]);
            this.app.stage.addChild(this.sprites.dungeon);

            this.sprites.treasure = new Sprite(this.textures["treasure.png"]);
            this.sprites.treasure.x = this.app.stage.width - this.sprites.treasure.width - 48;
            this.sprites.treasure.y = this.app.stage.height / 2 - this.sprites.treasure.height / 2;
            this.app.stage.addChild(this.sprites.treasure);

            this.sprites.explorer = new Sprite(this.textures["explorer.png"]);
            this.sprites.explorer.x = 68;
            this.sprites.explorer.y = this.app.stage.height / 2 + 3 * this.sprites.explorer.height;
            this.sprites.explorer.vx = 0;
            this.sprites.explorer.vy = 0;
            this.app.stage.addChild(this.sprites.explorer);

            console.log("Adding gameLoop(delta) to app.ticker");
            this.app.ticker.add(delta => this.gameLoop(delta));

        });
    }

    gameLoop(delta) {
        let wallW = 30;
        let wallH = 30;
        let modW = (this.app.view.height - 2 * wallH - this.sprites.explorer.height);

        let vx = this.sprites.explorer.vx;
        let vy = this.sprites.explorer.vy;

        this.sprites.explorer.x = (this.sprites.explorer.x - wallW) + delta * vx;
        this.sprites.explorer.x %= this.app.view.width - 2 * wallW - this.sprites.explorer.width;
        this.sprites.explorer.x += wallW;

        this.sprites.explorer.y = (this.sprites.explorer.y - wallH) + delta * vy;
        if (this.sprites.explorer.y < wallW) {
            this.sprites.explorer.y += modW;
        }
        this.sprites.explorer.y %= modW;
        this.sprites.explorer.y += wallH;

        if (this.hitTestRectangle(this.sprites.explorer, this.sprites.treasure)) {
            if (this.speed != 0) {
                this.speed = 0;
                this.sprites.explorer.vx = 0;
                this.sprites.explorer.vy = 0;
            }
        }
    }

    hitTestRectangle(r1, r2) {
        let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;
        hit = false;
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
        if (Math.abs(vx) < combinedHalfWidths) {
            if (Math.abs(vy) < combinedHalfHeights) {
                hit = true;
            } else {
                hit = false;
            }
        } else {
            hit = false;
        }
        return hit;
    }

}