import io from 'socket.io-client';
import Faker from 'Faker';


export class Network {
  constructor () {
    var socket = io.connect();
    socket.on('connect', function(data) {
        console.log('Look, im connected');
        socket.emit('join', {"name": Faker.Name.findName()});
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