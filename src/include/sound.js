/* eslint-disable */
export class Sound {
  constructor(Howl,Howler2) {
    this.background = new Howl({
      src: ['sound/background.ogg']
    });
    this.acdc = new Howl({
      src: ['sound/epicbattle.ogg']
    });
    this.bullydamage = new Howl({
      src: ['sound/bullydamage.mp3']
    });
    this.crowswoosh = new Howl({
      src: ['sound/crowswoosh.mp3']
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
  maintheme() {
    this.mainThemePlay;
    return {
        start: () => {
          this.mainThemePlay = this.background.play();
        },
        end: () => {
          this.background.stop(this.mainThemePlay);
        }
    }
  }

  kake() {
    this.epicBattlePlay;
    return {
        start: () => {
          this.epicBattlePlay = this.acdc.play();
        },
        end: () => {
          this.acdc.stop(this.epicBattlePlay);
        }
    }
  }

  // Sound effects
  bully(){
    this.bullydamage.play();
  }
  crow(){
    this.crowswoosh.play();
  }
}