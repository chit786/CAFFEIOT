//import 'chart.js/src/chart';
import 'chart.js/dist/Chart.bundle';
declare var Chart;
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthData } from '../../providers/auth-data';
import { LoginPage } from '../login/login';
import {OrderData} from '../../providers/order-data';
import {ProfilePage} from '../profile/profile';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

   coffeCount:any;
   userChoicePerDay: FirebaseListObservable<any[]>;
   coffess:FirebaseObjectObservable<any[]>;
   uName:string;
   waterIntake : any;
   coff:number;
 
   
 // coffeecount;
  @ViewChild('canvas') canvas:ElementRef;
   @ViewChild('waterlevel') waterlevel:Element;
  
  constructor(public navCtrl: NavController, public authData: AuthData,public af: AngularFire,public order:OrderData) {

    this.waterIntake = 40;

    }
   
   

    goToProfile(){
    this.navCtrl.push(ProfilePage);
    }

    ionViewDidEnter(){
         var labelArr = [];
         var labelCountArr = [];
         var foo = Object.create(null);
         let ctx = this.canvas.nativeElement;
         var mydate ;
         var order = this.order;
         var backColor = [];
         var hoverColor = [];



            firebase.auth().onAuthStateChanged(function(user) {
                if (user) {
                    var today = new Date().toISOString();
                    var year = today.split("-")[0];
                    var month = today.split("-")[1];
                    var day = ( today.split("-")[2] ).split("T")[0]
                    today = day + "-" + month + "-" + year;
                
               
                 var coffeeCountRef = firebase.database().ref('/dailyConsumption' + '/' + firebase.auth().currentUser.uid + '/'+  today );
                 
            coffeeCountRef.on('value', function(snapshot) {
            
                  
                let i=0;
                foo = {};
                labelArr = [];
                labelCountArr = [];
               
               if(snapshot.val()){
              
                snapshot.forEach( function (arrayItem){
                    
                    var choices = arrayItem.val().choice.splice(0);

                    for(var val in choices){

                       
                        
                    if(arrayItem.val().choice[val].status=="Complete"){
                        if(foo[arrayItem.val().choice[val].choice]>=1){
                            foo[arrayItem.val().choice[val].choice] = foo[arrayItem.val().choice[val].choice] + 1;
                        }else{
                            foo[arrayItem.val().choice[val].choice] = 1;
                        }
                    i++;
                    }
                    }
                    return false;
                 }
                 );
              
            if(Object.keys(foo).length>0){     
            for (var key in foo) {
               
                labelArr.push(key);
                labelCountArr.push(foo[key]);
                
            }
        backColor = ["#FF6384","#36A2EB","#FFCE56","#D2691E"];
            hoverColor=["#FF6384","#36A2EB","#FFCE56","#D2691E"];
        }else{
                labelArr.push("No Coffee");
                labelCountArr.push(1);
                backColor = ["#D3D3D3"];
                hoverColor = ["#D3D3D3"];
                
            }


            
            //this.coffeCount = i;
            
             Chart.pluginService.register({
        beforeDraw: function(chart) {
            var width = chart.chart.width,
                height = chart.chart.height,
                ctx = chart.chart.ctx;

            ctx.restore();
            var fontSize = (height / 114).toFixed(2);
            ctx.font = fontSize + "em sans-serif";
            ctx.textBaseline = "middle";

            var text = i,
        
                textX = Math.round((width - ctx.measureText(text).width) / 2),
                textY = height / 2;
            myChart.clear();
            ctx.fillText(text, textX, textY);
            ctx.save();
        }
        });
      

       let myChart = new Chart(ctx, {
        type: 'doughnut',
          data: {
         // labels: ["Latte", "Cappuicino", "Mocha", "Forza"],
         labels : labelArr,
          datasets: [{
           
            //data:[4, 5, 13,10],
            data:labelCountArr,
            
            backgroundColor: backColor,

            hoverBackgroundColor: hoverColor
            
            }]
            },
          options: {
            responsive: true,
            legend: {
                position: 'bottom',
            },
            title: {
                display: true,
                text: 'Coffee Consumption'
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
            
        }
            
              
            }); 

               }else{
                    //no coffee records for the day
         Chart.pluginService.register({
         beforeDraw: function(chart) {
            var width = chart.chart.width,
                height = chart.chart.height,
                ctx = chart.chart.ctx;

            ctx.restore();
            var fontSize = (height / 114).toFixed(2);
            ctx.font = fontSize + "em sans-serif";
            ctx.textBaseline = "middle";

            var text = 0,
                textX = Math.round((width - ctx.measureText(text).width) / 2),
                textY = height / 2;
            myChart.clear();
            ctx.fillText(text, textX, textY);
            ctx.save();
        }
        });
      

       let myChart = new Chart(ctx, {
        type: 'doughnut',
          data: {
         // labels: ["Latte", "Cappuicino", "Mocha", "Forza"],
         labels : ["No Coffee"],
          datasets: [{
           
            //data:[4, 5, 13,10],
            data:[1],
            
            backgroundColor: [
                "#D3D3D3",
                
            ],

            hoverBackgroundColor: [
                "#D3D3D3",
                
            ]
            
            }]
            },
          options: {
            responsive: true,
            legend: {
                position: 'bottom',
            },
            title: {
                display: true,
                text: 'Coffee Consumption'
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
            
        }
            
              
            }); 



               } 
            }
            );
       // }
       // )
       ;
                } else {
                    // No user is signed in.
                }
            });
       
    }
    

}
