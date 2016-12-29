import { Component } from '@angular/core';
import { NavController,AlertController } from 'ionic-angular';
import { TeamsData } from '../../providers/teams-data';
import {ProfileData} from '../../providers/profile-data';
import {MyTeamDetails} from '../my-team-details/my-team-details';
import firebase from 'firebase';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import {ScheduleMeeting} from '../schedule-meeting/schedule-meeting';
/*
  Generated class for the MyTeams page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-my-teams',
  templateUrl: 'my-teams.html'
})
export class MyTeams {
   items : FirebaseListObservable<any>;

  teamNameString : any;
  constructor(public navCtrl: NavController,public af: AngularFire,public alertCtrl: AlertController,public teamData: TeamsData,public profileData : ProfileData) {
    this.items = af.database.list(this.teamData.userProfile + '/teams');
    
  }

  ionViewDidLoad() {
   // this.items = this.teamData.getTeams();
   //console.log(this.items);
  }

  addTeam(){
    
     let prompt = this.alertCtrl.create({
      title: 'New Team',
      message: "Enter Team Name",
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
            // var valExist = true;
            // for(var val in this.items){
            //     if(this.items[val]==data.title){
            //       valExist = false;
            //       this.showAlert();
            //     }
            // }
            // if(valExist){
            //   //save team detail in user profile
            //    this.items = [];
            //    this.saveTeams(data.title);
            //   this.items = this.teamData.getTeams();
            //  // this.items.push(data.title);
            // }
            var newItem = this.items.push({
              teamName: data.title,
               isOwner : true,
            });
            var key =  this.teamData.userProfile.key
            this.teamData.userProfile.on('value',function(snapshot){
                 var firstName = snapshot.val().firstName ;
           
            var lastName = snapshot.val().lastName; 
            var profilepic = snapshot.val().profilepic;
             var regID = snapshot.val().regID;
             var postData = {
              
               firstName : firstName,
               lastName : lastName,
               profilepic : profilepic,
               regID: regID
            }
            var updates= {}
            
            updates['/teams/' + newItem.key + '/members/' + key ] = postData;
            firebase.database().ref().update(updates);
            })
           
            
        // var teams =  firebase.database().ref('/teams/' + newItem.key + '/members/' + this.teamData.userProfile.key );
           
            
          }
        }
      ]
    });
    prompt.present();
    
  }

  addMeeting(team){

     this.navCtrl.push(ScheduleMeeting, {
      team: team
    });

  }
  saveTeams(teamName){
     var ref = firebase.database().ref('teams');
    return new Promise((resolve, reject) => {

   
      var dataToSave = {
        'name': teamName, // name of the team
        'members': {'1':{'userID': firebase.auth().currentUser.uid}}
      };

       var path = ref.push(dataToSave)
       //, (_response) => {
      //   resolve(_response);
      // })
      // .catch((_error) => {
      //   reject(_error);
      // })

      //save this key to the logged in user 
      this.profileData.updateTeam(path.key);

   
    });
  
   
    
  }



  itemSelected(item){
   
    this.navCtrl.push(MyTeamDetails
    ,{
      item:item
    });

  }
  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Name Exists!',
      subTitle: 'Please choose different name!!',
      buttons: ['OK']
    });
    alert.present();
  }
  removeTeam(itemID){
    var ownerFlag;
    var isOwner= firebase.database().ref('/userProfile/'+firebase.auth().currentUser.uid + '/teams/'+itemID);
    isOwner.once('value',function(snap){
     
        ownerFlag = snap.child('isOwner').val();
     
    
    })



    this.items.remove(itemID).then(()=>{
      
        var teamNode = this.af.database.object('/teams/'+itemID+'/members/'+firebase.auth().currentUser.uid);
        teamNode.set(null).then(()=>{
            if(ownerFlag){
            var membersNode = firebase.database().ref('/teams/'+itemID+'/members');
            membersNode.once('value',function(snapshot){
                snapshot.forEach(function(child){
                  
                      var setOwnerNode = firebase.database().ref('/userProfile/'+child.key+'/teams/'+itemID);
                      setOwnerNode.update({
                      isOwner : true,
                      });
                    return true;

                });
                

            })
            //
        }
        }
        );
        
    });
  }

}
