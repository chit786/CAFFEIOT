import { Component } from '@angular/core';
import { ModalController,NavController,ToastController } from 'ionic-angular';
import { PlaceOrder } from '../place-order/place-order';
import { Ionic2RatingModule } from 'ionic2-rating';
import {OrderDetail} from '../order-detail/order-detail';
import {TeamOrder} from '../team-order/team-order';
import {AngularFire, FirebaseListObservable} from 'angularfire2';

/*
 Generated class for the Orders page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
*/
@Component({
 selector: 'page-orders',
 templateUrl: 'orders.html'
})
export class Orders {
 public items = [];
rate;
OrderList : FirebaseListObservable<any>;
 today:any = new Date().toISOString();
 
 //items;

 constructor(public toastCtrl: ToastController,public af: AngularFire,public navCtrl: NavController, public modalCtrl: ModalController) {
   //this.initializeItems();
    this.rate = '3.5';
   this.initializeItems();
 }

 initializeItems() {
   /*this.items = [
     {id:1,date:"21 April",choice:"Latte",machineID:"A",Status:"Completed",rating:1},
     {id:2,date:"22 April",choice:"Mocha",machineID:"C",Status:"Pending",rating:2},
     {id:3,date:"24 April",choice:"Latte",machineID:"A",Status:"Complated",rating:5}
   ];*/
  // this.items = this.items;
 // this.dataService.getData().then((orderlist) => {

  //   if(orderlist){
   //    this.items = JSON.parse(orderlist); 
   //  }

  // });
     
 }

 getItems(ev) {
   // Reset items back to all of the items
   //this.initializeItems();

   // set val to the value of the ev target
   var val = ev.target.value;

   // if the value is an empty string don't filter the items
   if (val && val.trim() != '') {
     this.items = this.items.filter((item) => {
       return (item.id.toString()===val);
     })
   }else{
     this.initializeItems();
   }
   
 }

 //added as part of stub addition
 ionViewDidLoad(){
    var year = this.today.split("-")[0];
           var month = this.today.split("-")[1];
          var day = ( this.today.split("-")[2] ).split("T")[0];
   this.OrderList = this.af.database.list('/orders/'+firebase.auth().currentUser.uid,{
       query:{
        orderByChild : 'date',
        equalTo : month+"/"+day+"/"+year
       }
      

     });

 }
 addItem(){

   let addModal = this.modalCtrl.create(PlaceOrder);

   addModal.onDidDismiss((item) => {

         if(item){
             if(this.items.length>0){
                 item.id= this.items[this.items.length-1].id +1
             }
             
               this.saveItem(item);
         }

   });

   addModal.present();

 }

 saveItem(item){
   this.items.push(item);
  // this.dataService.save(this.items);
 }


 cancelOrder(orderKey){

  firebase.database().ref('/orders/'+firebase.auth().currentUser.uid + '/' + orderKey).set(null);

 }

 removeChoice(chip:Element,choiceKey,orderKey){
  
  var toast = this.toastCtrl;

 
  
   var choiceRef = firebase.database().ref('/orders/'+firebase.auth().currentUser.uid + '/' + orderKey + '/choice' ) 
   choiceRef.on('value',function(snapshot){
     if(snapshot.numChildren()>1){
         chip.remove();
      snapshot.forEach(function(childsnapshot){
        
        if(childsnapshot.val().choice==chip.textContent.toString().trim()){
          childsnapshot.ref.set(null);
          return true;
        }
      })
    }else{
      
        let toaster = toast.create({
      message: 'Atleast one choice should be present, else please swipe left to cancel the order.',
      duration: 3000
    });
    toaster.present();
    }
   })


 }

 openOrder(item){

   if(item.askedByname){
     this.navCtrl.push(TeamOrder,{
       order : item
     })

   }else{
 this.navCtrl.push(OrderDetail, {
     item: item,
     itemKey : item.$key
   });
   }

 }


}