import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HttpProvider } from '../../providers/HttpProvider';
import { Timeout } from '../../providers/Timeout';
import { Alert } from '../../providers/Alert';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';

@IonicPage()
@Component({
  selector: 'page-join-session',
  templateUrl: 'join-session.html',
  providers:[HttpProvider, Timeout, Alert]
})
export class JoinSessionPage {

  session_id: string;
  color: string;
  activeBackgroundColor: Object;
  activeColor: Object;

  constructor(
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private navParams: NavParams,
    protected storage: Storage,
    private httpProvider: HttpProvider,
    private timeout: Timeout,
    private qrScanner: QRScanner) { }

  /**
   * Attempts to join a session through promise chaining and saves the response locally
   */
  joinSession(): void {

    this.timeout.startTimeout("Getting Nickname");  // Initial timeout
    this.getNickname(this)
    .then( (data) => { this.timeout.timeoutHandler("Getting Color"); return this.getColor(data, this); })
    .then( (data) => { this.timeout.timeoutHandler("Sending Join Request to Server"); return this.sendJoinRequest(data, this); })
    .then( (data) => { this.timeout.timeoutHandler("Storing User ID"); return this.storeUserId(data, this); })
    .then( (data) => { this.timeout.timeoutHandler("Storing Session ID"); return this.storeSessionId(this); })
    .then( (data) => {

      this.timeout.endTimeout();  // Stop timeout chain

      console.log("Redirecting to SessionPage");
      this.navCtrl.setRoot("SessionPage");
    });
  }

  openScanner() {
    window.document.querySelector('ion-app').classList.add('transparentBody');
    window.document.querySelector('ion-content').classList.add('transparentBody');
    window.document.querySelector('body').classList.add('transparentBody');
    window.document.querySelector('html').classList.add('transparentBody');
    // window.document.querySelector('join-session').classList.add('transparentBody');
    // window.document.querySelector('#join-session').classList.add('transparentBody');
    this.qrScanner.prepare().then((status: QRScannerStatus) => {
        if (status.authorized) {
          console.log("camera permission was granted");
           console.log("start scanning");
           let scanSub = this.qrScanner.scan().subscribe((text: string) => {
             this.session_id = text;
             console.log('Scanned session_id: ', text);
             console.log("hide camera preview");
             window.document.querySelector('ion-app').classList.remove('transparentBody');
             window.document.querySelector('ion-content').classList.remove('transparentBody');
             window.document.querySelector('body').classList.remove('transparentBody');
             this.qrScanner.hide();
             console.log("stop scanning");
             scanSub.unsubscribe();
           });

           console.log("show camera preview");
          //  window.document.querySelector('ion-app').classList.add('transparentBody');
          //  window.document.querySelector('ion-content').classList.add('transparentBody');
           this.qrScanner.show();
           console.log("wait for user to scan something, then the observable callback will be called");

        } else if (status.denied) {
          console.log("camera permission was permanently denied. You must use QRScanner.openSettings() method to guide the user to the settings page. Then they can grant the permission from there");
        } else {
          console.log("permission was denied, but not permanently. You can ask for permission again at a later time.")
        }
      }).catch((e: any) => console.log('Error is ', e));
    }

  /**
   * Attempts to retrieve the locally stored nickname
   * @param  {} scope Reference to the class scope
   */
  getNickname(scope){

    console.log("Attempting to retrieve the user's nickname");
    return new Promise(function (resolve, reject) {
      scope.storage.get('nickname').then(nickname => {

        console.log("Successfully retrieved the nickname: "+nickname);
        resolve(nickname);

      }, (err) => { reject(err) });
    });
  }

  /**
   * Attempts to retrieve the locally stored color
   * @param  {string} input Input from the previous chained call (nickname)
   * @param  {} scope Reference to the class scope
   */
  getColor(input, scope){

    console.log("Attempting to retrieve the user's color");
    return new Promise(function (resolve, reject) {
      scope.storage.get('color').then(color => {

        console.log("Successfully retrieved the color: "+color);
        resolve({ nickname: input, color:color });

      }, (err) => { reject(err) });
    });
  }

  /**
   * Attempts to send a request to the server to join the session
   * @param  {string} input Input from the previous chained call ({nickname, color})
   * @param  {} scope Reference to the class scope
   */
  sendJoinRequest(input, scope) {

    console.log("Attempting to send a request to the server to join a session");
    return new Promise(function (resolve, reject) {
      scope.httpProvider.joinSession(scope.session_id.toLowerCase(), input.nickname, input.color).then( (json) => {

        var session_vars = JSON.parse(json.data);
        var user_id = session_vars.data.attributes.user_id;

        console.log("Successfully joined the session and retrieved the User ID: "+user_id);
        resolve(user_id);

      }, (err) => { reject(err) });
    });
  }

  /**
   * Attempts to store the user id locally
   * @param  {string} input Input from the previous chained call (user id)
   * @param  {} scope Reference to the class scope
   */
  storeUserId(input, scope){

    console.log("Attempting to store the User ID");
    return new Promise(function (resolve, reject) {
      scope.storage.set('user_id', input.toLowerCase()).then( (data) => {

        console.log("Successfully stored User ID: "+input);
        resolve(input);

      }, (err) => { reject(err) });
    });
  }

  /**
   * Attempts to store the session id locally
   * @param  {} scope Reference to the class scope
   */
  storeSessionId(scope){

    console.log("Attempting to store the Session ID");
    return new Promise(function (resolve, reject) {
      scope.storage.set('session_id', scope.session_id.toLowerCase()).then( (data) => {

        console.log("Successfully stored Session ID: "+scope.session_id.toLowerCase());
        resolve(scope.session_id.toLowerCase());

      }, (err) => { reject(err) });
    });
  }

  ionViewDidEnter() {
    this.storage.get('color').then((data) => {
      this.color = data;
      this.activeBackgroundColor = { 'background-color': this.color };
      this.activeColor = { 'color': this.color };
    });
  }

}
