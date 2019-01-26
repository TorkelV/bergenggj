import {Howl, Howler} from 'howler';

export class Sound {



  constructor() {
    this.background = new Howl({
      src: ['sound/background.ogg']
    });
  }


  maintheme(){
    this.background.play();
  }



}