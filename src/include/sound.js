/* eslint-disable */
export class Sound {
  constructor(Howl,Howler2) {
    this.sIngame = new Howl({
      src: ['sound/ingame.mp4']
    });
    this.sBullyBattle = new Howl({
      src: ['sound/bullyBattle.ogg']
    });
    this.sDead = new Howl({
      src: ['sound/dead.ogg']
    });
    this.sDamage = new Howl({
      src: ['sound/damage.mp3']
    });
    this.sHit = new Howl({
      src: ['sound/sword.mp3']
    });
    /*
    this.damage = new Howl({
      src: ['sound/damage.mp3']
    });
    this.entergame = new Howl({
      src: ['sound/entergame.mp3']
    });
    this.footsteps = new Howl({
      src: ['sound/footsteps.mp3']
    });
    this.klikk = new Howl({
      src: ['sound/klikk.mp3']
    });
    this.sword = new Howl({
      src: ['sound/sword.mp3']
    }); */
 
  }

  // Music
  ingame() {
    this.mainThemePlay;
    return {
        start: () => {
          this.mainThemePlay = this.sIngame.play();
        },
        end: () => {
          this.sIngame.stop(this.mainThemePlay);
        }
    }
  }

  bullyBattle() {
    this.epicBattlePlay;
    return {
        start: () => {
          this.epicBattlePlay = this.sBullyBattle.play();
        },
        end: () => {
          this.sBullyBattle.stop(this.epicBattlePlay);
        }
    }
  }

  dead() {
    this.deadPlay;
    return {
        start: () => {
          this.deadPlay = this.sDead.play();
        },
        end: () => {
          this.sDead.stop(this.deadPlay);
        }
    }
  }

  // Sound effects
  damage(){
    this.sDamage.play();
  }
  hit(){
    this.sHit.play();
  }
}