import { Component } from '@angular/core';
import { NavController,ModalController } from 'ionic-angular';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
// import { Ionic2RatingModule } from 'ionic2-rating';
import {QuestionDetail} from '../question-detail/question-detail';
import firebase from 'firebase';
/*
  Generated class for the Favourite page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-favourite',
  templateUrl: 'favourite.html'
})
export class Favourite {
 favList : FirebaseListObservable<any>;
  constructor(public navCtrl: NavController,public af: AngularFire,public modalCtrl: ModalController ) {}

  ionViewDidEnter() {
 
     this.favList = this.af.database.list('/userProfile/' + firebase.auth().currentUser.uid + '/feeds',{
       query:{
        orderByChild : 'isFav',
        equalTo : 1
       }
      

     }
     ).map((_qss)=>{
      return _qss.map((_qs)=>{
                            
        _qs.detail = this.af.database.object('/questions/'+_qs.$key);
         _qs.askProfile = this.af.database.object('/userProfile/' + _qs.param )
        _qs.comments = this.af.database.list('/questions/'+_qs.$key+'/comments');
       
          return _qs;
      }

      )
    }
    ) as FirebaseListObservable<any>;

      
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
