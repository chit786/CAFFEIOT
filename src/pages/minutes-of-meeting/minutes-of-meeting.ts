import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';
import {AngularFire, FirebaseListObservable,FirebaseObjectObservable} from 'angularfire2';
import firebase from 'firebase';
/*
  Generated class for the MinutesOfMeeting page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-minutes-of-meeting',
  templateUrl: 'minutes-of-meeting.html'
})
export class MinutesOfMeeting {

    public minutes : FirebaseListObservable<any>;
    member;
    description;
    taskDate;
    public meetingNode : FirebaseObjectObservable<any>;
    options : FirebaseListObservable<any>;
  constructor(public navCtrl: NavController, public af : AngularFire,public navParams: NavParams) {

    // this.minutes = [
    //   {description:"Test Case",assignedTo:"Chitrang"},
    //   {description:"Test Case No",assignedTo:"Praveen"}
    // ];
    
  } 


  ionViewDidLoad() {

    this.options = this.af.database.list('/meetings/' + this.navParams.get('teamID') + '/users')
    this.meetingNode = this.af.database.object('/meetings/' + this.navParams.get('teamID'))
    this.minutes = this.af.database.list('/minutes/'+ this.navParams.get('teamID'))
    
  }
  saveItem(){

    var membername ;
    firebase.database().ref('/meetings/' + this.navParams.get('teamID') + '/users').child(this.member).once('value',function(snapshot){
      membername = snapshot.val().firstName + ' ' + snapshot.val().lastName


    })

    var desc = this.description;
    
    var dat = this.taskDate;

    firebase.database().ref('/minutes/' + this.navParams.get('teamID')).push({
      description : this.description,
      assignedTo : membername,
      status : 'Pending',
      memberKey:this.member,
      date : this.taskDate
    }).then(key=>{
      firebase.database().ref('/userProfile/' + this.member + '/tasks/' + key.key).update({
        description : desc,
        date : dat,
        status : 'Pending',
        meetID : this.navParams.get('teamID')
      }) 


      this.member = "",
      this.description = ""
      this.taskDate = ""
    });
    
  }

  removeMinute(key,memberKey){

    firebase.database().ref('/minutes/' + this.navParams.get('teamID') + '/'+ key).set(null);
    firebase.database().ref('/userProfile/' + memberKey + '/tasks/' + key).set(null);


  }
  completeMinute(key,memberKey){

      firebase.database().ref('/minutes/' + this.navParams.get('teamID') + '/'+ key).update({
        status : 'Complete'
      });
      firebase.database().ref('/userProfile/' + memberKey + '/tasks/' + key).update({
        status : 'Complete'
      });

  }

}
