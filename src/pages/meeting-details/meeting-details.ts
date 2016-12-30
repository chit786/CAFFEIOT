import { Component } from '@angular/core';
import { NavParams,ModalController,ViewController,AlertController,NavController } from 'ionic-angular';
import {PlaceOrder} from '../place-order/place-order';
import {Contacts} from '../contacts/contacts';
import {ScheduleMeeting} from '../schedule-meeting/schedule-meeting';
import {MinutesOfMeeting} from '../minutes-of-meeting/minutes-of-meeting';
import {AngularFire, FirebaseListObservable,FirebaseObjectObservable} from 'angularfire2';
/*
  Generated class for the MeetingDetails page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-meeting-details',
  templateUrl: 'meeting-details.html',
  
})
export class MeetingDetails {

  title;
  description;
  meetingDetail: FirebaseObjectObservable<any>;
  memberDetail : FirebaseListObservable<any>;
  constructor(public af: AngularFire,public navCtrl: NavController,public navParams: NavParams,
  public modalCtrl: ModalController, public view: ViewController,public alertCtrl: AlertController) {

  }

  ionViewDidLoad() {
    console.log(this.navParams.get('teamKey'));
    this.meetingDetail = this.af.database.object('/meetings/' + this.navParams.get('teamKey'));
    this.memberDetail = this.af.database.list('/meetings/' + this.navParams.get('teamKey')+ '/users');


    this.title = this.navParams.get('title');
    this.description = this.navParams.get('when');
    
   
  }
  
  orderCoffee() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Coffee?');

    alert.addInput({
      type: 'checkbox',
      label: 'Get Coffee?',
      value: 'coffee',
      checked: true
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Ask Team',
      value: 'team'
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Okay',
      handler: data => {
        console.log('Checkbox data:', data);
         for (var val in data) {
            console.log(data[val]);
                if(data[val]=='coffee'){
                let addModal = this.modalCtrl.create(PlaceOrder);

                addModal.onDidDismiss((item) => {

                if(item){
                  
                    this.showAlert();
               
                }

                });

                addModal.present();
                    
                }else if(data[val]=="team"){

                }
            }
      }
    });
    alert.present();
  }

   showAlert() {
    let alert = this.alertCtrl.create({
      title: 'New Order!',
      subTitle: 'Your Order is just placed!!',
      buttons: ['OK']
    });
    alert.present();
  }
  addMember(){
this.navCtrl.push(Contacts, {
      isPopup: true,
      teamKey:this.navParams.get('teamKey')
    });

    
  }
  openMom(teamKey){

    this.navCtrl.push(MinutesOfMeeting,{
        teamID:teamKey
    })
  }

  reschedule(teamKey){
     this.navCtrl.push(ScheduleMeeting,{
        teamID:teamKey
    })
  }




}
