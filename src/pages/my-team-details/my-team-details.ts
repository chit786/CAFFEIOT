import { Component } from '@angular/core';
import { NavController,NavParams,ViewController,AlertController } from 'ionic-angular';
import { TeamsData } from '../../providers/teams-data';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import firebase from 'firebase';
/*
  Generated class for the MyTeamDetails page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-my-team-details',
  templateUrl: 'my-team-details.html'
})
export class MyTeamDetails {
    title;
    name;
    profilePic;
    role;
    teamMembers : FirebaseListObservable<any>;
  constructor(public navParams: NavParams,public af: AngularFire ,public navCtrl: NavController, public view: ViewController
  ,public teamData:TeamsData,public alertCtrl: AlertController) {

    this.title = this.navParams.get('item').teamName;
     //this.teamMembers = [];
     //load all client data corresponding to the meeting id
    // this.teamMembers = this.teamData.getClientInfo(this.navParams.get('item'));
   
     this.teamMembers = af.database.list('/teams/'+ this.navParams.get('item').$key + '/members' )
  

  }

  ionViewDidLoad() {
     

  }

  addMember(){
    let prompt = this.alertCtrl.create({
      title: 'New Member',
      message: "Enter Member Email",
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
          text: 'Send',
          handler: data => {
            var key = this.navParams.get('item').$key;
            console.log('Send clicked');
            console.log(data.title);
            console.log(this.navParams.get('item').id);
            var profileindex = firebase.database().ref('/profile-index/' + data.title.replace("@","CAFFEIOTAT").replace(".","CAFFEIOTDOT") + '/uniqueID')
            profileindex.once('value',function(snapshot){
              
              var profile = firebase.database().ref('/userProfile/' + snapshot.val())
              profile.once('value',function(childsnapshot){
                        var firstName = childsnapshot.val().firstName ;
           
                        var lastName = childsnapshot.val().lastName; 
                        var profilepic = childsnapshot.val().profilepic;
                        var postData = {
                          
                          firstName : firstName,
                          lastName : lastName,
                          profilepic : profilepic  
                        }
                        var updates= {}
                        
                        updates['/teams/' + key + '/members/' + snapshot.key ] = postData;
                        firebase.database().ref().update(updates);
              })
             

            })
            //this.teamMembers = this.teamData.addMembertoTeam(data.title,this.navParams.get('item'));
            
            // console.log(isMemebrAdded);
            //   if(isMemebrAdded){
            //     let alert = this.alertCtrl.create({
            //       title: 'New Member Added!',
            //       subTitle: data.title + ' is just added!!',
            //       buttons: ['OK']
            //     });
            //     alert.present();
                
            //   }else{
            //     let alert = this.alertCtrl.create({
            //       title: 'Some Issue in adding new member!',
            //       subTitle: ' Please retry ',
            //       buttons: ['OK']
            //     });
            //     alert.present();
            //   }
            

            
          }
        }
      ]
    });
    prompt.present();

    


  }

  removeMember(memberID){

   this.teamMembers.remove(memberID);

  }


}
