import { Injectable } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';

@Injectable()
export class Alert {

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController) {}

    public sendAlert(alertMessage);
    public sendAlert(alertMessage, alertTime);

    public sendAlert(alertMessage, alertTime?) {
      var time = 5000;
      if(alertTime) { time = alertTime; }
      let toast = this.toastCtrl.create({
        message: alertMessage,
        duration: time,
        showCloseButton: true,
        closeButtonText: "Ok",
        position: 'top'
      });
      toast.present();
    }

}
