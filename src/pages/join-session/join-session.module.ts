import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { JoinSessionPage } from './join-session';

@NgModule({
  declarations: [
    JoinSessionPage,
  ],
  imports: [
    IonicPageModule.forChild(JoinSessionPage),
  ],
  exports: [
    JoinSessionPage
  ]
})
export class JoinSessionPageModule {}
