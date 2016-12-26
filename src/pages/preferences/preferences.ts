import { Component } from '@angular/core';
import { NavController,ViewController } from 'ionic-angular';
import { HomePage } from '../home/home';
/*
  Generated class for the Preferences page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-preferences',
  templateUrl: 'preferences.html'
})
export class Preferences {

  constructor(public navCtrl: NavController, public view: ViewController) {

  }

  ionViewDidLoad() {
    console.log('Hello Preferences Page');
  }
  close(){
    this.view.dismiss();
    this.navCtrl.setRoot(HomePage);

  }

}
