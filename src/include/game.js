import * as PIXI from "pixi.js";
import { Controlls } from "./controlls";
import { Chest, Player } from "./gameobjects"

let loader = PIXI.loader,
    Sprite = PIXI.Sprite,
    resources = PIXI.loader.resources,
    WIDTH = 1024,
    HEIGHT = 768;



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
        this.speed = 2;
        this.gameObjects = [];
        this.controlls = new Controlls(() => { this.handleControllChange(); });

        this.start();

    }

    handleControllChange() {
        if (this.controlls.left === this.controlls.right) {
            this.player.vx = 0;
        }
        else if (this.controlls.left) {
            this.player.vx = -1 * this.speed;
        }
        else {
            this.player.vx = this.speed;
        }

        if (this.controlls.up === this.controlls.down) {
            this.player.vy = 0;
        }
        else if (this.controlls.up) {
            this.player.vy = -1 * this.speed;
        }
        else {
            this.player.vy = this.speed;
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
            this.player = new Player(new Sprite(this.textures["explorer.png"]));
            this.gameObjects.push(this.player);
            this.player.addToStage(this.app.stage);

            let graphics = new PIXI.Graphics();
            graphics.beginFill(0xe74c3c); // Red
            graphics.drawCircle(WIDTH/2-5, 40, 10); // drawCircle(x, y, radius)
            graphics.endFill();
            this.app.stage.addChild(graphics);

            console.log("Adding gameLoop(delta) to app.ticker");
            this.app.ticker.add(delta => this.gameLoop(delta));

        });
    }

    addNPCs(){
        if(this.time - this.chestsSpawned* 120 >0){
            let chest = new Chest(new Sprite(this.textures["treasure.png"]))
            this.gameObjects.push(chest);
            chest.addToStage(this.app.stage);
            this.chestsSpawned += 1;
        }
    }

    gameLoop(delta) {
        this.time += delta;
        this.gameObjects.map(e=> e.render(delta));
        this.addNPCs(delta);
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