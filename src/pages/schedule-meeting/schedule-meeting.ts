import { Component } from '@angular/core';
import { NavController,ToastController,NavParams } from 'ionic-angular';
import { AngularFire} from 'angularfire2';
import firebase from 'firebase';
/*
  Generated class for the ScheduleMeeting page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-schedule-meeting',
  templateUrl: 'schedule-meeting.html'
})
export class ScheduleMeeting {
  conferenceDate;
  myTime;
  teamName;
  meetingTitle;
  meetingDescription;
  parentTeam;
  parentTeamName;
  date: any = new Date().toISOString();
  teams;
  isDisabled;

  firstNameref

  constructor( public navParams: NavParams,public navCtrl: NavController,public af:AngularFire,public toastCtrl: ToastController) {

  }

  ionViewDidEnter() {
    this.teams = this.af.database.list('/userProfile/'+firebase.auth().currentUser.uid + '/teams');
  
    
    this.parentTeam = this.navParams.get('teamName');
    
    if(this.parentTeam){
      // this.parentTeamName = this.parentTeam.teamName;
    this.teamName = this.parentTeam;
    }
    
  }
 
saveItem(){
  if(this.teamName){
    var  teamVal = this.teamName;
    //for whole database
    var meetingstitle = this.meetingTitle;
    var meetingsdescription = this.meetingDescription;
    var conferencesDate = this.conferenceDate;
    var prefTime = this.myTime;
    var teamID = this.teamName;

    let meetingDetails = {
       meetingTitle : meetingstitle,
    meetingDescription : meetingsdescription,
    conferenceDate : conferencesDate,
    myTime: prefTime,
    teamName : teamID
    }
    var meetings = firebase.database().ref('/userProfile/'+firebase.auth().currentUser.uid + '/meetings/host');
    var meetingKey 
    if(this.navParams.get('meetKey')){
      
      meetingKey= this.navParams.get('meetKey');
    }else{
      meetingKey = meetings.push(meetingDetails);
    }
  

  //post host details to meeting list
  var hostref = firebase.database().ref('/userProfile/'+firebase.auth().currentUser.uid);
  hostref.once('value',function(snap){
    
    var fstName = snap.val().firstName;
    var lstName = snap.val().lastName;

    firebase.database().ref('/meetings/'+meetingKey.key).update({
      ownerName : fstName + ' ' + lstName,
    }); 

  });

  var teamNode;
  var teams =  firebase.database().ref('/userProfile/'+firebase.auth().currentUser.uid + '/teams');
  teams.once('value',function(snapshot){
      snapshot.forEach(function(child){
          if(child.child('teamName').val()==teamVal){
            teamNode = child.key;
           
            //add meeting schedule to all the team members
            var teammembers = firebase.database().ref('/teams/'+teamNode + '/members')
            teammembers.once('value',function(snapshot){
                 var updates = {};
                snapshot.forEach(function(childSnapshot){
                   
                    let user={
                      firstName : childSnapshot.child('firstName').val(),
                      lastName : childSnapshot.child('lastName').val(),
                      profilepic : childSnapshot.child('profilepic').val(),
                      regID : childSnapshot.child('regID').val()
                    }
                   
                    if(childSnapshot.key!=firebase.auth().currentUser.uid){
                       let meetingDetailswithmembers = {
                      meetingTitle : meetingstitle,
                      meetingDescription : meetingsdescription,
                      conferenceDate : conferencesDate,
                      myTime: prefTime,
                      teamName : teamID,
                      users : snapshot.val()
                    }
                     updates['/userProfile/'+childSnapshot.key + '/meetings/member/' + meetingKey.key] = meetingDetailswithmembers;
      
                    }else{
                       updates['/userProfile/'+childSnapshot.key + '/meetings/host/' + meetingKey.key + '/users'] = snapshot.val();
                    }

                    updates['/meetings/'+ meetingKey.key + '/users/' + childSnapshot.key] = user
                   

                    return false;
                });
                firebase.database().ref().update(updates);

            });

            return true;
          }
          return false;

      })
  });

  firebase.database().ref('/meetings/'+ meetingKey.key).update(meetingDetails).then(()=>{
     
                          let toast = this.toastCtrl.create({
                          message: 'Meeting scheduled',
                          duration: 3000
                        });
                        toast.present();
                        this.meetingTitle = "";
                        this.conferenceDate = "";
                        this.teamName = "";
                        this.myTime = "";
                        this.meetingDescription = "";

  });

  }else{
     let toast = this.toastCtrl.create({
                          message: 'Please choose a team!',
                          duration: 3000
                        });
                        toast.present();

  }
  


}



}
