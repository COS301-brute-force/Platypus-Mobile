import { Injectable } from '@angular/core';

import * as io from 'socket.io-client';

// API server URL
const IP = 'http://192.168.1.110';
const PORT = ':3002';
const SOCKET_IP = IP+PORT;

@Injectable()
export class IOProvider {

  public socket: SocketIOClient.Socket;

  constructor() {
    console.log("IO Provider Instantiated");
    this.socket = io(SOCKET_IP);
  }

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

}
