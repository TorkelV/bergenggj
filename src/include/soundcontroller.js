
/* eslint-disable */
import { Sound } from './sound';

export class SoundController {

constructor(Howl,Howler){
  this.Sound = new Sound(Howl, Howler);
  console.log(this.Sound);
  
  window.document.addEventListener("keydown", (e) => {
    if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)) { 
        if(e.keyCode === 49){
          this.Sound.maintheme().start();
        }
        if(e.keyCode === 50){
          this.Sound.maintheme().end();
        }
        if(e.keyCode === 51){
          this.Sound.bully();
        }
        if(e.keyCode === 52){
          this.Sound.crow();
        }
        if(e.keyCode === 53){
          this.Sound.acdc().start();
        }
        if(e.keyCode === 54){
          this.Sound.acdc().end();
        }
    }
  })


}
}