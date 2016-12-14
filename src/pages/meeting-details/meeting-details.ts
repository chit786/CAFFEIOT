import { Component } from '@angular/core';
import { NavParams,ModalController,ViewController,AlertController } from 'ionic-angular';
import {PlaceOrder} from '../place-order/place-order';

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
  constructor(public navParams: NavParams,public modalCtrl: ModalController, public view: ViewController,public alertCtrl: AlertController) {

  }

  ionViewDidLoad() {
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
    
  }




}
