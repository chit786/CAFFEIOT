import { Component } from '@angular/core';
import { NavParams,ViewController,NavController  } from 'ionic-angular';
import { Ionic2RatingModule } from 'ionic2-rating';

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
  choiceCollection;
  rate;
  orderKey;
  dbRating;
  today =  new Date().toISOString();
  constructor(public navParams: NavParams,public navCtrl: NavController, public view: ViewController){
 
  }
 
  ionViewDidLoad() {
    this.title = this.navParams.get('item').id;
    this.orderKey = this.navParams.get('itemKey');
    var temprate = this.dbRating;
    firebase.database().ref('/orders/'+firebase.auth().currentUser.uid + '/' + this.orderKey ).child('rating').on('value',function(snap){
      temprate = snap.val();
    })
    this.rate = temprate;
    this.choiceCollection = this.navParams.get('item').choice; 

     
                    var year = this.today.split("-")[0];
                    var month = this.today.split("-")[1];
                    var day = ( this.today.split("-")[2] ).split("T")[0]
                    this.today = day + "-" + month + "-" + year;
    
  }

  saveRating(choiceName){
    // this.navParams.get('item').rating = this.rate;
   
    var rate = this.rate;
   
    firebase.database().ref('/orders/'+firebase.auth().currentUser.uid + '/' + this.orderKey ).update({
      rating:rate
      
    });
    this.view.dismiss(); 
  
   // this.view.dismiss();
 
  }

  completeOrder(){
    var choices = this.choiceCollection;
    firebase.database().ref('/orders/' + firebase.auth().currentUser.uid + '/' + this.orderKey).update({
      status : "Complete"
    });

      firebase.database().ref('/dailyConsumption/' + firebase.auth().currentUser.uid +'/' +this.today + '/' + this.orderKey ).update({
      status : 'Complete'
    })

    for(var val in choices){

       
    firebase.database().ref('/orders/'+firebase.auth().currentUser.uid + '/' + this.orderKey + '/choice/').child(val).update({
      status : 'Complete'
    }) 

    firebase.database().ref('/dailyConsumption/' + firebase.auth().currentUser.uid +'/' +this.today + '/' + this.orderKey + '/choice/' ).child(val).update({
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


}
