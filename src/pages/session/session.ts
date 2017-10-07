import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import { Alert } from '../../providers/Alert';

import { IOProvider } from '../../providers/IOProvider';
import { HttpProvider } from '../../providers/HttpProvider';

import { Storage } from '@ionic/storage';
import { SESSION_PAGES } from '../../app/pages';
import { Item } from '../../providers/Item';

@IonicPage()
@Component({
  selector: 'page-session',
  templateUrl: 'session.html',
  providers:[IOProvider, HttpProvider, Alert]
})
export class SessionPage {

  socket: SocketIOClient.Socket;

  pages = SESSION_PAGES;
  total: number;
  gratuityPercent: number;
  items: Array<Item>;
  nickname: string;
  color: string;
  session_id: string;
  user_id: number;
  sessionOwner: string;
  activeBackgroundColor: Object;
  activeColor: Object;

  maxId: number;
  scope: any;
  selectedItems: string;
  isEditing: boolean;
  modal: any;

  constructor(
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private navParams: NavParams,
    private storage: Storage,
    private alertService: Alert,

    private ioProvider: IOProvider,
    private httpProvider: HttpProvider) {

      this.socket = ioProvider.socket;
      this.handleSocketListeners();

      this.items = new Array<Item>();

      this.items = new Array<Item>();
      this.scope = this;
      this.maxId = 0;

      this.total = this.getTotal();
      this.gratuityPercent = 10;

      this.sessionOwner = "Duart";  // @todo Get this info from the server upon establishing a connection
      this.selectedItems = "all-items";

      this.isEditing = false;

  }

  /**
   * Opens a modal with the specified name
   * @param {String} modal The name of the modal to open
   */
  openModal(modal): void {
    this.modal = this.modalCtrl.create(modal);
    this.modal.present();
  }

  /**
   * Toggles between All Items and My Items menu items
   */
  switchSegments(){

    var buttons = document.querySelectorAll(".menu .list button");

    if(this.selectedItems == "all-items")
      this.selectedItems = "my-items";
    else if(this.selectedItems == "my-items")
      this.selectedItems = "all-items";

    for (var i = 0; i < buttons.length; i++) {
      if(buttons[i].innerHTML == "All Items") {
        buttons[i].innerHTML = "My Items";
      } else if(buttons[i].innerHTML == "My Items") {
        buttons[i].innerHTML = "All Items";
      }
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SessionPage');
  }

  /**
   * Promise chain of authentication checks
   */
  ionViewDidEnter() {
    this.alertService.sendAlert("Please ensure item prices, names and quantities are correct!", 10000);
    this.loadResources(this)
    .then((data) => { this.validateSessionData(this) }, (err) => {this.redirectHome(err, this)})
    .then((data) => { this.getAllSessionData(this) }, (err) => {this.redirectHome(err, this)})
    .then((data) => {}, (err) => { this.redirectHome(err, this) });
  }

  /**
   * Redirects the user to the home page
   * @param  {any} err   Reason for redirecting home
   * @param  {any} scope Parent scope resolution
   */
  redirectHome(err, scope){
    console.log("Redirecting home: "+err);
    scope.navCtrl.setRoot("HomePage");
  }

  /**
   * Ensure the user id and session id correspond with the server
   * @param  {any} scope Parent scope resolution
   * @return {Promise}   Promise object once the data has been validated
   */
  validateSessionData(scope) {
    return new Promise(function (resolve, reject) {
      if(1 == 1) {
        console.log("Session validated");
        resolve("Session validated");
      } else {
        console.log("Session validation broke");
        reject(Error("Session validation broke"));
      }
    });
  }


  /**
   * Gets the initial session data from the server
   * @param  {any} scope The parent scope resolution
   * @return {Promise}   Promise object once the data has been returned
   */
  getAllSessionData(scope){
    return new Promise(function (resolve, reject) {
      scope.httpProvider.getAllSessionData(scope.session_id).then( (data) => {
        scope.parseItems(data);
        resolve();
      }, (err) => {
        reject(err);
      });
    });
  }

  /**
   * Parse the JSON data as items in the interface
   * @param  {String} json Json string containing all the session data
   */
  parseItems(json) {
    var parsedData = JSON.parse(json.data);
    console.log(parsedData.data.attributes);
    console.log(parsedData.data.attributes.items[0].i_price+" "+parsedData.data.attributes.items[0].i_name+" "+parsedData.data.attributes.items[0].i_quantity+" "+parsedData.data.attributes.items[0].i_id);
    for(var i = 0; i<parsedData.data.attributes.items.length; i++) {
      this.items.push(new Item(
        parsedData.data.attributes.items[i].i_price,
        parsedData.data.attributes.items[i].i_quantity,
        parsedData.data.attributes.items[i].i_name,
        parsedData.data.attributes.items[i].i_id
      ));
    }
  }

  /**
   * Loads the user infrmation from local storage
   * @param  {any} scope The parent scope resolution
   * @return {Promise}   Promise object after all data has loaded
   */
  loadResources(scope) {
    return new Promise(function (resolve, reject) {

      scope.storage.get('session_id').then((data) => {
        scope.session_id = data;
        scope.storage.get('user_id').then((data) => {
          scope.user_id = data;
          scope.storage.get('nickname').then((data) => {
            scope.nickname = data;
            scope.storage.get('color').then((data) => {
              scope.color = data;
              scope.activeBackgroundColor = { 'background-color': scope.color };
              scope.activeColor = { 'color': scope.color };
              console.log(scope.color);
              resolve();
            });
          });
        });
      });
    });
  }

  /**
   * Creates a new item and adds it to the interface
   */
  createNewItem() {
      var newItem = new Item(0, 0, "", -1);
      this.items.push(newItem);
      this.editItem(newItem);
  }

  /**
   * Calls the socket provider's delete item
   * @param  {any} item The item to be deleted
   */
  deleteItem(item) {
    this.items.splice(this.items.indexOf(item), 1);
    this.ioProvider.deleteItem(this.session_id, item.getId());
  }

  /**
   * Calls the socket provider's claim item
   * @param  {any} item The item to be added
   */
  addItem(item) {
    item.decrementQuantity();
    this.ioProvider.claimItem(this.session_id, this.user_id, item.getMyQuantity(), item.getId());
  }

  /**
   * Calls the socket provider's unclaim item in a loop
   * @param  {any} item The item to be added
   */
  addAllItems(item) {
    item.decrementAllQuantity();
    this.ioProvider.claimItem(this.session_id, this.user_id, item.getMyQuantity(), item.getId());
  }

  /**
   * Calls the socket provider's claim item
   * @param  {any} item The item to be removed
   */
  removeItem(item) {
    item.incrementQuantity();
    this.ioProvider.unclaimItem(this.session_id, this.user_id, item.getMyQuantity(), item.getId());
  }

  /**
   * Calls the required functions for editing items
   * @param  {any} item   The item to edit
   * @param  {any} slider The item panel slider handle
   */
  editItemHandler(item, slider) {
    console.log("Handling Edit: "+item.getName());
    slider.close();
    this.editItem(item);
  }

  /**
   * Attempts to edit and item
   * @param  {any} item The item to edit
   */
  editItem(item) {

    console.log("Editing: "+item.getName()+", ID: "+item.getId());

    this.isEditing = true;

    var intervalId = setInterval(function() {

      var itemContainer = document.getElementById(item.getId());

      if(itemContainer != null) {
        clearInterval(intervalId);

        var itemContainer = document.getElementById(item.getId());
        var elementList = <NodeListOf<HTMLElement>>itemContainer.querySelectorAll(".edit-item-input");
        for (var i = 0; i < elementList.length; ++i)
          elementList[i].style.display = "inline-block";

        (<HTMLElement>itemContainer.querySelector(".card-drag")).style.display="none";
        (<HTMLElement>itemContainer.querySelector(".card-confirm")).style.display="inline";

       } else {
         console.log("Waiting to edit item");
       }
    }, 100);
  }


  /**
   * Closes the edit inputs and buttons
   * @param  {any} item  The item which is being edited]
   */
  closeEdit(item, event) {

    console.log("Closing: "+item.getName());
    this.isEditing = false
    var itemContainer = document.getElementById(item.getId());

    if((<HTMLElement>itemContainer.querySelector(".card-drag")).style.display == "none") {

      var elementList = <NodeListOf<HTMLElement>>itemContainer.querySelectorAll(".edit-item-input");

      for (var i = 0; i < elementList.length; ++i)
          elementList[i].style.display = "none";

      (<HTMLElement>itemContainer.querySelector(".card-drag")).style.display="inline";
      (<HTMLElement>itemContainer.querySelector(".card-confirm")).style.display="none";

      if(item.getId() == -1) {

        // If item has no values, don't emit it
        if(item.getPrice() != 0 && item.getName() != "" && item.getQuantity() != 0)
          this.ioProvider.createItem(this.session_id, item.getPrice(), item.getName(), item.getQuantity());
        this.items.splice(this.items.indexOf(item), 1);

      } else {
        
        // If items has no values after editing, delete the item
        if(item.getPrice() != 0 && item.getName() != "" && item.getQuantity() != 0)
          this.ioProvider.editItem(this.session_id, item.getPrice(), item.getName(), item.getQuantity(), item.getId());
        else {
          // @todo Call deleteItem
          this.items.splice(this.items.indexOf(item), 1);
        }
      }

    }
  }


  /**
   * Returns the total of the bill/reciept
   * @return {number} The calculated total
   */
  getTotal() {
    var total = 0.0;
    for(let item of this.items){
      var numberOfItems: number = item.getQuantity()+item.getMyQuantity();
      total += item.getPrice()*numberOfItems;
    }
    return total;
  }

  /**
   * Returns the amount due by the user
   * @return {number} The amount due by the user
   */
  getDue() {
    var due = 0.0;
    for(let item of this.items)
      due += item.getPrice()*item.getMyQuantity();

    return due;
  }

  /**
   * Calculates the gratuity of the bill
   * @return {number} The gratuity
   */
  getGratuity() {
    return this.getDue()*(this.gratuityPercent/100);
  }

  /**
   * Calculates the total due after adding the tip
   * @return {number} The total due by the user
   */
  getTotalDue() {
    return this.getGratuity()+this.getDue();
  }

  /**
   * Disconnects the user from the server and redirects the user back home
   */
  leaveSession() {
    // @todo Ask the user if they're sure
    this.navCtrl.setRoot("HomePage");
  }


  /*--------------------------*/
  /*----------SOCKET---------*/
  /*--------------------------*/

  /**
   * Starts all the listeners for socketIO
   */
  handleSocketListeners() {
    this.socket.on('sendItem', (data) => {
      this.socketGetItem(data, this);
    });
  }

  /**
   * Handles items sent to the client from the API/server
   * @param  {any} parsedData The data received from the server
   * @param  {any} scope      Parent scope resolution
   */
  socketGetItem(parsedData, scope) {
    var isFound = false;
    if(scope.session_id == parsedData.data.attributes.session_id) {
      for(let itemIter of scope.items) {
        if(itemIter.getId() == parsedData.data.attributes.item.i_id) {
          isFound = true;
          itemIter.setPrice(parsedData.data.attributes.item.i_price);
          itemIter.setName(parsedData.data.attributes.item.i_name);
          itemIter.setQuantity(parsedData.data.attributes.item.i_quantity);
        }
      }
      if(!isFound) {
        scope.items.push(new Item(parsedData.data.attributes.item.i_price, parsedData.data.attributes.item.i_quantity, parsedData.data.attributes.item.i_name, parsedData.data.attributes.item.i_id));
      }
    }
  }

}