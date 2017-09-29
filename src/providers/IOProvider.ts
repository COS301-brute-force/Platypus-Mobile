import { Injectable } from '@angular/core';

import * as io from 'socket.io-client';

// API server URL
const IP1 = 'http://192.168.43.144';
const IP = 'http://192.168.1.115';
const SOCKET_IP = IP+':3002';

@Injectable()
export class IOProvider {

  public socket: SocketIOClient.Socket;

  constructor() {
    console.log("IO Provider Instantiated");
    this.socket = io(SOCKET_IP);
    // this.handleListeners();
  }

  // handleListeners() {
  //   this.socket.on('sendItem', this.getItem);
  // }

  claimItem(session_id, user_id, quantity, item_id) {
    console.log("claimItem: Emitting: "+session_id+", "+user_id+", "+quantity+", "+item_id);
    this.socket.emit('claimItem', { session_id: session_id, user_id: user_id, quantity: quantity, item_id: item_id });
  }

  unclaimItem(session_id, user_id, quantity, item_id) {
    console.log("claimItem: Emitting: "+session_id+", "+user_id+", "+quantity+", "+item_id);
    this.socket.emit('unclaimItem', { session_id: session_id, user_id: user_id, quantity: quantity, item_id: item_id });
  }

  createItem(session_id, price, name, quantity) {
    console.log("createItem: Emitting: "+session_id+", "+price+", "+name+", "+quantity);
    this.socket.emit('createItem', { session_id: session_id, price: price, name: name, quantity: quantity });
  }

  deleteItem(session_id, item_id) {
    console.log("deleteItem: Emitting: "+session_id+", "+item_id);
    this.socket.emit('deleteItem', { session_id: session_id, item_id: item_id });
  }

  editItem(session_id, price, name, quantity, item_id) {
    console.log("editItem: Emitting: "+session_id+", "+price+", "+name+", "+quantity+", "+item_id);
    this.socket.emit('editItem', { session_id: session_id, price: price, name: name, quantity: quantity, item_id: item_id });
  }

  // getItem(json) {
  //     console.log("Got item: "+json);
  //     var parsedData = JSON.parse(json.data);
  //     // @todo Check if the item in data exists (ID). If it does replace it's information. Else add it to the items.
  // }

}
