import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';
import {AngularFire, FirebaseListObservable,FirebaseObjectObservable} from 'angularfire2';
import {PlaceOrder} from '../place-order/place-order';
import firebase from 'firebase';

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
  dailyConsRef : FirebaseListObservable<any>;
  oStatus : FirebaseObjectObservable<any>;
  removeChoiceRef : FirebaseListObservable<any>;
  orderStatus : any;
  meetingKey : any;
  today:any = new Date().toISOString();
  year:any;
  month:any;
  day:any;
  constructor(public navCtrl: NavController,public af:AngularFire, public navParms : NavParams) {

     this.year = this.today.split("-")[0];
           this.month = this.today.split("-")[1];
           this.day = ( this.today.split("-")[2] ).split("T")[0];
           var orderID = ( this.today.split(":")[0] ).split("T")[1] + this.today.split(":")[1] + (this.today.split(":")[2]).split(".")[0]  ;

           this.today = this.day + "-" + this.month + "-" + this.year

    this.currentMember= firebase.auth().currentUser.uid;
   // var orderstatus = this.orderStatus;
    this.members = this.af.database.list('/teamOrder/' +this.navParms.get('order').$key + '/members').map((member)=>{

        return member.map((val)=>{
             val.choices = this.af.database.list('/teamOrder/' +this.navParms.get('order').$key + '/members/' + val.$key + "/choice")
            return val;
        })
       
    }) as FirebaseListObservable<any>;
  

    af.database.object('/teamOrder/' +this.navParms.get('order').$key).subscribe((x)=>{
       this.meetingKey = x.meetingKey
      if(firebase.auth().currentUser.uid == x.askedByKey){
       
        this.orderStatus = x.status;
      }else{
        this.orderStatus = "";
      }
    }
    )
    this.removeChoiceRef = af.database.list('/teamOrder/' +this.navParms.get('order').$key + '/members/' + firebase.auth().currentUser.uid + "/choice");
    this.dailyConsRef = af.database.list('/dailyConsumption/' + firebase.auth().currentUser.uid  + '/' + this.today+ '/' + this.navParms.get('order').$key + "/choice");

  }

  ionViewDidLoad() {

    
  
  }


 removeChoice(chip:Element,drinkKey){

   var choiceRef = firebase.database().ref('/orders/'+firebase.auth().currentUser.uid + '/' + this.navParms.get('order').$key  + '/choice' ) 
   choiceRef.once('value',function(snapshot){
     if(snapshot.numChildren()>1){
        
      snapshot.forEach(function(childsnapshot){
        
        if(childsnapshot.val().choice==chip.textContent.toString().trim()){
          childsnapshot.ref.set(null).then(()=>{
             chip.remove();
          });
          return true;
        }
      })
    }
   })

   
   this.removeChoiceRef.remove(drinkKey);
   this.dailyConsRef.remove(drinkKey);


 }

 cancelOrder(){
   var orderKey = this.navParms.get('order').$key;
   // update status of the order in all team members order
  this.members.$ref.once('value',function(snapshot){

    for(var val in snapshot){
      firebase.database().ref('/orders/' + snapshot[val].$key + '/' + orderKey ).set(null)

    }
     //update status to Complete in team Order
   firebase.database().ref('/teamOrder/' +orderKey ).set(null);
    
  })

 }

 PlaceOrder(){
   var orderKey = this.navParms.get('order').$key;
   //update status to Pending in team Order
   firebase.database().ref('/teamOrder/' +orderKey ).update({
     status : 'Pending'
   })
   // update status of the order in all team members order


  this.af.database.list('/teamOrder/' +this.navParms.get('order').$key + '/members', { preserveSnapshot: true})
   .subscribe((snapshots)=>{

     snapshots.forEach(snapshot=>{
            firebase.database().ref('/orders/' + snapshot.key + '/' + orderKey ).update({
            status : 'Pending',
          })
     })
   }) 


 }

 CompleteOrder(){
   var orderKey = this.navParms.get('order').$key;
   //update status to Pending in team Order
   firebase.database().ref('/teamOrder/' +orderKey ).update({
     status : 'Complete'
   })
   // update status of the order in all team members order


  this.af.database.list('/teamOrder/' +this.navParms.get('order').$key + '/members', { preserveSnapshot: true})
   .subscribe((snapshots)=>{

     snapshots.forEach(snapshot=>{

          firebase.database().ref('/orders/' + snapshot.key + '/' + orderKey ).update({
            status : 'Complete',
          });
          

           this.af.database.object('/orders/' + snapshot.key + '/' + orderKey + '/choice')
           .subscribe((choices)=>{
             //completing all the choices of users
            // choices.forEach(choice=>{
            for(var val in choices){
                if(parseInt(val)){
                    firebase.database().ref('/dailyConsumption/' + snapshot.key +'/' +this.today + '/' + orderKey + '/choice/' + val.valueOf() ).update({
                  status : 'Complete'
                });
                }
               
            }  
             
              
           //  })

             //updating all the nutritions of the users
             this.promiseOrderCompletion(choices,snapshot.key);
           })


             firebase.database().ref('/dailyConsumption/' + snapshot.key +'/' +this.today + '/' + orderKey ).update({
            status : 'Complete'
          });

     })
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

 promiseOrderCompletion(choices,userID){

   Object.keys(choices)
  .map(k => {
    console.log(k);
        
     
       var val =this.updateAllNutritions(choices[k].choice,userID)
       .then(function(values) { 
           var consumeDay;
        var today = new Date().toISOString();
        var year = today.split("-")[0];
        var month = today.split("-")[1];
        var day = ( today.split("-")[2] ).split("T")[0]
        consumeDay = day + '-' + month + '-' + year; 
           // console.log('all done', values); // [snap, snap, snap] 
            
            Object.keys(values)
            .map(j=>{
             
              var unit = firebase.database().ref('/nutritions/' + userID + '/' + consumeDay + '/' + values[j].valueOf).child('unit')
              var value = firebase.database().ref('/nutritions/' + userID+ '/' + consumeDay + '/' + values[j].valueOf).child('value')
              unit.transaction(function(currentUnit){

                return values[j].unit;

              });

              value.transaction(function(currentValue){

                return currentValue + values[j].value;
              })

               

            })
           
        })
   
        
   // });
  });




 }



  updateAllNutritions(choice,userID){

    return firebase.database().ref('/products/' + choice).once('value').then(function(snapshot){
        console.log("here");
        var nutritions = [];

        var consumeDay;
        var today = new Date().toISOString();
        var year = today.split("-")[0];
        var month = today.split("-")[1];
        var day = ( today.split("-")[2] ).split("T")[0]

        consumeDay = day + '-' + month + '-' + year; 
        snapshot.forEach(function(childSnapshot){
            var promise =  firebase.database().ref('/nutritions/' + userID + '/' + consumeDay + '/' + childSnapshot.ref.key).once('value').then(function(snap){

                var snapNull = null;
                if(snap.val()!=null){
                 // console.log("currentvalue" + snap.val().value);
                  snapNull = snap.val().value
                }


               let promisedettrue = {
                unit : childSnapshot.val().unit,
                value : childSnapshot.val().value,
                valueOf : childSnapshot.ref.key,
                isNodenull : false,
                currentValue : snapNull
              };
               let promisedetfalse = {
                unit : childSnapshot.val().unit,
                value : childSnapshot.val().value,
                valueOf : childSnapshot.ref.key,
                isNodenull : true,
                
              };
              if(snap.val()==null){
                return promisedetfalse;

              }else{
                return promisedettrue;
              }
             

              
            },function(error){
              // The Promise was rejected.
                console.error(error);
            });
            nutritions.push(promise);
        });
        return Promise.all(nutritions);
    },function(error){
       // The Promise was rejected.
        console.error(error);
    })


  }




}
