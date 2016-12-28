import { Component } from '@angular/core';
import { NavController,ModalController,ViewController,NavParams } from 'ionic-angular';
import firebase from 'firebase';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import 'rxjs/add/operator/debounceTime';
import { FormControl } from '@angular/forms';

/*
  Generated class for the Contacts page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-contacts',
  templateUrl: 'contacts.html'
})
export class Contacts {
  contacts:any;
isPopup : any =false;
isNormal:any = true;
  searchTerm: string = '';
  searchControl: FormControl;
   
 searching: any = false;
  constructor(public navParams: NavParams,public navCtrl: NavController, public af: AngularFire,public modalCtrl: ModalController,public view: ViewController) {
     this.searchControl = new FormControl();

  }

  ionViewDidLoad() {
         this.isPopup = this.navParams.get('isPopup');
         console.log(this.isPopup);
         if(this.isPopup == true){
           this.isNormal = false;
         }
        else{
            this.isNormal = true;
         }
        this.setFilteredItems();
 
        this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
              this.searching = false;
            this.setFilteredItems();
 
        });
  }


    onSearchInput(){
        this.searching = true;
    }
  setFilteredItems() {
 
      this.contacts = this.af.database.list('/userProfile/' + firebase.auth().currentUser.uid + '/contacts');
 
    }
  addContact(){
    
  }
  close(){
    this.view.dismiss();
  }
  addMember(){
    console.log("inside add member");

  }

}
