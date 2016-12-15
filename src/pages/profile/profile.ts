import { NavController, AlertController, Platform } from 'ionic-angular';
import { Component } from '@angular/core';
import { ProfileData } from '../../providers/profile-data';
import { AuthData } from '../../providers/auth-data';
import { LoginPage } from '../login/login';

import { Camera } from 'ionic-native';

import firebase from 'firebase';

import 'whatwg-fetch';

declare var window: any;

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  public userProfile: any;
  public birthDate: string;
  // assetCollection: any;
  URL: any;

  constructor(public nav: NavController, public profileData: ProfileData, public alertCtrl: AlertController, public authData: AuthData, public platform: Platform) {
    this.nav = nav;
    this.profileData = profileData;

    this.profileData.getUserProfile().on('value', (data) => {
      this.userProfile = data.val();
      this.birthDate = this.userProfile.birthDate;
    });

  }

  logOut() {
    this.authData.logoutUser().then(() => {
      this.nav.setRoot(LoginPage);
    });
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

  /** 
  * called after the user has logged in to load up the data
  */
  loadData() {
    // load data from firebase...
    firebase.database().ref('assets').on('value', (_snapshot: any) => {
      var result ;

      _snapshot.forEach((_childSnapshot) => {
        // get the key/id and the data for display
        var element = _childSnapshot.val();
        element.id = _childSnapshot.key;

       // result.push(element);
       console.log("inside load data");
       console.log(this.profileData.currentUser.uid );
       console.log("asset uid" + element.owner);
       if(this.profileData.currentUser.uid == element.owner ){
         console.log(element.URL);
        result = element.URL
       }
      });

      // set the component property
      //this.assetCollection = result;
      this.URL = result;
    });
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
              console.log('Failed file read: ' + e.toString());
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
    var fileName = 'sample' + '.jpg';

    return new Promise((resolve, reject) => {
      var fileRef = firebase.storage().ref('images/' + fileName);

      var uploadTask = fileRef.put(_imageBlob);

      uploadTask.on('state_changed', (_snapshot) => {
        console.log('snapshot progess ' + _snapshot);
      }, (_error) => {
        reject(_error);
      }, () => {
        // completion...
        resolve(uploadTask.snapshot);
      });
    });
  }

  saveToDatabaseAssetList(_uploadSnapshot) {
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


  doGetPicture() {
    // TODO:
    // get picture from camera
    Camera.getPicture({
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.CAMERA,
      targetHeight: 640,
      correctOrientation: true
    }).then((_imagePath) => {
      alert('got image path ' + _imagePath);
      // convert picture to blob
      return this.makeFileIntoBlob(_imagePath);
    }).then((_imageBlob) => {
      alert('got image blob ' + _imageBlob);

      // upload the blob
      return this.uploadToFirebase(_imageBlob);
    }).then((_uploadSnapshot: any) => {
      alert('file uploaded successfully  ' + _uploadSnapshot.downloadURL);

      // store reference to storage in database
      return this.saveToDatabaseAssetList(_uploadSnapshot);

    }).then((_uploadSnapshot: any) => {
      alert('file saved to asset catalog successfully  ');
      this.loadData();
    }, (_error) => {
      console.log("here");
      alert('Error ' + _error.message);
    });



  }

}