import { Component } from '@angular/core';
import { NavController,ModalController } from 'ionic-angular';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
// import { Ionic2RatingModule } from 'ionic2-rating';
import {QuestionDetail} from '../question-detail/question-detail';
import firebase from 'firebase';

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
  rate;
  feedList : FirebaseListObservable<any>;
  constructor(public navCtrl: NavController,public af: AngularFire,public modalCtrl: ModalController ) {

   
    
  }

  ionViewDidEnter(){
    //again set all to 
     this.feedList = this.af.database.list('/userProfile/' + firebase.auth().currentUser.uid + '/feeds').map((_qss)=>{
      return _qss.map((_qs)=>{       
        _qs.detail = this.af.database.object('/questions/'+_qs.$key);
        _qs.askProfile = this.af.database.object('/userProfile/' + _qs.param )
        _qs.comments = this.af.database.list('/questions/'+_qs.$key+'/comments');
       
          return _qs;
      }

      )
    }
    ).map((feeds)=>feeds.reverse()) as FirebaseListObservable<any> ;


   var feeds =  firebase.database().ref('/userProfile/' + firebase.auth().currentUser.uid + '/feeds')
   feeds.once('value',function(snapshot){
         var updates = {};
         snapshot.forEach(function(child){
           updates[ child.key + '/isread'] = true;
           return false;
         });
         feeds.update(updates);


    })

     firebase.database().ref('/userProfile/' + firebase.auth().currentUser.uid ).update({
      unreadFeed : null
    })
  }

  addToFavourite(feed){

    firebase.database().ref('/userProfile/'+ firebase.auth().currentUser.uid + '/feeds/' + feed + '/isFav').once('value',function(snapshot){

      if(snapshot.val()==1){
         firebase.database().ref('/userProfile/'+ firebase.auth().currentUser.uid + '/feeds/' + feed).update({
            isFav : 0
          })

      }else{
         firebase.database().ref('/userProfile/'+ firebase.auth().currentUser.uid + '/feeds/' + feed).update({
            isFav : 1
          })
      }
         

    })


     
  }

   addTolike(qKey){

   
    firebase.database().ref('/userProfile/'+ firebase.auth().currentUser.uid + '/feeds/' + qKey + '/likeCount').once('value',function(snapshot){
      
      if(snapshot.val()==1){
         firebase.database().ref('/userProfile/'+ firebase.auth().currentUser.uid + '/feeds/' + qKey).update({
            likeCount : 0
          })
          firebase.database().ref('/questions/' + qKey).child('likeCount').transaction(function(likeCount){

                return likeCount - 1;

              })


      }else{
         firebase.database().ref('/userProfile/'+ firebase.auth().currentUser.uid + '/feeds/' + qKey).update({
            likeCount : 1
          })
          firebase.database().ref('/questions/' + qKey).child('likeCount').transaction(function(likeCount){

                return likeCount + 1;

              })
      }
         

    })
    }



  openQuestion(qsKey){

  let model = this.modalCtrl.create(QuestionDetail,{
    qsKey : qsKey})

  model.present();

 }
}
