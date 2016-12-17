import { Component } from '@angular/core';
import { NavController,NavParams,ViewController,AlertController } from 'ionic-angular';
import { TeamsData } from '../../providers/teams-data';
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
    teamMembers = [];
  constructor(public navParams: NavParams,public navCtrl: NavController, public view: ViewController
  ,public teamData:TeamsData,public alertCtrl: AlertController) {}

  ionViewDidLoad() {
     this.title = this.navParams.get('item').name;
     this.teamMembers = [];
     //load all client data corresponding to the meeting id
     this.teamMembers = this.teamData.getClientInfo(this.navParams.get('item'));




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
            console.log('Send clicked');
            
          }
        }
      ]
    });
    prompt.present();
  }


}
