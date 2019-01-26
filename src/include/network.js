/* eslint-disable */
import io from 'socket.io-client';
import Faker from 'Faker';
export class Network {
  constructor () {
    this.socket = io.connect();
    this.socket.on('connect', function(data) {
      console.log('Im connected');
    });


  }
  listen(callback) {
    this.socket.on('state' , (payload) => {
      callback(payload);
    });
  }
  listenState(callback){
      this.socket.on('objectState', (payload) => {
          callback(payload);
      })
  }

}