/* eslint-disable */
import { Sound } from './sound';

export class SoundController {

    constructor(Howl, Howler) {
        this.Sound = new Sound(Howl, Howler);
        console.log(this.Sound);

        window.document.addEventListener("keydown", (e) => {
            if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)) {
                if (e.keyCode === 49) {
                    this.startIngame();
                }
                if (e.keyCode === 50) {
                    this.stopIngame();
                }

                if (e.keyCode === 51) {
                    this.doDamage();
                }

                if (e.keyCode === 52) {
                    this.Sound.hit();
                }

                if (e.keyCode === 53) {
                    this.startBullyBattle();
                }
                if (e.keyCode === 54) {
                    this.stopBullyBattle();
                }

                if (e.keyCode === 55) {
                    this.startDead();
                }
                if (e.keyCode === 56) {
                    this.stopDead();
                }
            }
        })

        this.status = {
            ingame: false,
            bullyBattle: false,
            dead: false
        };
    }

    startIngame() {
        if (!this.status.ingame) {
            this.stopIngame();
            this.stopBullyBattle();
            this.stopDead();
            this.Sound.ingame().start();
            this.status.ingame = true;
        }
    }
    stopIngame() {
        if (this.status.ingame) {
            this.Sound.ingame().end();
            this.status.ingame = false;
        }
    }

    startBullyBattle() {
        if (!this.status.bullyBattle) {
            this.stopIngame();
            this.stopBullyBattle();
            this.stopDead();
            this.Sound.bullyBattle().start();
            this.status.bullyBattle = true;
        }
    }
    stopBullyBattle() {
        if (this.status.bullyBattle) {
            this.Sound.bullyBattle().end();
            this.status.bullyBattle = false;
        }
    }

    startDead() {
        if (!this.status.dead) {
            this.stopIngame();
            this.stopBullyBattle();
            this.stopDead();
            this.Sound.dead().start();
            this.status.dead = true;
        }
    }
    stopDead() {
        if (this.status.dead) {
            this.Sound.dead().end();
            this.status.dead = false;
        }
    }

    doDamage() {
        this.Sound.damage();
    }

    doHit() {
        this.Sound.hit();
    }

}