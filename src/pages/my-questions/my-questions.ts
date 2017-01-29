import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavController,ModalController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable} from 'angularfire2';
import { QuestionsData } from '../../providers/questions-data';
import 'rxjs/add/operator/debounceTime';
import {QuestionDetail} from '../question-detail/question-detail';
import firebase from 'firebase';
/*
  Generated class for the MyQuestions page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-my-questions',
  templateUrl: 'my-questions.html'
})
export class MyQuestions {

 issearched :any;
  searchTerm: string = '';
  searchControl: FormControl;
    items: any;
 searching: any = false;
 myQs : any;
  constructor(public navCtrl: NavController, public dataService: QuestionsData,public af : AngularFire,public modalCtrl: ModalController  ) {
     this.searchControl = new FormControl();
  }

  ionViewDidLoad() {
   
        // this.setFilteredItems();
        this.setFilteredmyquestions();
        this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
              this.searching = false;
            // this.setFilteredItems();
            this.setFilteredmyquestions();
 
        });
  }


    onSearchInput(){
        this.searching = true;
    }

    addTolike(qKey){

      console.log(qKey);
    firebase.database().ref('/userProfile/'+ firebase.auth().currentUser.uid + '/myquestions/' + qKey + '/likeCount').once('value',function(snapshot){
      console.log("qkey: " +qKey + " snapvalue" + snapshot.val());
      if(snapshot.val()==1){
         firebase.database().ref('/userProfile/'+ firebase.auth().currentUser.uid + '/myquestions/' + qKey).update({
            likeCount : 0
          })
          firebase.database().ref('/questions/' + qKey).child('likeCount').transaction(function(likeCount){

                return likeCount - 1;

              })


      }else{
         firebase.database().ref('/userProfile/'+ firebase.auth().currentUser.uid + '/myquestions/' + qKey).update({
            likeCount : 1
          })
          firebase.database().ref('/questions/' + qKey).child('likeCount').transaction(function(likeCount){

                return likeCount + 1;

              })
      }
         

    })
    }


    setFilteredmyquestions() {
  

      this.myQs = this.af.database.list('/userProfile/' + firebase.auth().currentUser.uid + '/myquestions').map((_qss)=>{
      return _qss.map((_qs)=>{
                      
        _qs.detail = this.af.database.object('/questions/'+_qs.$key);
       
        _qs.comments = this.af.database.list('/questions/'+_qs.$key+'/comments');
       
          return _qs;
      }

      ).filter((qs) => {
            return qs.questionTitle.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
        })
    }
    ).map((myqs)=>myqs.reverse()) as FirebaseListObservable<any>;

  }

 
  openQuestion(qsKey){

  let model = this.modalCtrl.create(QuestionDetail,{
    qsKey : qsKey})

  model.present();

 }


}
