import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

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

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello MinutesOfMeeting Page');
  }

}
