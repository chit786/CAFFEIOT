import { Component } from '@angular/core';
import { NavController, ViewController,NavParams  } from 'ionic-angular';

/*
 Generated class for the PlaceOrder page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
*/
@Component({
 selector: 'page-place-order',
 templateUrl: 'place-order.html'
})
export class PlaceOrder {
 myDate: String = new Date().toISOString();
 id;
 date;
 choice;
 machineID;
 Status;
 rating;
 today:any = new Date().toISOString();
  year:any;
  month:any;
  day:any;
  listItem = [];
 constructor(public navParams: NavParams,public navCtrl: NavController, public view: ViewController) {

 }

public getListItem(): void { //here item is an object 
  this.listItem = [];
   //this.listItem.push(this.choice);// Just did this in order to avoid changing the next lines of code :P
   console.log(this.choice);
   console.log(this.listItem);
 }
 saveItem(){
    this.year = this.today.split("-")[0];
           this.month = this.today.split("-")[1];
           this.day = ( this.today.split("-")[2] ).split("T")[0];
           var orderID = ( this.today.split(":")[0] ).split("T")[1] + this.today.split(":")[1] + (this.today.split(":")[2]).split(".")[0]  ;

           this.today = this.day + "-" + this.month + "-" + this.year
           //this.today = new Date(this.year, this.month, this.day);//today to query the database to get the results
          

   let newItem = {
     id:orderID,
     date : this.month+"/"+this.day+"/"+this.year,
     choice: this.choice,
     machineID : "A",
     status : "Pending",
     rating : 0
     
   };
   var choices = this.choice;
   firebase.database().ref('/orders/'+firebase.auth().currentUser.uid).push(newItem).then((orderNode)=>{

     firebase.database().ref('/dailyConsumption/'+firebase.auth().currentUser.uid + '/' +this.today + '/'+ orderNode.key).update(newItem);

     for(var val in choices){
        firebase.database().ref('/dailyConsumption/'+firebase.auth().currentUser.uid + '/' +this.today + '/'+ orderNode.key  + '/choice/' + val).update({
          choice:choices[val],
          status:"Pending"
        })
        firebase.database().ref('/orders/'+firebase.auth().currentUser.uid + '/'+ orderNode.key + '/choice/' + val).update({
          choice:choices[val],
          status:"Pending"
        })
     }

   })



   this.view.dismiss(newItem);

 }

 removeItem(index){
   console.log(this.choice);
   this.choice.splice(index, 1);
   console.log(this.choice);

 }

 close(){
   this.view.dismiss();
 }

}