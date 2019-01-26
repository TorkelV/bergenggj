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

  getClientId(){
    return this.socket.id;
  }

  listen(callback) {
    this.socket.on('state', (payload) => {
      callback(payload, this.getClientId());
    });
  }
  listenState(callback){
      this.socket.on('objectState', (payload) => {
          callback(payload);
      })
  }

  updatePlayer(payload) {
    this.socket.emit('updatePlayerState', payload);
  }

}