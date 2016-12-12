import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import firebase from 'firebase';
import 'rxjs/add/operator/map';

/*
  Generated class for the OrderData provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class OrderData {
   public order: any;
   private fireAuth: any;
   private dbRef:any;
    today:any ;
    year:any;
    month:any;
    day:any;
    uName:any;
    
  constructor(public http: Http) {
   
  }
  
  getcurrentuseremail():any{
    
    return firebase.auth().currentUser.email.replace("@","CAFFEIOTAT").replace(".","CAFFEDOT");
  }

  gettodayscoffeeconsumption():any{
    this.today = new Date().toISOString();
      this.year = this.today.split("-")[0];
    this.month = this.today.split("-")[1];
    this.day = ( this.today.split("-")[2] ).split("T")[0];
    // this.today = new Date(this.year, this.month, this.day);//today to query the database to get the results
    this.today = this.day + "-" + this.month + "-" + this.year;
    return  firebase.database().ref('/dailyConsumption' + '/' + firebase.auth().currentUser.email.replace("@","CAFFEIOTAT").replace(".","CAFFEDOT") + '/'+  this.today );
  }

}
