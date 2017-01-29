import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import firebase from 'firebase';
/*
  Generated class for the Tasks page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-tasks',
  templateUrl: 'tasks.html'
})
export class Tasks {

  // tasks;
  tasks : FirebaseListObservable<any>;
  constructor(public navCtrl: NavController,public af:AngularFire) {
    // this.tasks = [{today:'Today'},{yesterday:'Yesterday'},{tomorrow:'Tomorrow'},{before:'Before'},{later:'Later'}]
    this.tasks = af.database.list('/userProfile/' + firebase.auth().currentUser.uid + '/tasks')
  }

  ionViewDidLoad() { }

  removeMinute(key,memberKey){

    this.tasks.remove(key);


  }
  completeMinute(key,memberKey){
  
    firebase.database().ref('/userProfile/' + firebase.auth().currentUser.uid + '/tasks/' + key).update({
      status : 'Complete'
    })

  }

}
