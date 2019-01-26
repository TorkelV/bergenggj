import io from 'socket.io-client';
import Faker from 'Faker';


export class Network {
  constructor () {
    console.log('yolo');
    var socket = io.connect();
    socket.on('connect', function(data) {
        console.log('Look, im connected');
        socket.emit('join', {"name": Faker.Name.findName()});
    });

    socket.on('status', (payload) => {
      console.log("Users connected");
      console.log(payload);
    });
  }




}