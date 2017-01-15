import { NavController, AlertController, Platform } from 'ionic-angular';
import { Component } from '@angular/core';
import { ProfileData } from '../../providers/profile-data';
import { AuthData } from '../../providers/auth-data';
import { LoginPage } from '../login/login';
import { Preferences } from '../preferences/preferences';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import { Camera } from 'ionic-native';


import firebase from 'firebase';

import 'whatwg-fetch';

declare var window: any;
declare var plugins: any;

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  public userProfile: any;
  public birthDate: string;
  company;
  // assetCollection: any;
  URL: any;
  options : FirebaseListObservable<any>;
  skills : FirebaseListObservable<any>;

   public optionsval: any = {
        destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.CAMERA,
      targetHeight: 620,
      targetWidth : 620,
      correctOrientation: true
  }

  constructor(public nav: NavController,public af: AngularFire, public profileData: ProfileData, public alertCtrl: AlertController, 
  public authData: AuthData, public platform: Platform) {
    this.nav = nav;
    this.profileData = profileData;
  
    this.loadData();

  }

  logOut() {
    this.authData.logoutUser().then(() => {
      this.nav.setRoot(LoginPage);
    });
  }
  openPreferences(){
    this.nav.push(Preferences);

  }
  updateName() {
    let alert = this.alertCtrl.create({
      message: "Your first name & last name",
      inputs: [
        {
          name: 'firstName',
          placeholder: 'Your first name',
          value: this.userProfile.firstName
        },
        {
          name: 'lastName',
          placeholder: 'Your last name',
          value: this.userProfile.lastName
        },
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: data => {
            this.profileData.updateName(data.firstName, data.lastName);
          }
        }
      ]
    });
    alert.present();
  }

  updateNumber(){
let alert = this.alertCtrl.create({
      inputs: [
        {
          name: 'newNumber',
          placeholder: 'Your new number',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: data => {
            this.profileData.updateNumber(data.newNumber);
          }
        }
      ]
    });
    alert.present();

  }

  

updateWeight(){
let alert = this.alertCtrl.create({
      inputs: [
        {
          name: 'newWeight',
          placeholder: 'Your weight',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: data => {
            this.profileData.updateWeight(data.newWeight);
          }
        }
      ]
    });
    alert.present();

  }
  updateDOB(birthDate) {
    this.profileData.updateDOB(birthDate);
  }

  updateEmail() {
    let alert = this.alertCtrl.create({
      inputs: [
        {
          name: 'newEmail',
          placeholder: 'Your new email',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: data => {
            this.profileData.updateEmail(data.newEmail);
          }
        }
      ]
    });
    alert.present();
  }

  updatePassword() {
    let alert = this.alertCtrl.create({
      inputs: [
        {
          name: 'newPassword',
          placeholder: 'Your new password',
          type: 'password'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: data => {
            this.profileData.updatePassword(data.newPassword);
          }
        }
      ]
    });
    alert.present();
  }

  onChange(SelectedValue){
    
    this.setCompany(SelectedValue);
}

  setCompany(SelectedValue){
     this.profileData.updateCompany(SelectedValue);

  }

  /** 
  * called after the user has logged in to load up the data
  */
  loadData_old() {
    // load data from firebase...
   // firebase.database().ref('assets').on('value', (_snapshot: any) => {
         firebase.database().ref('userProfile').on('value', (_snapshot: any) => {
      var result ;

      _snapshot.forEach((_childSnapshot) => {
        // get the key/id and the data for display
        var element = _childSnapshot.val();
        element.id = _childSnapshot.key;

       // result.push(element);
      
       if(this.profileData.currentUser.uid == element.owner ){
         
        result = element.URL
       }
      });

      // set the component property
      //this.assetCollection = result;
      this.URL = result;
    });
  }

  loadData(){
       this.profileData.getUserProfile().on('value', (data) => {
      this.userProfile = data.val();
      this.birthDate = this.userProfile.birthDate;
      this.company = this.userProfile.company;
      this.skills = this.af.database.list('/userProfile/'+this.profileData.currentUser.uid+'/skills');
      
     this.options = this.af.database.list('/organisations');
     if(!this.userProfile.profilepic){
        this.URL = "assets/img/default_profile.jpg";
     }
    else{
       this.URL = this.userProfile.profilepic;
    }

     
    });
  }

  delete(chip: Element,skillName : string){
  

    chip.remove();
    var skill= firebase.database().ref('/userProfile/'+this.profileData.currentUser.uid+'/skills');
    skill.on('value',function(snapshot){
      snapshot.forEach(function(childSnapshot){
          if(childSnapshot.val().name==skillName){
            childSnapshot.ref.child('name').ref.remove();
            return true;
          }
          return false;
      });

    })
    //this.skill = this.af.database.list('/userProfile/'+this.profileData.currentUser.uid+'/skills');
    
    //this.skill.remove();
  }

  makeFileIntoBlob(_imagePath) {

    // INSTALL PLUGIN - cordova plugin add cordova-plugin-file
    if (this.platform.is('android')) {
      return new Promise((resolve, reject) => {
        window.resolveLocalFileSystemURL(_imagePath, (fileEntry) => {

          fileEntry.file((resFile) => {

            var reader = new FileReader();
            reader.onloadend = (evt: any) => {
              var imgBlob: any = new Blob([evt.target.result], { type: 'image/jpeg' });
              imgBlob.name = 'sample.jpg';
              resolve(imgBlob);
            };

            reader.onerror = (e) => {
             
              reject(e);
            };

            reader.readAsArrayBuffer(resFile);
          });
        });
      });
    } else {
      return window.fetch(_imagePath).then((_response) => {
        return _response.blob();
      }).then((_blob) => {
        return _blob;
      }).catch((_error) => {
        alert(JSON.stringify(_error.message));
      });
    }
  }

  uploadToFirebase(_imageBlob) {
    //var fileName = 'sample-' + new Date().getTime() + '.jpg';
    var fileName = 'profile' + this.profileData.currentUser.uid + '.jpg';

    return new Promise((resolve, reject) => {
      var fileRef = firebase.storage().ref('images/' + fileName);

      var uploadTask = fileRef.put(_imageBlob);

      uploadTask.on('state_changed', (_snapshot) => {
     
      }, (_error) => {
        reject(_error);
      }, () => {
        // completion...
        resolve(uploadTask.snapshot);
      });
    });
  }

  saveToDatabaseAssetList_old(_uploadSnapshot) {
    var ref = firebase.database().ref('assets');

    return new Promise((resolve, reject) => {

      // we will save meta data of image in database
      var dataToSave = {
        'URL': _uploadSnapshot.downloadURL, // url to access file
        'name': _uploadSnapshot.metadata.name, // name of the file
        'owner': firebase.auth().currentUser.uid,
        'email': firebase.auth().currentUser.email,
        'lastUpdated': new Date().getTime(),
      };

      ref.push(dataToSave, (_response) => {
        resolve(_response);
      }).catch((_error) => {
        reject(_error);
      });
    });

  }

   saveToDatabaseAssetList(_uploadSnapshot) {
    this.profileData.updateProfilepic(_uploadSnapshot.downloadURL);

  }

  // Return a promise to catch errors while loading image
  getMedia(_imagePath){
    return new Promise((resolve, reject) => {
      // Get Image from ionic-native's built in camera plugin
      // Camera.getPicture(this.optionsval).then((fileUri) => {
        // Crop Image, on android this returns something like, '/storage/emulated/0/Android/...'
        // Only giving an android example as ionic-native camera has built in cropping ability
        if (this.platform.is('android')) {
        
          _imagePath = 'file://' + _imagePath;
        }
          const options = { quality: 100 };
          /* Using cordova-plugin-crop starts here */
          plugins.crop.promise(_imagePath, options).then( (path) => {
            // path looks like 'file:///storage/emulated/0/Android/data/com.foo.bar/cache/1477008080626-cropped.jpg?1477008106566'
            console.log('Cropped Image Path!: ' + path);
            // Do whatever you want with new path such as read in a file
            // Here we resolve the path to finish, but normally you would now want to read in the file
            resolve(path);
          }).catch( (error) => {
            reject(error);
          });
        
      // }).catch((error) => {
      //   reject(error);
      // })
    });
  }
  doGetPicture() {
    // TODO:
    // get picture from camera
    Camera.getPicture({
      
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.CAMERA,
      targetHeight: 620,
      targetWidth : 620,
      correctOrientation: true
    }).then((_imagePath) => {
     // alert('got image path ' + _imagePath);
      // convert picture to blob
      return this.getMedia(_imagePath);

      
    }).then((_imgPath)=>{
       return this.makeFileIntoBlob(_imgPath);
    }).then((_imageBlob) => {
     // alert('got image blob ' + _imageBlob);

      // upload the blob
      return this.uploadToFirebase(_imageBlob);
    }).then((_uploadSnapshot: any) => {
     // alert('file uploaded successfully  ' + _uploadSnapshot.downloadURL);

      // store reference to storage in database
      return this.saveToDatabaseAssetList(_uploadSnapshot);

    }).then((_uploadSnapshot: any) => {
     // alert('file saved to asset catalog successfully  ');
      this.loadData();
    }, (_error) => {
    
     // alert('Error ' + _error.message);
    });



  }

}