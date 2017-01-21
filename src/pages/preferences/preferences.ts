import { Component } from '@angular/core';
import { NavController,ViewController,NavParams,ToastController } from 'ionic-angular';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import { ProfileData } from '../../providers/profile-data';
/*
  Generated class for the Preferences page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-preferences',
  templateUrl: 'preferences.html'
})
export class Preferences {
  skills : FirebaseListObservable<any>;
  company ;
  skillPref = [];
  options : FirebaseListObservable<any>;
  constructor(public toastCtrl: ToastController,public navParams: NavParams,public navCtrl: NavController, public view: ViewController, public af:AngularFire, public profileData: ProfileData) {
     this.options = this.af.database.list('/organisations');

   
  }
  
  onChange(bankName){
   var user = firebase.database().ref('/userProfile/'+this.profileData.currentUser.uid )
   user.update({
     company:bankName,
   }).then(()=>this.presentToast('Company Name updated!'));
    this.setSkills(bankName);
  }
  select(chip : Element,skillName){
     
     if(chip.getAttribute("ng-reflect-color")=="light"){
       chip.setAttribute("ng-reflect-color","primary");
       chip.setAttribute("class","chip-md chip-md-primary");
       var currList = firebase.database().ref('/userProfile/'+this.profileData.currentUser.uid + '/skills')
       currList.once('value',function(snapshot){
         snapshot.forEach(function(child){
            if(child.val().name==skillName){
              child.ref.child('name').ref.remove();
              return true;
            }
            return false;
         })
       });
      currList.push({
        name : skillName,
      }).then(key=>this.presentToast('skillset added!'));
     
     }else{
        chip.setAttribute("ng-reflect-color","light");
     chip.setAttribute("class","chip-md chip-md-light");
      var currList = firebase.database().ref('/userProfile/'+this.profileData.currentUser.uid + '/skills')
       currList.once('value',function(snapshot){
         snapshot.forEach(function(child){
            if(child.val().name==skillName){
              child.ref.child('name').ref.remove();
              
              return true;
            }
            return false;
         })
       }).then(()=>this.presentToast('skillset removed!'));
     }
     

  
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }
  setSkills(bankName){
    this.skills = this.af.database.list('/availabletags/'+bankName+'/tags');

  }
  ionViewDidLoad() {
   
  }
  close(){
    this.view.dismiss();
   

  }

}
