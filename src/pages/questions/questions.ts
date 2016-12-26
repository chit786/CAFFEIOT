import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {AskQuestion} from '../ask-question/ask-question';
import {Favourite} from '../favourite/favourite';
import {Feed} from '../feed/feed';
import {MyQuestions} from '../my-questions/my-questions';
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

    tab1Root: any = Feed;
  tab2Root: any = Favourite;
  tab3Root: any = AskQuestion;
  tab4Root: any = MyQuestions;
  constructor(public navCtrl: NavController) {



  }

  ionViewDidLoad() {
    console.log('Hello Questions Page');
  }
    addItem(){
    
  }

}
