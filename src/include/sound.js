import {Howl, Howler} from 'howler';

export class Sound {



  constructor() {

    this.background = new Howl({
      src: ['sound/music.ogg']
    });
    

  }


  maintheme(){
    this.background.play();
  }



}