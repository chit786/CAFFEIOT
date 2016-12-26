import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the Feed page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html'
})
export class Feed {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello Feed Page');
  }

}
