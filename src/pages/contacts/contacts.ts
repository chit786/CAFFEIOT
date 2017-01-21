import { Component } from '@angular/core';
import { NavController,ModalController,ViewController,NavParams,AlertController,ToastController } from 'ionic-angular';
import firebase from 'firebase';
import { TeamsData } from '../../providers/teams-data';
import {AngularFire} from 'angularfire2';
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
  selectedMembers = [];
  teamKey;
  teamName;
  isMeet : any =false;
  meetKey;

   
 searching: any = false;
  constructor(public toastCtrl: ToastController,public teamData:TeamsData
  ,public alertCtrl: AlertController,public navParams: NavParams,public navCtrl: NavController
  , public af: AngularFire,public modalCtrl: ModalController,public view: ViewController) {
    
     this.searchControl = new FormControl();

  }

  ionViewDidLoad() {
         this.isPopup = this.navParams.get('isPopup');
         this.isMeet = this.navParams.get('isMeet');
   
         if(this.isPopup == true && this.isMeet== false){
           this.teamKey= this.navParams.get('teamKey').$key;
           this.teamName = this.navParams.get('teamKey').teamName;
           this.isNormal = false;
         }else if(this.isMeet){
           this.teamKey = this.navParams.get('teamKey');
           this.isNormal = false;

         }
        else{
            this.isNormal = true;
         }
        this.setFilteredItems(this.searchTerm);
 
        this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
              this.searching = false;
            this.setFilteredItems(this.searchTerm);
 
        });
  }


    onSearchInput(){
        this.searching = true;
    }
  setFilteredItems(searchTerm) {
 
      this.contacts = this.af.database.list('/userProfile/' + firebase.auth().currentUser.uid + '/contacts').map(items=>{
        const filtered = items.filter((item) => {
           
            return item.firstName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
        }
        )
        return filtered;
      });
      
 
    }
  addContact(){
    var toastc = this.toastCtrl;
    let prompt = this.alertCtrl.create({
      title: 'New Member',
      message: "Enter Member Email",
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
           
          }
        },
        {
          text: 'Send',
          handler: data => {
           

           
            var profileindex = firebase.database().ref('/profile-index/' + data.title.replace("@","CAFFEIOTAT").replace(".","CAFFEIOTDOT") + '/uniqueID')

            profileindex.once('value',function(snapshot){

              if(snapshot.val()==firebase.auth().currentUser.uid){

                  
                          let toast = toastc.create({
                          message: 'Can not add yourself in the contacts!',
                          duration: 3000
                        });
                        toast.present();
                  
              }else{

             
            
              var profile = firebase.database().ref('/userProfile/' + snapshot.val())
              profile.once('value',function(childsnapshot){

                  if(!childsnapshot.val()){
                          let toast = toastc.create({
                          message: 'No User with this Email ID present!',
                          duration: 3000
                        });
                        toast.present();
                  

                  }else{
                        //var details = true;

                        var firstName = childsnapshot.val().firstName ;
                        var lastName = childsnapshot.val().lastName; 
                       
                      
                        var profilepic = childsnapshot.val().profilepic;
                        var regID = childsnapshot.val().regID;
                        var postData = {
                          
                          firstName : firstName,
                          lastName : lastName,
                          profilepic : profilepic, 
                          regID : regID 
                        }
                        var updates= {}
            
                        updates['/userProfile/'+ firebase.auth().currentUser.uid + '/contacts/'+childsnapshot.ref.key] = postData;
                        firebase.database().ref().update(updates).then(()=>{
                          
                          let toast = toastc.create({
                          message: 'Contact added',
                          duration: 3000
                        });
                        toast.present();
                        });

                        // firebase.database().ref('/userProfile/'+ firebase.auth().currentUser.uid + '/contacts').push(postData).then(()=>{
                          
                        //   let toast = toastc.create({
                        //   message: 'Contact added',
                        //   duration: 3000
                        // });
                        // toast.present();
                        // });
              }
                             
              });

              }

            });
            
          }
        }
      ]
    });
    prompt.present();

  
  }
  close(){
    this.view.dismiss();
  }

  selectMember(memberKey){
     const foundAt = this.selectedMembers.indexOf(memberKey);
     if (foundAt >= 0) {
        this.selectedMembers.splice(foundAt, 1);
     } else {
        this.selectedMembers.push(memberKey);
    }

  }



  addMember(){
    var ismeet = this.isMeet;
    var key = this.teamKey;
    var teamname = this.teamName;
    for(var val in this.selectedMembers){
        var tempkey = this.selectedMembers[val].toString();
        var profile = firebase.database().ref('/userProfile/'+firebase.auth().currentUser.uid + '/contacts/' + tempkey)
                      profile.once('value',function(childsnapshot){
                                var firstName = childsnapshot.val().firstName ;

                                var lastName = childsnapshot.val().lastName; 
                                var profilepic = childsnapshot.val().profilepic;
                                var regID = childsnapshot.val().regID;
                                var postData = {
                                  
                                  firstName : firstName,
                                  lastName : lastName,
                                  profilepic : profilepic, 
                                  regID : regID 
                                }
                                var postTeamData = {
                                  teamName : teamname,
                                  isOwner : false
                                }
                                var updates= {}
                                if(ismeet){

                                  firebase.database().ref('/meetings/' + key).once('value',function(snapshot){

                                    updates['/meetings/' + key + '/users/' + tempkey] = postData;
                                    updates['/userProfile/' + tempkey + '/meetings/member/' + key] = snapshot.val();
                                    updates['/userProfile/' + firebase.auth().currentUser.uid + '/meetings/host/' + key + '/users/' + tempkey] = postData;
                                      firebase.database().ref().update(updates).then(()=>{

                                        firebase.database().ref('/userProfile/' + tempkey + '/meetings/member/' + key + '/users/' + tempkey).update(postData);
                                      });

                                  })

                                     
                                }else{
                                     updates['/teams/' + key + '/members/' + tempkey] = postData;
                                updates['/userProfile/' + tempkey + '/teams/' + key] = postTeamData;
                                  firebase.database().ref().update(updates);
                                }
                               
                              
                                        // ref to member regID
                            
                                    
                                
                      });
                  
                       this.teamData.sendNotifyContact(tempkey,key,"You are added in team - " + teamname);

    }

     this.view.dismiss();
    

  }

  removeMember(memberID){

   this.contacts.remove(memberID).then(()=>{
                          
                          let toast = this.toastCtrl.create({
                          message: 'Contact removed',
                          duration: 3000
                        });
                        toast.present();
                        });;

  }

  callMe(number){

     document.location.href = 'tel:'+number;

  }

  smsMe(number){
     document.location.href = 'sms:'+number;

  }

  mailme(mailID){
    document.location.href = 'mailto:'+mailID;
  }

}
