import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthData } from '../../providers/auth-data';
import { HomePage } from '../home/home';
import { Preferences } from '../preferences/preferences';


/*
  Generated class for the Signup page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
 public signupForm;
  emailChanged: boolean = false;
  passwordChanged: boolean = false;
  submitAttempt: boolean = false;
  loading: any;
  constructor(public nav: NavController, public authData: AuthData, public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
      this.signupForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    })

    }

  ionViewDidLoad() {
   
  }
 elementChanged(input){
    let field = input.inputControl.name;
    this[field + "Changed"] = true;
  }
  signupUser(){
  this.submitAttempt = true;

  if (!this.signupForm.valid){
   
  } else {
    this.authData.signupUser(this.signupForm.value.email, this.signupForm.value.password).then(() => {
      //this.nav.setRoot(HomePage);
      this.nav.setRoot(Preferences);
    }, (error) => {
      this.loading.dismiss();
      let alert = this.alertCtrl.create({
        message: error.message,
        buttons: [
          {
            text: "Ok",
            role: 'cancel'
          }
        ]
      });
      alert.present();
    });

    this.loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
    });
    this.loading.present();
  }
}


}
