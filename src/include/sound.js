import {Howl, Howler} from 'howler';
import { throws } from 'assert';

export class Sound {

  constructor() {
    this.background = new Howl({
      src: ['sound/background.ogg']
    });
    this.bullydamage = new Howl({
      src: ['sound/bullydamage.mp3']
    });
    this.crowswoosh = new Howl({
      src: ['sound/crowswoosh.mp3']
    });
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
    });
    this.epicBattle = new Howl({
      src: ['sound/epicbattle.ogg']
    });
  }
  maintheme(){
    this.background.play();
  };

  bully(){
    this.bullydamage.play();
  };

  crow(){
    this.crowswoosh.play();
  };

  damage(){
    this.damage.play();
  };

  entergame(){
    this.entergame.play();
  };

  footsteps(){
    this.footsteps.play();
  };

  klikk(){
    this.klikk.play();
  };

  sword(){
    this.sword.play();
  };
  epicBattle(){
    console.log('wepic');
    this.epicBattle.play();
  }


}