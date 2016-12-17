import { Component } from '@angular/core';
import { ModalController,NavController,ItemSliding } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import {MeetingDetails} from '../meeting-details/meeting-details';

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
  constructor(public navCtrl: NavController,public alertCtrl: AlertController,public modalCtrl: ModalController) {

    this.meetings = "host";

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

  // mouseoverwideDiv(itemSlide: ItemSliding){
  //   itemSlide.setElementClass("active-sliding", false);
  //   itemSlide.setElementClass("active-slide", false);
  //   itemSlide.setElementClass("active-options-right", false);

  // }

  // mouseleavewideDiv(itemSlide: ItemSliding){
  //   itemSlide.setElementClass("active-sliding", true);
  //   itemSlide.setElementClass("active-slide", true);
  //   itemSlide.setElementClass("active-options-right", true);

  // }

}
