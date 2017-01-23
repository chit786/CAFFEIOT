import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController } from 'ionic-angular';
import { StatusBar,Push, Splashscreen,Keyboard } from 'ionic-native';
import firebase from 'firebase';
import { HomePage } from '../pages/home/home';
import { Orders } from '../pages/orders/orders';
import { PlaceOrder } from '../pages/place-order/place-order';
import { LoginPage } from '../pages/login/login';
import {Meetings} from '../pages/meetings/meetings';
import {MyTeams} from '../pages/my-teams/my-teams';
import {Questions} from '../pages/questions/questions';
import {Tasks} from '../pages/tasks/tasks';
import {ScheduleMeeting} from '../pages/schedule-meeting/schedule-meeting';
import {Contacts} from '../pages/contacts/contacts';
import {CacheService} from "ionic-cache/ionic-cache";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  //rootPage: any = LoginPage;
  rootPage: any ;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform,public alertCtrl: AlertController,cache: CacheService) {

    cache.setDefaultTTL(60 * 60); 
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
      }else{
        this.rootPage = HomePage;
        this.initializeApp(user);
      }
    });


    //this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'HomePage', component: HomePage },
      { title: 'Contacts', component: Contacts },
      { title: 'Orders', component: Orders },
       { title: 'Meetings', component: Meetings },
      { title: 'My Teams', component: MyTeams },
      { title: 'All Tasks', component: Tasks },
      { title: 'Schedule Meeting', component: ScheduleMeeting },
      { title: 'Have a Question?..', component: Questions },
      { title: 'Logout', component:'' },

    ];

  }

  initializeApp(user) {
    
    this.platform.ready().then(() => {
      Keyboard.disableScroll(true);
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
        //console.log("device token ->", data.registrationId);

      var key = firebase.database().ref('/userProfile').child(user.uid);
      // if(key.key){
           
      // }else{
            // var postData = {
              
            //    regID :  data.registrationId,
            // }
            // var updates= {}
            
            // updates['/userProfile/' + key ] = postData;
             firebase.database().ref('/userProfile/' + key + '/regID').set(data.registrationId);

      // }
      
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
                if(data.message=="Coffee?"){
                   self.nav.push(PlaceOrder, {message: data.message});
                }else{
                  self.nav.push(HomePage, {message: data.message});
                }
               
              }
            }]
          });
          confirmAlert.present();
        } else {
          //if user NOT using app and push notification comes
          //TODO: Your logic on click of push notification directly

         // self.nav.push(HomePage, {message: data.message});
           if(data.message=="Coffee?"){
                   self.nav.push(PlaceOrder, {message: data.message});
                }else{
                  self.nav.push(HomePage, {message: data.message});
                }
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
    if(page.title=="Logout"){
      firebase.auth().signOut();
       
    }else{
        this.nav.setRoot(page.component);
    }
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    
  }
}
