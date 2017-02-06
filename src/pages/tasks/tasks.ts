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
   
  }

  ionViewDidLoad() { 
    //  var today = new Date().toISOString();
    //                     var year = today.split("-")[0];
    //                     var month = today.split("-")[1];
    //                     var day = ( today.split("-")[2] ).split("T")[0]
    //                     today = year + '-' + month + '-' + day;

     this.tasks = this.af.database.list('/userProfile/' + firebase.auth().currentUser.uid + '/tasks', {
       query:{
         orderByChild : 'date',
        
       }
     })

  }

  removetask(key){

    this.tasks.remove(key);


  }
  completetask(key,memberKey){
  
    firebase.database().ref('/userProfile/' + firebase.auth().currentUser.uid + '/tasks/' + key).update({
      status : 'Complete'
    }).then((refKey)=>{

      this.af.database.object('/userProfile/' + firebase.auth().currentUser.uid + '/tasks/' + key).subscribe((task)=>{
          firebase.database().ref('/minutes/' + task.meetID + '/' + key + '/status').set('Complete');
      })

      })

  }

}
