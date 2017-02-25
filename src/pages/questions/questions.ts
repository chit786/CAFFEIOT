import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {AskQuestion} from '../ask-question/ask-question';
import {Favourite} from '../favourite/favourite';
import {Feed} from '../feed/feed';
import {MyQuestions} from '../my-questions/my-questions';
import {AngularFire,FirebaseObjectObservable} from 'angularfire2';
import firebase from 'firebase';
/*
  Generated class for the Questions page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-questions',
  templateUrl: 'questions.html'
})
export class Questions {

  feedUnread : FirebaseObjectObservable<any>;
    tab1Root: any = Feed;
  tab2Root: any = Favourite;
  tab3Root: any = AskQuestion;
  tab4Root: any = MyQuestions;
  isCompSet : any;
  constructor(public navCtrl: NavController,public af: AngularFire ) {
      

  }

  ionViewDidLoad() {

    this.feedUnread = this.af.database.object('/userProfile/' + firebase.auth().currentUser.uid );
    

    firebase.database().ref('/userProfile/'+firebase.auth().currentUser.uid + '/feeds').on('value',function(snapshot){
     
      snapshot.forEach(function(child){
        
        if(child.val().isread==false){
            //get value from the unreadFeed
            firebase.database().ref('/userProfile/' + firebase.auth().currentUser.uid + '/unreadFeed').transaction(function (current_value) {
              return (current_value || 0) + 1;
            })
           
          }
          return false;
      })


    })



   this.af.database.object('/userProfile/'+firebase.auth().currentUser.uid ).subscribe(user=>{
      
      if(user.company){
        this.isCompSet = true;
      }else{
        this.isCompSet = false;
      }

    })



    
  }
  //  updateunreadFeed(){

  //  }

}
