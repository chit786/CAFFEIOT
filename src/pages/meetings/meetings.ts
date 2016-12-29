import { Component,Pipe, PipeTransform } from '@angular/core';
import { ModalController,NavController,ItemSliding } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import {MeetingDetails} from '../meeting-details/meeting-details';
import {AngularFire, FirebaseListObservable} from 'angularfire2';


/*
  Generated class for the Meetings page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

@Component({
  selector: 'page-meetings',
  templateUrl: 'meetings.html'
})

export class Meetings {
  //public meetings = [];
 
  
  meetings:any;
  myDay;
  myDate;
    meetingListHost : FirebaseListObservable<any>;
    meetingListMember : FirebaseListObservable<any>;
  constructor(public af: AngularFire,public navCtrl: NavController,public alertCtrl: AlertController,public modalCtrl: ModalController) {

    this.meetings = "host";
    this.meetingListHost = this.af.database.list('/userProfile/'+firebase.auth().currentUser.uid+'/meetings/host').map((_users) => {
    return _users.map((_user) => {
        _user.group = this.af.database.list('/userProfile/'+firebase.auth().currentUser.uid+'/meetings/host/' +_user.$key + '/users')
        return _user
    }) 
}) as FirebaseListObservable<any>;
     this.meetingListMember = this.af.database.list('/userProfile/'+firebase.auth().currentUser.uid+'/meetings/member').map((_users) => {
    return _users.map((_user) => {
        _user.group = this.af.database.list('/userProfile/'+firebase.auth().currentUser.uid+'/meetings/host/' +_user.$key + '/users')
        return _user
    }) 
}) as FirebaseListObservable<any>;

  }

  ionViewDidLoad() {
    console.log('Hello Meetings Page');
    
  }

  addMeeting() {
    let prompt = this.alertCtrl.create({
      title: 'New Meeting',
      message: "Enter Meeting Title",
      inputs: [
        {
          name: 'title',
          placeholder: 'Title'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            console.log('Saved clicked');
            
          }
        }
      ]
    });
    prompt.present();
  }

   viewItem(){
     this.navCtrl.push(MeetingDetails, {
       //item:item
       title:"Portfolio - UX design Discussion",
       when:"Today, 18:45 @ Innovation Lab 234A "
     });
   }

}
