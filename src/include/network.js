import io from 'socket.io-client';
import Faker from 'Faker';


export class Network {
  constructor () {
    this.socket = io.connect();
    this.socket.on('connect', function(data) {
    });

    this.socket.on('status', (payload) => {
      console.log("Users connected");
      console.log(payload);
    });
  }

  listen(callback) {
    this.socket.on('state' , (payload) => {
      console.log(payload);
      callback(payload);
    });
  }




}