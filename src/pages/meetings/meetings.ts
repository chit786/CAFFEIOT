import { Component } from '@angular/core';
import { ModalController,NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import {MeetingDetails} from '../meeting-details/meeting-details';
import {ScheduleMeeting} from '../schedule-meeting/schedule-meeting';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import firebase from 'firebase';


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
    this.meetingListHost = this.af.database.list('/userProfile/'+firebase.auth().currentUser.uid+'/meetings/host',{
      query:{
        orderByChild : 'conferenceDate'
      }
    })
    .map((_users) => {
    return _users.map((_user) => {
        _user.group = this.af.database.list('/userProfile/'+firebase.auth().currentUser.uid+'/meetings/host/' +_user.$key + '/users')
          .map((_userRefs)=>{
            return _userRefs.map((_userRef)=>{
              _userRef.profilePicture = this.af.database.object('/userProfile/' + _userRef.$key) 
              return _userRef;

            })
          })
        
        return _user
    }) 
  
}) as FirebaseListObservable<any>;
     this.meetingListMember = this.af.database.list('/userProfile/'+firebase.auth().currentUser.uid+'/meetings/member').map((_users) => {
    return _users.map((_user) => {
        _user.group = this.af.database.list('/userProfile/'+firebase.auth().currentUser.uid+'/meetings/member/' +_user.$key + '/users')
         .map((_userRefs)=>{
            return _userRefs.map((_userRef)=>{
              _userRef.profilePicture = this.af.database.object('/userProfile/' + _userRef.$key) 
              return _userRef;

            })
          })
        return _user
    }) 
}) as FirebaseListObservable<any>;

  }

  ionViewDidLoad() {
    
    
  }

  addMeeting() {
   
    this.navCtrl.push(ScheduleMeeting, {
      isPopup: true
    });
  }

   viewItem(teamKey,title){
     this.navCtrl.push(MeetingDetails, {
      teamKey : teamKey,
      title:title
     });
   }

   isHost(){
     if(this.meetings=='host'){
       return true;
      }else{
         return false;
     }
   }

}
