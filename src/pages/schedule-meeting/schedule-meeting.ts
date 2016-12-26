import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

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

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello ScheduleMeeting Page');
  }
 


}
