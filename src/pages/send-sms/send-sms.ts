import { Component } from '@angular/core';
import { NavController, NavParams,ToastController } from 'ionic-angular';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import { SMS } from 'ionic-native';

/*
  Generated class for the SendSMS page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-send-sms',
  templateUrl: 'send-sms.html'
})
export class SendSMSPage {

   meetKey : any;
   numbers = []; 
   message;
   userList : FirebaseListObservable<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams,public af:AngularFire,public toastCtrl: ToastController) {

    this.meetKey = this.navParams.get('meetKey');


  }

  ionViewDidLoad() {

    this.af.database.list('/meetings/'+ this.meetKey + '/users').map((users)=>{

        return users.map((user)=>{

          this.af.database.object('/userProfile/'+user.$key).map((usrref)=>{

            this.numbers.push(usrref.number);
          
          })
         
        })
      }) 
  }

  sendSMS(){
   var myMesg = this.message; 
  let toast = this.toastCtrl.create({
                          message: 'message sent!',
                          duration: 3000
                        });
                        toast.present();
   this.message = "";
    
    var options={
          replaceLineBreaks: false, // true to replace \n by a new line, false by default
          android: {
               intent: ''  // Opens Default sms app
              //intent: '' // Sends sms without opening default sms app
            }
    }
    for(var val in this.numbers){

       SMS.send(this.numbers[val],myMesg,options)
      .then(()=>{
     
      },()=>{
     
      });

    }
   
  }

}
