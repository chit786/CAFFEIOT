import { Component } from '@angular/core';
import { NavParams,ModalController,ViewController,AlertController,NavController } from 'ionic-angular';
import {PlaceOrder} from '../place-order/place-order';
import {Contacts} from '../contacts/contacts';
import { TeamsData } from '../../providers/teams-data';
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
    today:any = new Date().toISOString();
       year:any;
  month:any;
    memberList = [];
  day:any;
   orderID: any;
    uName;
  meetingDetail: FirebaseObjectObservable<any>;
  memberDetail : FirebaseListObservable<any>;
   tempTeam : FirebaseListObservable<any>;
  constructor(public af: AngularFire,public navCtrl: NavController,public navParams: NavParams,
  public modalCtrl: ModalController, public view: ViewController,public alertCtrl: AlertController,public teamData: TeamsData) {


      this.year = this.today.split("-")[0];
           this.month = this.today.split("-")[1];
           this.day = ( this.today.split("-")[2] ).split("T")[0];
           this.orderID = ( this.today.split(":")[0] ).split("T")[1] + this.today.split(":")[1] + (this.today.split(":")[2]).split(".")[0]  ;


            this.tempTeam = af.database.list('/meetings/'+ this.navParams.get('teamKey') + '/users',{ preserveSnapshot: true } )

     this.tempTeam.subscribe((snapshots)=>{
        snapshots.forEach(snapshot=>{

          if(snapshot.key==firebase.auth().currentUser.uid){
            this.uName = snapshot.val().firstName + ' ' + snapshot.val().lastName   
          }



          this.memberList[snapshot.key] = snapshot.val();
        })

     })

  }

  ionViewDidLoad() {
   
    this.meetingDetail = this.af.database.object('/meetings/' + this.navParams.get('teamKey'));
    this.memberDetail = this.af.database.list('/meetings/' + this.navParams.get('teamKey')+ '/users');


    this.title = this.navParams.get('title');
    this.description = this.navParams.get('when');
    
   
  }
  
  orderCoffee() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Coffee?');

    alert.addInput({
      type: 'radio',
      label: 'Get Coffee?',
      value: 'coffee',
      checked: true
    });

    alert.addInput({
      type: 'radio',
      label: 'Ask Team',
      value: 'team'
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Okay',
      handler: data => {
       
        // for (var val in data) {
          
                if(data=='coffee'){
                let addModal = this.modalCtrl.create(PlaceOrder);

                addModal.onDidDismiss((item) => {

                if(item){
                  
                    this.showAlert();
               
                }

                });

                addModal.present();
                    
                }else if(data=="team"){

                 
                
                  //this.teamData.askCoffee(this.memberDetail);
                  var teamDataService = this.teamData;
                  
                  let teamOrder = {
                    id : this.orderID,
                    teamName : this.title,
                    members : this.memberList,
                    askedByKey : firebase.auth().currentUser.uid,
                    status : "In Progress",
                    meetingKey:this.navParams.get('teamKey')

                  }

                  let orderDetail = {

                    id:this.orderID,
                  date : this.month+"/"+this.day+"/"+this.year,
                  machineID : "A",
                  status : "In Progress",
                  rating : 0,
                  askedByKey : firebase.auth().currentUser.uid,
                  askedByname : this.uName
                  }


                  firebase.database().ref('/teamOrder').push(teamOrder).then((keyNode)=>{
                    
                    
                      for(var val in this.memberList){
                      
                        firebase.database().ref('/orders/' + val.toString() + '/' + keyNode.key).update(orderDetail).then(()=>{
                          

                          teamDataService.askToMember(val.toString(),this.uName,"Coffee?");
                        }
                        )

                      }

                  })
                  

                }
           // }
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
      isPopup:true,
      isMeet: true,
      teamKey:this.navParams.get('teamKey')
    });

    
  }
  openMom(teamKey){
   
    this.navCtrl.push(MinutesOfMeeting,{
        teamID:this.navParams.get('teamKey')
    })
  }

  reschedule(meetKey){
   
     this.navCtrl.push(ScheduleMeeting,{
        teamName: this.title,
        isPopup: true,
        meetkey:this.navParams.get('teamKey')
    })
  }




}
