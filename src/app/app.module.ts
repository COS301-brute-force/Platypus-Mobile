import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HTTP } from '@ionic-native/http';

// QR
import { NgxQRCodeModule  } from 'ngx-qrcode2';
import { QRScanner } from '@ionic-native/qr-scanner';

// Store user data locally
import { IonicStorageModule } from '@ionic/storage';

// Access mobile device camera
import { Camera } from '@ionic-native/camera';
import { FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';

import { MyApp } from './app.component';

//Pages
import { GetStartedPage } from '../pages/get-started/get-started';

// Modals
import { ProfileModal } from '../modals/profile/profile';
import { AboutModal } from '../modals/about/about';
import { SessionInfoModal } from '../modals/session-info/session-info';

@NgModule({
  declarations: [
    MyApp,
    GetStartedPage,
    ProfileModal,
    AboutModal,
    SessionInfoModal,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    NgxQRCodeModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    GetStartedPage,
    ProfileModal,
    AboutModal,
    SessionInfoModal,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    QRScanner,
    FileTransfer,
    File,
    HTTP,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
