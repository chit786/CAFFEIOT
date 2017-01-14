import { Component } from '@angular/core';
import { NavController,NavParams,ViewController,AlertController } from 'ionic-angular';
import { TeamsData } from '../../providers/teams-data';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import firebase from 'firebase';

import { Contacts } from '../contacts/contacts';
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
    memberList = [];
    uName;
    //memberList : any;
     today:any = new Date().toISOString();
       year:any;
  month:any;
  day:any;
  orderID: any;
    teamMembers : FirebaseListObservable<any>;
    tempTeam : FirebaseListObservable<any>;
  constructor(public navParams: NavParams,public af: AngularFire ,public navCtrl: NavController, public view: ViewController
  ,public teamData:TeamsData,public alertCtrl: AlertController) {

    this.title = this.navParams.get('item').teamName;
     //this.teamMembers = [];
     //load all client data corresponding to the meeting id
    // this.teamMembers = this.teamData.getClientInfo(this.navParams.get('item'));
    var members = [];
     this.teamMembers = af.database.list('/teams/'+ this.navParams.get('item').$key + '/members');

      this.tempTeam = af.database.list('/teams/'+ this.navParams.get('item').$key + '/members',{ preserveSnapshot: true } )

     this.tempTeam.subscribe((snapshots)=>{
        snapshots.forEach(snapshot=>{

          if(snapshot.key==firebase.auth().currentUser.uid){
            this.uName = snapshot.val().firstName + ' ' + snapshot.val().lastName   
          }



          this.memberList[snapshot.key] = snapshot.val();
        })

     })

      this.year = this.today.split("-")[0];
           this.month = this.today.split("-")[1];
           this.day = ( this.today.split("-")[2] ).split("T")[0];
           this.orderID = ( this.today.split(":")[0] ).split("T")[1] + this.today.split(":")[1] + (this.today.split(":")[2]).split(".")[0]  ;


  }

  ionViewDidLoad() {
     

  }

  addNewmember(){
    this.navCtrl.push(Contacts, {
      isMeet : false,
      isPopup: true,
      teamKey : this.navParams.get('item')
    });


  }

  askCoffee(){

    var teamDataService = this.teamData;

    let teamOrder = {
      id : this.orderID,
      teamName : this.title,
      members : this.memberList,
      askedByKey : firebase.auth().currentUser.uid,
      status : "In Progress"

    }

    let orderDetail = {

       id:this.orderID,
     date : this.month+"/"+this.day+"/"+this.year,
     machineID : "A",
     status : "In Progress",
     rating : 0,
     askedByKey : firebase.auth().currentUser.uid,
     askedByname : this.uName
    }


    firebase.database().ref('/teamOrder').push(teamOrder).then((keyNode)=>{
      
        for(var val in this.memberList){
        
          firebase.database().ref('/orders/' + val.toString() + '/' + keyNode.key).update(orderDetail).then(()=>{

            teamDataService.askToMember(val.toString(),this.uName,"Coffee?");
          }
          )

        }

    });
    


  }


  removeMember(memberID){
   //remove from team
   this.teamMembers.remove(memberID);
   //remove team from userprofile which is removed
   var userNode = this.af.database.list('/userProfile/'+memberID+'/teams') 
   userNode.remove(this.navParams.get('item').$key);

  }


}
