import { Component } from '@angular/core';
import { NavController,AlertController } from 'ionic-angular';

/*
  Generated class for the MyTeams page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-my-teams',
  templateUrl: 'my-teams.html'
})
export class MyTeams {
  items = [];
  
  constructor(public navCtrl: NavController,public alertCtrl: AlertController) {
    this.items = ['team A','team B','team C'];
  }

  ionViewDidLoad() {
    console.log('Hello MyTeams Page');
  }
  addTeam(){
     let prompt = this.alertCtrl.create({
      title: 'New Team',
      message: "Enter Team Name",
      inputs: [
        {
          name: 'title',
          placeholder: 'Title'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            var valExist = true;
            for(var val in this.items){
                if(this.items[val]==data.title){
                  valExist = false;
                  this.showAlert();
                }
            }
            if(valExist){
              this.items.push(data.title);
            }
            
          }
        }
      ]
    });
    prompt.present();
    
  }
  itemSelected(item){

  }
  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Name Exists!',
      subTitle: 'Please choose different name!!',
      buttons: ['OK']
    });
    alert.present();
  }


}
