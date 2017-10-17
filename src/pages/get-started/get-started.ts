import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

// Used for storing user data locally
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector:     'page-get-started',
  templateUrl:  'get-started.html',
})

export class GetStartedPage {

  nickname:     string;
  color:        string;
  activeColor:  Object;

  constructor(private navCtrl:    NavController, 
              private navParams:  NavParams, 
              private storage:    Storage) {

    this.color =  "rgb(242, 111, 129)";
    this.activeColor = { 'background-color': this.color };
    
  }

  // Set the user's prefered color to the selected color
  selectedColor($event):void {

    // Clicked div
    var element = $event.currentTarget;

    // Set 'color' to the background color of the label of the div which was clicked on
    this.color = window.getComputedStyle(element.querySelector("label")).backgroundColor;
    this.activeColor = { 'background-color': this.color };

    // Update selected color radio buttons
    document.getElementsByClassName("active")[0].classList.remove("active");
    element.className += " active";
  }

  navigateToHomePage(): void {

    if(this.nickname != "" && this.nickname != null) { this.storage.set('nickname', this.nickname); }
    this.storage.set('color', this.color);

    this.navCtrl.setRoot("HomePage");
  }

  // If the user has used the app before, skip to the home page
  ionViewWillEnter() {

    // Delete for production
    this.storage.clear();

    // this.storage.length().then( length => {
    //   if(length >= 2)
    //     this.navCtrl.setRoot("HomePage");
    // });
  }

  ionViewDidEnter() {
    // this.navCtrl.setRoot("SessionPage");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GetStartedPage');
  }

}
