import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { User } from '../../providers/User';

import { HttpProvider } from '../../providers/HttpProvider';

@Component({
    selector: 'modal-all-users',
    templateUrl: 'all-users.html',
    providers:[HttpProvider]
})
export class AllUsersModal {

  nickname:                 string;
  color:                    string;
  session_id:               string;
  user_id:                  string;
  activeBackgroundColor:    Object;
  activeColor:              Object;
  users:                    Array<User>;

  constructor(
    private viewController: ViewController,
    private storage:        Storage,
    private httpProvider:   HttpProvider) {

      this.users = new Array<User>();

    }

  public dismiss() {
    this.viewController.dismiss();
  }

  ionViewDidEnter() {

    this.loadResources(this)
    .then( data => {
  
        this.httpProvider.getAllUsers(this.session_id).then( (data) => {
          this.parseUsers(data);
        });
  
    })
    
  }

  parseUsers(json) {
    var parsedData = JSON.parse(json.data);
    console.log(parsedData.data.attributes);
    console.log(parsedData.data.attributes.users[0].u_color+" "+parsedData.data.attributes.users[0].u_nickname+" "+parsedData.data.attributes.users[0].u_id);
    for(var i = 0; i<parsedData.data.attributes.users.length; i++) {
      this.users.push(new User (
        this.toTitleCase(parsedData.data.attributes.users[i].u_nickname),
        parsedData.data.attributes.users[i].u_color,
        parsedData.data.attributes.users[i].u_id
      ));
    }

    console.log(this.users.length);
    console.log(this.users[0].getNickname()+" "+this.users[0].getColor()+" "+this.users[0].getId());
  }

  openUserItems(u_id) {

    console.log("Open user: "+u_id);

  }

  toTitleCase(input) {
      return input.charAt(0).toUpperCase() + input.substr(1).toLowerCase();
  };

  loadResources(scope) {
    return new Promise(function (resolve, reject) {
      
      Promise.all([ scope.storage.get('session_id'), 
                    scope.storage.get('user_id'), 
                    scope.storage.get('nickname'),
                    scope.storage.get('color')
      ]).then( results => {
        
        scope.session_id = results[0];
        scope.user_id = results[1];
        scope.nickname = results[2];
        scope.color = results[3];
        scope.activeBackgroundColor = { 'background-color': scope.color };
        scope.activeColor = { 'color': scope.color };
        resolve();
      
      }, (errors) => {

        console.log(errors);

      });
    });
  }

}
