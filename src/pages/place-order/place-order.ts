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
           //this.today = new Date(this.year, this.month, this.day);//today to query the database to get the results
          

   let newItem = {
     id:1,
     date : this.day+"-"+this.month+"-"+this.year,
     choice: this.choice,
     machineID : "A",
     Status : "Pending",
     rating : 0
     
   };
   
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