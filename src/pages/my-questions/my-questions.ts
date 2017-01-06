import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavController,ModalController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable,FirebaseObjectObservable} from 'angularfire2';
import { QuestionsData } from '../../providers/questions-data';
import 'rxjs/add/operator/debounceTime';
import {QuestionDetail} from '../question-detail/question-detail';
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
  // setFilteredItems() {
 
  //       this.items = this.dataService.filterItems(this.searchTerm);
 
  //   }

    setFilteredmyquestions() {
  
      //  this.myQs = this.af.database.list('/userProfile/' + firebase.auth().currentUser.uid + '/myquestions').map((qss)=>{
      //   const filtered = qss.filter((qs) => {
      //       return qs.questionTitle.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
      //   })
      //   return filtered;
      // },
      // );

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
    ) as FirebaseListObservable<any>;

  }

 
  openQuestion(qsKey){

  let model = this.modalCtrl.create(QuestionDetail,{
    qsKey : qsKey})

  model.present();

 }


}
