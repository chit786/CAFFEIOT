import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {AngularFire, FirebaseListObservable} from 'angularfire2';

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

  feedList : FirebaseListObservable<any>;
  constructor(public navCtrl: NavController,public af: AngularFire ) {

    this.feedList = af.database.list('/userProfile/' + firebase.auth().currentUser.uid + '/feeds').map((_qss)=>{
      return _qss.map((_qs)=>{
       
        _qs.detail = this.af.database.object('/questions/'+_qs.$key);
       
        _qs.comments = this.af.database.list('/questions/'+_qs.$key+'/comments');
       
          return _qs;
      }

      )
    }
    ) as FirebaseListObservable<any>;

    
  }

  ionViewDidLoad() {
    console.log('Hello Feed Page');
  }

}
