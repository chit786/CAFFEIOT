import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController } from 'ionic-angular';
import { StatusBar,Push, Splashscreen } from 'ionic-native';
import firebase from 'firebase';
import { HomePage } from '../pages/home/home';
import { Orders } from '../pages/orders/orders';
import { PlaceOrder } from '../pages/place-order/place-order';
import {OrderDetail} from '../pages/order-detail/order-detail';
import { LoginPage } from '../pages/login/login';
import {Meetings} from '../pages/meetings/meetings';
import {MeetingDetails} from '../pages/meeting-details/meeting-details';
import {MyTeams} from '../pages/my-teams/my-teams';
import {Questions} from '../pages/questions/questions';
import {ProfilePage} from '../pages/profile/profile';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform,public alertCtrl: AlertController) {
    //initialize firebase
    firebase.initializeApp({
      apiKey: "AIzaSyCLoFM5qxP6IXTMThJ1mm7B8EqXYaEMXAE",
      authDomain: "caffeiot.firebaseapp.com",
      databaseURL: "https://caffeiot.firebaseio.com",
      storageBucket: "caffeiot.appspot.com",
      messagingSenderId: "558368532218"
    });

    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        this.rootPage = LoginPage;
      }
    });


    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'HomePage', component: HomePage },
      { title: 'Orders', component: Orders },
       { title: 'Meetings', component: Meetings },
      { title: 'My Teams', component: MyTeams },
      { title: 'Have a Question?..', component: Questions },
    ];

  }

  initializeApp() {
    
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      if (this.platform.is('android')){
      StatusBar.styleDefault();
       Splashscreen.hide();
      let push = Push.init({
        android: {
          senderID: "558368532218"
        },
        ios: {
          alert: "true",
          badge: false,
          sound: "true"
        },
        windows: {}
      });

       push.on('registration', (data) => {
        console.log("device token ->", data.registrationId);
        //TODO - send device token to server
      });
      push.on('notification', (data) => {
        console.log('message', data.message);
        let self = this;
        //if user using app and push notification comes
        if (data.additionalData.foreground) {
          // if application open, show popup
          let confirmAlert = this.alertCtrl.create({
            title: 'New Notification',
            message: data.message,
            buttons: [{
              text: 'Ignore',
              role: 'cancel'
            }, {
              text: 'View',
              handler: () => {
                //TODO: Your logic here
                self.nav.push(HomePage, {message: data.message});
              }
            }]
          });
          confirmAlert.present();
        } else {
          //if user NOT using app and push notification comes
          //TODO: Your logic on click of push notification directly
          self.nav.push(HomePage, {message: data.message});
          console.log("Push notification clicked");
        }
      });
      push.on('error', (e) => {
        console.log(e.message);
      });
    }
    });
    
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
