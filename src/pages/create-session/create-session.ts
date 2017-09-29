import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

import { HttpProvider } from '../../providers/HttpProvider';
import { Timeout } from '../../providers/Timeout';
import { Alert } from '../../providers/Alert';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-create-session',
  templateUrl: 'create-session.html',
  providers:[HttpProvider, Timeout, Alert]
})

export class CreateSessionPage {

  loading: any; // Loading spinner
  imageData: any;
  timeoutId: any;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private loadingCtrl: LoadingController,
    private storage: Storage,
    private camera: Camera,
    private httpProvider: HttpProvider,
    private timeout: Timeout) {}

  /**
   * Accesses cordova's camera  to take an image
   * @param  {String} session_id The currently created session id
   */
  captureImage(session_id) {

    console.log("Setting camera options");
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: this.camera.EncodingType.JPEG,
      saveToPhotoAlbum: false,
	    correctOrientation: true
    };

    console.log("Accessing device's camera");
    var thisPage = this;
    this.camera.getPicture(options).then(function(imageData) {

      console.log("Sending data to HTTP");
      thisPage.timeout.startTimeout("Launch device camera");
      thisPage.httpProvider.sendSessionImage(imageData, session_id)
        .then((data) => {

          thisPage.timeout.endTimeout();
          console.log("Success: "+data);

          console.log("Redirecting to SessionPage");
          thisPage.navCtrl.setRoot("SessionPage");

          // console.log("Cleaning up");
          // thisPage.camera.cleanup().then((data) => {
          //   console.log("Clean up successful");
          // }, (err) => {
          //   console.log("Clean up error: "+err);
          // });
        }, (err) => {
          console.log("Error Target: "+err.target);
          console.log("Error Source: "+err.source.substr(0,1000));
          console.log("Error Code: "+err.code);
          console.log("Error Status: "+err.http_status);
        });
    }, (err) => {
      console.log("Camera error occured: "+err);
    });

  }

  /**
   * Calls the HttpProviders create session functions
   */
  initializeSession() {
    var thisPage = this;

    thisPage.timeout.startTimeout("get stored nickname");
    thisPage.storage.get('nickname').then(nickname => {

      thisPage.timeout.endTimeout();

      console.log("Sending nickname: "+nickname);

      thisPage.timeout.startTimeout("get stored color");
      thisPage.storage.get('color').then(color => {

        thisPage.timeout.endTimeout();

        console.log("Sending color: "+color);

        console.log("Call http provider's createSession");
        thisPage.timeout.startTimeout("call http provider's createSession");
        thisPage.httpProvider.createSession(nickname, color).then(json => {

          thisPage.timeout.endTimeout();

          var session_vars = JSON.parse(json.data);

          console.log("createSession Response JSON: "+session_vars);
          var session_id = session_vars.data.attributes.session_id.toLowerCase();
          console.log("createSession Response JSON session_id: "+session_id.toLowerCase());
          var user_id = session_vars.data.attributes.user_id.toLowerCase();
          console.log("createSession Response JSON user_id: "+user_id.toLowerCase());

          thisPage.storeCreateSessionResponse(session_id, user_id);

        });
      });
    });

  }

  /**
   * Stores session data locally
   * @param  {String} session_id The newly created session's id
   * @param  {String} user_id    The current user creating the session
   */
  storeCreateSessionResponse(session_id, user_id) {

    var thisPage = this;
    thisPage.timeout.startTimeout("store session ID locally");
    thisPage.storage.set('session_id', session_id).then( (data) => {
      console.log("Stored session ID: "+session_id);

      thisPage.timeout.endTimeout();

      thisPage.timeout.startTimeout("store user ID locally");
      thisPage.storage.set('user_id', user_id).then( (data) => {

        thisPage.timeout.endTimeout();

        thisPage.captureImage(session_id);

      }, (err) => {
        console.log("Storing user_id "+user_id+" in local storage failed...");
      });

    }, (err) => {
      console.log("Storing session_id "+session_id+" in local storage failed...");
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateSessionPage');
  }

  ionViewDidEnter() {

    console.log("CreateSessionPage View Did Enter");
    this.initializeSession();

  }

}
