/* eslint-disable */

import {Controlls} from "./controlls"
import {OtherPlayer, Bully, Prop, GameObject, Cat, Crow, Player} from "./gameobjects"
import {Const} from "./const"
import {Network} from "./network"
import * as PIXI from "pixi.js";
import {Howl, Howler} from 'howler';
import {SoundController} from './soundcontroller';

let loader = PIXI.loader,
    Sprite = PIXI.Sprite,
    resources = PIXI.loader.resources,
    PI = Math.PI

export class Game {

    constructor() {
        this.app = new PIXI.Application({
            width: Const.gameWidth,
            height: Const.gameHeight,
            antialias: true,
            transparent: false,
            resolution: 1
        })
        this.time = 0
        this.gameObjects = {}
        this.dead = null
        this.player = null
        this.sprites = {}
        this.textures = null
        this.props = {};
        this.container = null
        this.ground = null

        this.viewRotation = 0
        this.viewRotationSpeed = 0

        this.controlls = new Controlls(() => { this.handleControllChange(); });
        this.SoundController = new SoundController(Howl, Howler);
        this.Network = new Network();

        this.start()

        setTimeout(() => {
            this.Network.listenState(this.loadState.bind(this))
        }, 2000)


    }


    createGameObject(type, rotation, distance) {
        if (type === "crow") {
            return new Crow(new Sprite(this.textures.crow), rotation, distance, this.crowTextures)
        }
        else if (type === "otherplayer") {
            return new OtherPlayer(new Sprite(this.textures.playerSprite), rotation, distance, this.playerTextures)
        }
        else if (type === "cat") {
            return new Cat(new Sprite(this.textures.cat), rotation, distance, this.catTextures)
        }
        else if (type === "bully") {
            this.SoundController.startBullyBattle();
            return new Bully(new Sprite(this.textures.bully), rotation, distance, this.bullyTextures)
        }
    }


    loadState(data) {
        Object.keys(data).forEach(k => {
            let o = data[k]
            if (k in this.gameObjects && k !== this.Network.getClientId()) {
                this.gameObjects[k].setScaleDirection(o.rotation)
                this.gameObjects[k].id = k;
                this.gameObjects[k].rotation = o.rotation
                this.gameObjects[k].distance = o.distance
                if (o.type === "otherplayer") {
                    this.gameObjects[k].hitting = o.hitting
                }
            } else if (!(k in this.gameObjects)) {
                this.gameObjects[k] = this.createGameObject(o.type, o.rotation, o.distance)
                this.gameObjects[k].addToStage(this.app.stage, this.container)

            }
            Object.keys(this.gameObjects).forEach(ck => {
                if (!(ck in data)) {
                    this.gameObjects[ck].destroy()
                    delete this.gameObjects[ck]
                }
            })
        })
    }


    handleControllChange() {
        if (this.player == null) { return; }
        if (this.controlls.left === this.controlls.right) {
            this.player.rotationSpeed = 0
        }
        else if (this.controlls.left) {
            let angSpeed = Math.atan(Const.rotationSpeedFactor / this.player.distance)
            this.player.rotationSpeed = -1 * angSpeed
        }
        else {
            let angSpeed = Math.atan(Const.rotationSpeedFactor / this.player.distance)
            this.player.rotationSpeed = angSpeed
        }

        let freshHitAction = this.player.setHitting(this.controlls.space)
        if (freshHitAction) {
            this.handlePlayerHitting()
        }

        if (this.controlls.up === this.controlls.down) {
            this.player.distanceSpeed = 0
        }
        else if (this.controlls.up) {
            this.player.distanceSpeed = -1 * Const.distanceSpeedFactor
        }
        else {
            this.player.distanceSpeed = Const.distanceSpeedFactor
        }
    }

    addProps(){
        [
            new Prop(new Sprite(this.textures.prop1),Math.PI / 2, 299),
            new Prop(new Sprite(this.textures.prop1),2 * Math.PI / 2, 300),
            new Prop(new Sprite(this.textures.prop2),3 * Math.PI / 2, 200),
            new Prop(new Sprite(this.textures.prop2),4 * Math.PI / 2, 200),
            new Prop(new Sprite(this.textures.prop3),5 * Math.PI / 2, 250),
            new Prop(new Sprite(this.textures.prop3),6 * Math.PI / 2, 600),
            new Prop(new Sprite(this.textures.prop4),7 * Math.PI / 2, 400),
            new Prop(new Sprite(this.textures.prop4),8 * Math.PI / 2, 100),
            new Prop(new Sprite(this.textures.prop5),9 * Math.PI / 2, 300),
            new Prop(new Sprite(this.textures.prop5),10 * Math.PI / 2, 270),
            new Prop(new Sprite(this.textures.tree),10 * Math.PI / 2, 600),
        ].forEach((e,i)=>{
            this.props[i+"prop"] = e;
            e.addToStage(this.app.stage, this.container);
        })
    }

    start() {
        console.log("Running start()")
        document.body.appendChild(this.app.view)
        loader.add("img/treasureHunter.json")
            .add("crow", "img/crow.png")
            .add("dead", "img/dead.png")
            .add("house", "img/house.png")
            .add("player", "img/player.png")
            .add("player0", "img/player0.png").add("playerhit0", "img/playerhit0.png")
            .add("player1", "img/player1.png").add("playerhit1", "img/playerhit1.png")
            .add("player2", "img/player2.png").add("playerhit2", "img/playerhit2.png")
            .add("player3", "img/player3.png").add("playerhit3", "img/playerhit3.png")
            .add("player4", "img/player4.png").add("playerhit4", "img/playerhit4.png")
            .add("crow0", "img/crow0.png").add("crow1", "img/crow1.png").add("crow2", "img/crow2.png").add("crow3", "img/crow3.png")
            .add("bully0", "img/bully0.png").add("bully1", "img/bully1.png").add("bully2", "img/bully2.png").add("bully3", "img/bully3.png")
            .add("cat0", "img/cat0.png").add("cat1", "img/cat1.png").add("cat2", "img/cat2.png").add("cat3", "img/cat3.png")
            .add("ground", "img/ground.png")
            .add("prop1", "img/prop1.png")
            .add("prop2", "img/prop2.png")
            .add("prop3", "img/prop3.png")
            .add("prop4", "img/prop4.png").add("prop5", "img/prop5.png")
            .add("bully", "img/bully.png")
            .add("tree", "img/tree.png")
            .add("cat", "img/cat.png")
            .load(() => {
                this.textures = resources["img/treasureHunter.json"].textures
                this.textures.crow = resources["crow"].texture
                this.textures.dead = resources["dead"].texture
                this.textures.crow = resources["crow0"].texture
                this.textures.house = resources["house"].texture
                this.textures.player = resources["player"].texture
                this.textures.playerSprite = resources["player0"].texture
                this.textures.bully = resources["bully0"].texture
                this.textures.ground = resources["ground"].texture
                this.textures.prop1 = resources["prop1"].texture
                this.textures.prop2 = resources["prop2"].texture
                this.textures.prop3 = resources["prop3"].texture
                this.textures.prop4 = resources["prop4"].texture
                this.textures.prop5 = resources["prop5"].texture
                this.textures.tree = resources["tree"].texture
                this.textures.cat = resources["cat0"].texture
                this.container = new PIXI.Container()
                this.playerTextures = [
                    {playerHitting: resources["playerhit0"].texture, playerSprite: resources["player0"].texture},
                    {playerHitting: resources["playerhit1"].texture, playerSprite: resources["player1"].texture},
                    {playerHitting: resources["playerhit2"].texture, playerSprite: resources["player2"].texture},
                    {playerHitting: resources["playerhit3"].texture, playerSprite: resources["player3"].texture}]
                this.crowTextures = [
                    {sprite: resources["crow0"].texture},
                    {sprite: resources["crow1"].texture},
                    {sprite: resources["crow2"].texture},
                    {sprite: resources["crow3"].texture},
                ]
                this.catTextures = [
                    {sprite: resources["cat0"].texture},
                    {sprite: resources["cat1"].texture},
                    {sprite: resources["cat2"].texture},
                    {sprite: resources["cat3"].texture}
                ]
                this.bullyTextures = [
                    {sprite: resources["bully0"].texture},
                    {sprite: resources["bully1"].texture},
                    {sprite: resources["bully2"].texture},
                    {sprite: resources["bully3"].texture}
                ]

                this.ground = new Sprite(this.textures.ground)
                this.ground.anchor.set(0.5, 0.5)
                this.ground.scale.set(3, 3)
                this.ground.position.set(Const.originX, Const.originY)
                this.container.addChild(this.ground)

                let house = new Sprite(this.textures.house)
                house.anchor.set(0.5)
                house.scale.set(0.15, 0.3)
                house.position.set(Const.originX, Const.originY)
                this.container.addChild(house)

                this.player = new Player(new Sprite(this.textures.playerSprite), 3 * Math.PI / 2, Const.innerWallRadius, this.Network, this.playerTextures)
                this.gameObjects[this.Network.getClientId()] = this.player
                this.player.addToStage(this.app.stage, this.container)


                this.addProps();


                // let innerWall = new PIXI.Graphics();
                // innerWall.lineStyle(3, 0xFFFFFF, 0.5);
                // innerWall.drawCircle(originX, originY, innerWallRadius); // drawCircle(x, y, radius)
                // this.container.addChild(innerWall);

                // let outerWall = new PIXI.Graphics();
                // outerWall.lineStyle(3, 0xFFFFFF, 0.5);
                // outerWall.drawCircle(originX, originY, outerWallRadius); // drawCircle(x, y, radius)
                // this.container.addChild(outerWall);

                this.app.stage.addChild(this.container)

                this.dead = new Sprite(this.textures.dead)
                this.dead.visible = false;
                this.dead.position.set(0, 0)
                let deadScale = 0.255;
                this.dead.scale.set(deadScale, 2*deadScale)
                this.container.addChild(this.dead)

                console.log("Adding gameLoop(delta) to app.ticker")
                this.app.ticker.add(delta => this.gameLoop(delta))

                this.SoundController.startIngame();
            })
    }

    computeIfPlayerHitOrMiss(hittableObject) {
        let distDiff = Math.abs(this.player.distance-hittableObject.distance);
        let rotDiff = Math.sin(Math.abs(hittableObject.rotation - this.player.rotation))*this.player.distance;
        if (distDiff < Const.playerHitThresholdDist) {
            if (rotDiff < Const.playerHitThresholdRotMax && rotDiff > Const.playerHitThresholdRotMin) {
                if (this.player.scaleDirection !== hittableObject.scaleDirection) {
                    return true;
                }
            }
        }
        return false
    }

    handlePlayerHitCollision(hittableObject) {
        this.SoundController.doDamage();
        this.Network.killObject({
            id: hittableObject.id
        });
        if (hittableObject instanceof Bully) {
            this.SoundController.startIngame();
        }
    }

    handlePlayerHitting() {
        this.SoundController.doHit();
        let hittableObjects = Object.values(this.gameObjects).filter(e => e.hittable)
        for (let hittableObject of hittableObjects) {
            if (this.computeIfPlayerHitOrMiss(hittableObject)) {
                this.handlePlayerHitCollision(hittableObject)
            }
        }
    }

    computeIfMonsterHitOrMiss(hittableObject) {
        let distDiff = Math.abs(this.player.distance-hittableObject.distance);
        let rotDiff = Math.sin(Math.abs(hittableObject.rotation - this.player.rotation))*this.player.distance;
        if (distDiff < Const.monsterHitThresholdDist) {
            if (rotDiff < Const.monsterHitThresholdRot) {
                return true;
            }
        }
        return false
    }

    handleMonsterHitCollision(hittableObject) {
        this.Network.killPlayer({
            id: this.Network.getClientId()
        })
        this.dead.visible = true;
        for (let obj of Object.values(this.gameObjects)) {
            obj.sprite.visible = false;
        }
        this.SoundController.startDead();
    }

    handleMonsterAttacking() {
        let hittableObjects = Object.values(this.gameObjects).filter(e => e.hittable)
        for (let hittableObject of hittableObjects) {
            if (this.computeIfMonsterHitOrMiss(hittableObject)) {
                this.handleMonsterHitCollision(hittableObject)
            }
        }
    }

    getXYfromRotDist(rotation, distance) {
        let a = Math.cos(rotation - this.viewRotation) * distance
        let b = Math.sin(rotation - this.viewRotation) * distance
        let x = Const.originX + a
        let y = Const.originY - b
        return {x: x, y: y}
    }

    gameLoop(delta) {
        this.container.scale.set(1, 1)
        this.time += delta
        Object.keys(this.gameObjects).forEach(k => {
            const e = this.gameObjects[k]
            e.update(delta)
        })

        Object.keys(this.props).forEach(k => {
            const e = this.props[k]
            e.update(delta)
        })

        this.fixPayerPositionIfOutsideOfBoundingArea()
        this.ground.rotation = this.viewRotation

        Object.keys(this.gameObjects).forEach(k => {
            const e = this.gameObjects[k]
            let {r, d} = e.getPosition()
            let {x, y} = this.getXYfromRotDist(r, d)
            e.setScreenCoordinate(x, y)
        })

        Object.keys(this.props).forEach(k => {
            const e = this.props[k]
            let {r, d} = e.getPosition()
            let {x, y} = this.getXYfromRotDist(r, d)
            e.setScreenCoordinate(x, y)
        })

        this.container.scale.set(1, Const.scaleY)

        Object.keys(this.gameObjects).forEach(k => {
            const e = this.gameObjects[k]
            e.render(delta)
        })

        Object.keys(this.props).forEach(k => {
            const e = this.props[k]
            e.render(delta)
        })

        this.handleMonsterAttacking();
    }

    fixPayerPositionIfOutsideOfBoundingArea() {
        if (this.player.distance < Const.innerWallRadius) {
            this.player.distance = Const.innerWallRadius
        }
        if (this.player.distance > Const.outerWallRadius) {
            this.player.distance = Const.outerWallRadius
        }

        let maxBoundRotation = Const.maxBoundAngle + this.viewRotation
        let minBoundRotation = Const.minBoundAngle + this.viewRotation
        if (this.player.rotation > maxBoundRotation) {
            this.viewRotation = this.player.rotation - Const.maxBoundAngle
        }
        if (this.player.rotation < minBoundRotation) {
            this.viewRotation = this.player.rotation - Const.minBoundAngle
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