import { Component } from '@angular/core';
import { NavParams,ViewController,NavController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable,FirebaseObjectObservable} from 'angularfire2';
/*
  Generated class for the QuestionDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-question-detail',
  templateUrl: 'question-detail.html'
})
export class QuestionDetail {

  question : FirebaseObjectObservable<any>;
  comments : FirebaseListObservable<any>;
  constructor(public navParams: NavParams,public navCtrl: NavController, public view: ViewController, public af:AngularFire) {}

  ionViewDidLoad() {

    this.question = this.af.database.object('/questions/' + this.navParams.get('qsKey'))
    this.comments = this.af.database.list('/questions/' + this.navParams.get('qsKey') + '/comments').map((cms)=>{
      return cms.map((cm)=>{

        cm.user= this.af.database.object('/userProfile/'+ cm.askedBy ),
        cm.detail = this.af.database.object('/questions/'+this.navParams.get('qsKey') )
        return cm;
        
      }

      )

    }) as FirebaseListObservable<any>;

    
  }

  close(){

    this.view.dismiss();
  }

}
