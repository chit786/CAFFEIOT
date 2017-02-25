import { Component } from '@angular/core';
import { NavParams,ViewController,NavController,ToastController  } from 'ionic-angular';
import firebase from 'firebase';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
// import { Ionic2RatingModule } from 'ionic2-rating';

/*
  Generated class for the OrderDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-order-detail',
  templateUrl: 'order-detail.html'
})
export class OrderDetail {

  title;
  description;
  choiceCollection : FirebaseListObservable<any> ;
  rate;
  orderKey;
  dbRating;
  choices=[];
  today =  new Date().toISOString();
  orderStatus ;
  ordersubscribe:any;
  constructor(public navParams: NavParams,public toastCtrl: ToastController,
  public navCtrl: NavController, public view: ViewController,public af:AngularFire){
     
 
  }
 
  ionViewDidLoad() {
      this.orderKey = this.navParams.get('itemKey');
   this.ordersubscribe = this.af.database.object('/orders/' + firebase.auth().currentUser.uid + '/' + this.orderKey ).subscribe((order)=>{
          this.orderStatus = order.status;
   })

    this.title = this.navParams.get('item').id;
  
    var temprate = this.dbRating;
    firebase.database().ref('/orders/'+firebase.auth().currentUser.uid + '/' + this.orderKey ).child('rating').on('value',function(snap){
      temprate = snap.val();
    })
    this.rate = temprate;
    this.choiceCollection = this.navParams.get('item').choices; 
    this.choiceCollection.subscribe((choice)=>{
      this.choices = choice.splice(0);
      
    })

     
                    var year = this.today.split("-")[0];
                    var month = this.today.split("-")[1];
                    var day = ( this.today.split("-")[2] ).split("T")[0]
                    this.today = day + "-" + month + "-" + year;
    
  }

   ngOnDestroy() {

     this.ordersubscribe.unsubscribe();

   }

  saveRating(choiceName,itemrating){
    // this.navParams.get('item').rating = this.rate;
   
    // var rate = this.rate;
   
    firebase.database().ref('/orders/'+firebase.auth().currentUser.uid + '/' +  this.navParams.get('item').$key + '/choice/' + choiceName.$key ).update({
      rating:itemrating
      
    });
 
  }

  completeOrder(){
    var choices = this.choices;
    //var choices = this.choiceCollection;
    firebase.database().ref('/orders/' + firebase.auth().currentUser.uid + '/' + this.orderKey).update({
      status : "Complete"
    }).then(()=>{


           let toaster = this.toastCtrl.create({
      message: 'Thank you, your order is complete!',
      duration: 3000
    });
    toaster.present();
      
    });

      firebase.database().ref('/dailyConsumption/' + firebase.auth().currentUser.uid +'/' +this.today + '/' + this.orderKey ).update({
      status : 'Complete'
    })

    
//let promises = 
Object.keys(choices)
  .map(k => {
   // console.log(k);
        
      if(choices[k].status!='Complete'){

    
       //var val =
       this.updateAllNutritions(choices[k].choice)
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
             
              var unit = firebase.database().ref('/nutritions/' + firebase.auth().currentUser.uid + '/' + consumeDay + '/' + values[j].valueOf).child('unit')
              var value = firebase.database().ref('/nutritions/' + firebase.auth().currentUser.uid + '/' + consumeDay + '/' + values[j].valueOf).child('value')
              unit.transaction(function(currentUnit){

                return values[j].unit;

              });

              value.transaction(function(currentValue){

                return currentValue + values[j].value;
              })

               

            })
           
        }).then(()=>{

    //        let toaster = this.toastCtrl.create({
    //   message: 'updated your nutritions!',
    //   duration: 3000
    // });
    // toaster.present();

        });
     }     
        
   // });
  });

//Promise.all(promises).then((object)=> console.log(object));
  
  //this.updateNutrtion(choices);

    for(var val in choices){

    firebase.database().ref('/orders/'+firebase.auth().currentUser.uid + '/' + this.orderKey + '/choice/' ).child(choices[val].$key).update({
      status : 'Complete'
    })

    firebase.database().ref('/dailyConsumption/' + firebase.auth().currentUser.uid +'/' +this.today + '/' + this.orderKey + '/choice/' ).child(choices[val].$key).update({
      status : 'Complete'
    })
    }


  }

  completeChoice(choiceKey,choice){
    
    
    var myorderkey = this.orderKey;

    
    firebase.database().ref('/orders/'+firebase.auth().currentUser.uid + '/' + this.orderKey + '/choice/').child(choiceKey).update({
      status : 'Complete'
    }).then(()=>{

       firebase.database().ref('/orders/' + firebase.auth().currentUser.uid + '/' + myorderkey ).once('value',function(snapshot){
       var checkstatus = true;
       console.log(snapshot.val().choice);
       for(var val in snapshot.val().choice){
         if(snapshot.val().choice[val].status!='Complete'){
           checkstatus = false;
           break;
         }
       }

       if(checkstatus){
         firebase.database().ref('/orders/' + firebase.auth().currentUser.uid + '/' + myorderkey ).update({
            status : 'Complete'
         })
       }

     })

    }) 

    firebase.database().ref('/dailyConsumption/' + firebase.auth().currentUser.uid +'/' +this.today + '/' + this.orderKey + '/choice/' ).child(choiceKey).update({
      status : 'Complete'
    }).then(()=>{
     
      this.updateAllNutritions(choice)
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
             
              var unit = firebase.database().ref('/nutritions/' + firebase.auth().currentUser.uid + '/' + consumeDay + '/' + values[j].valueOf).child('unit')
              var value = firebase.database().ref('/nutritions/' + firebase.auth().currentUser.uid + '/' + consumeDay + '/' + values[j].valueOf).child('value')
              unit.transaction(function(currentUnit){

                return values[j].unit;

              });

              value.transaction(function(currentValue){

                return currentValue + values[j].value;
              })

               

            })
           
        }).then(()=>{

    //        let toaster = this.toastCtrl.create({
    //   message: 'updated your nutritions!',
    //   duration: 3000
    // });
    // toaster.present();

        });


    })
    
    
  }

 failedChoice(choiceKey){
 
    
    firebase.database().ref('/orders/'+firebase.auth().currentUser.uid + '/' + this.orderKey + '/choice/').child(choiceKey).update({
      status : 'Failed'
    }) 

    firebase.database().ref('/dailyConsumption/' + firebase.auth().currentUser.uid +'/' +this.today + '/' + this.orderKey + '/choice/' ).child(choiceKey).update({
      status : 'Failed'
    })
    
    
  }

  updateAllNutritions(choice){

    return firebase.database().ref('/products/' + choice).once('value').then(function(snapshot){
        var nutritions = [];

        var consumeDay;
        var today = new Date().toISOString();
        var year = today.split("-")[0];
        var month = today.split("-")[1];
        var day = ( today.split("-")[2] ).split("T")[0]

        consumeDay = day + '-' + month + '-' + year; 
        snapshot.forEach(function(childSnapshot){
            var promise =  firebase.database().ref('/nutritions/' + firebase.auth().currentUser.uid + '/' + consumeDay + '/' + childSnapshot.ref.key).once('value').then(function(snap){

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
