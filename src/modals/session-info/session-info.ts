import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Component({
    selector: 'modal-session-info',
    templateUrl: 'session-info.html'
})
export class SessionInfoModal {

  public session_id: string;

  constructor(
    private viewController: ViewController,
    private storage: Storage) {
    }

  public dismiss() {
    this.viewController.dismiss();
  }

  ionViewDidEnter() {
    this.storage.get('session_id').then((data) => {
      this.session_id = data;
    });
  }

}
