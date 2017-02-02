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
  constructor(public navParams: NavParams,public toastCtrl: ToastController,
  public navCtrl: NavController, public view: ViewController,public af:AngularFire){
     
 
  }
 
  ionViewDidLoad() {
    this.title = this.navParams.get('item').id;
    this.orderKey = this.navParams.get('itemKey');
    var temprate = this.dbRating;
    firebase.database().ref('/orders/'+firebase.auth().currentUser.uid + '/' + this.orderKey ).child('rating').on('value',function(snap){
      temprate = snap.val();
    })
    this.rate = temprate;
    this.choiceCollection = this.navParams.get('item').choices; 
    this.choiceCollection.subscribe((choice)=>{
      this.choices = choice.splice(0);
      console.log(this.choices);
    })

     
                    var year = this.today.split("-")[0];
                    var month = this.today.split("-")[1];
                    var day = ( this.today.split("-")[2] ).split("T")[0]
                    this.today = day + "-" + month + "-" + year;
    
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
    });

      firebase.database().ref('/dailyConsumption/' + firebase.auth().currentUser.uid +'/' +this.today + '/' + this.orderKey ).update({
      status : 'Complete'
    })

    
let promises = Object.keys(choices)
  .map(k => {
   // console.log(k);
        
     
       var val =this.updateAllNutritions(choices[k].choice)
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

           let toaster = this.toastCtrl.create({
      message: 'updated your nutritions!',
      duration: 3000
    });
    toaster.present();

        });
   
        
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

  completeChoice(choiceKey){
 
    
    firebase.database().ref('/orders/'+firebase.auth().currentUser.uid + '/' + this.orderKey + '/choice/').child(choiceKey).update({
      status : 'Complete'
    }) 

    firebase.database().ref('/dailyConsumption/' + firebase.auth().currentUser.uid +'/' +this.today + '/' + this.orderKey + '/choice/' ).child(choiceKey).update({
      status : 'Complete'
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
