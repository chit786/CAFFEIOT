import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';
import {AngularFire, FirebaseListObservable,FirebaseObjectObservable} from 'angularfire2';
import {PlaceOrder} from '../place-order/place-order';

/*
  Generated class for the TeamOrder page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-team-order',
  templateUrl: 'team-order.html'
})
export class TeamOrder {

  currentMember ;
  members : FirebaseListObservable<any>;
  oStatus : FirebaseObjectObservable<any>;
  orderStatus : any;
  meetingKey : any;
  constructor(public navCtrl: NavController,public af:AngularFire, public navParms : NavParams) {

    this.currentMember= firebase.auth().currentUser.uid;
    var orderstatus = this.orderStatus;
    this.members = af.database.list('/teamOrder/' +this.navParms.get('order').$key + '/members')
  

    af.database.object('/teamOrder/' +this.navParms.get('order').$key).subscribe((x)=>{
       this.meetingKey = x.meetingKey
      if(firebase.auth().currentUser.uid == x.askedByKey){
       
        this.orderStatus = x.status;
      }else{
        this.orderStatus = "";
      }
    }
    )


  }

  ionViewDidLoad() {

    
  
  }


 removeChoice(chip:Element){

   var choiceRef = firebase.database().ref('/orders/'+firebase.auth().currentUser.uid + '/' + this.navParms.get('order').$key  + '/choice' ) 
   choiceRef.on('value',function(snapshot){
     if(snapshot.numChildren()>1){
         chip.remove();
      snapshot.forEach(function(childsnapshot){
        
        if(childsnapshot.val().choice==chip.textContent.toString().trim()){
          childsnapshot.ref.set(null);
          return true;
        }
      })
    }
   })

 }

 cancelOrder(){

   // update status of the order in all team members order
  this.members.$ref.on('value',function(snapshot){

    for(var val in snapshot){
      firebase.database().ref('/orders/' + snapshot[val].$key + '/' + this.navParms.get('order').$key ).set(null)

    }
     //update status to Complete in team Order
   firebase.database().ref('/teamOrder/' +this.navParms.get('order').$key ).set(null);
    
  })

 }

 PlaceOrder(){
   //update status to Pending in team Order
   firebase.database().ref('/teamOrder/' +this.navParms.get('order').$key ).update({
     status : 'Pending'
   })
   // update status of the order in all team members order
  this.members.$ref.on('value',function(snapshot){

    for(var val in snapshot){
      firebase.database().ref('/orders/' + snapshot[val].$key + '/' + this.navParms.get('order').$key ).update({
        status : 'Pending',
      })

    }
  })


 }

 CompleteOrder(){

   //update status to Complete in team Order
   firebase.database().ref('/teamOrder/' +this.navParms.get('order').$key ).update({
     status : 'Complete'
   })
   // update status of the order in all team members order
  this.members.$ref.on('value',function(snapshot){

    for(var val in snapshot){
      firebase.database().ref('/orders/' + snapshot[val].$key + '/' + this.navParms.get('order').$key ).update({
        status : 'Complete',
      })

    }
  })


 }

 AddOrder(memberKey){

   if(this.orderStatus=="In Progress"){

    this.navCtrl.push(PlaceOrder,{
      order : this.navParms.get('order').$key,
      memberkey :  memberKey,
      meetKey : this.meetingKey

    })

   }


 }

}
