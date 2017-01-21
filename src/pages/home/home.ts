//import 'chart.js/src/chart';
import 'chart.js/dist/Chart.bundle';
declare var Chart;
import { Component, ViewChild, ElementRef,Renderer } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthData } from '../../providers/auth-data';
import {OrderData} from '../../providers/order-data';
import {ProfilePage} from '../profile/profile';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

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
   todaystasks:FirebaseListObservable<any[]>;
   nutritions:FirebaseListObservable<any[]>;
   temp:any;
  finalNutritionarray = [];
  waterObservable : FirebaseObjectObservable<any>;

 
 // coffeecount;
  @ViewChild('canvas') canvas:ElementRef;
   @ViewChild('waterLevel') waterlevelRef:ElementRef;

  public waterlevel:string = '';
    // ngAfterViewInit() {
    //     // console.log("ngView");
    //     console.log(this.waterIntake);
    //     this.waterlevel = this.waterlevelRef.nativeElement;
    //     this.renderer.setElementStyle(this.waterlevel ,"width",this.waterIntake + "%");
         
    // }

    


  constructor(public navCtrl: NavController, public authData: AuthData,public af: AngularFire,public order:OrderData,
  public renderer: Renderer) {


        var consumeDay;
        var today = new Date().toISOString();
                        var year = today.split("-")[0];
                        var month = today.split("-")[1];
                        var day = ( today.split("-")[2] ).split("T")[0]
                        today = year + '-' + day + '-' + month;
                        consumeDay = day + '-' + month + '-' + year; 

      //water intake is 2/3 of body weight in pounds multiply by 0.029 litre , 1 kg = 2.20 pound
        af.database.object('/nutritions/' + firebase.auth().currentUser.uid + '/' + consumeDay + '/serving size')
        .subscribe((water)=>{

            af.database.object('/userProfile/' + firebase.auth().currentUser.uid ).subscribe((user)=>{

                this.waterIntake = Math.round((water.value / ((2 * 0.029 * 1000 *((user.weight * 2.20))/ 3)))*100)
                console.log(this.waterIntake);
                 this.waterlevel = this.waterlevelRef.nativeElement;
                 this.renderer.setElementStyle(this.waterlevel ,"width",this.waterIntake + "%");
         
            })
            
        })                

     
        //today's tasks list
            this.todaystasks = af.database.list('/userProfile/' + firebase.auth().currentUser.uid + '/tasks',{
                query:{
                    orderByChild:'date',
                    equalTo  : today
                }
            }).map((data)=>{
                return data.map((val)=>{
                    val.icon = 'ios-add-circle-outline';
                    val.showDetails = false;
                    return val;
                })

            }) as FirebaseListObservable<any>;  

            this.nutritions = af.database.list('/nutritions/' + firebase.auth().currentUser.uid + '/' + consumeDay)
          

    }
   
   //toggle show detail on dashboard
   toggleDetails(data) {
    if (data.showDetails) {
        data.showDetails = false;
        data.icon = 'ios-add-circle-outline';
    } else {
        data.showDetails = true;
        data.icon = 'ios-remove-circle-outline';
    }
  }
   

    goToProfile(){
    this.navCtrl.push(ProfilePage);
    }

    ionViewDidEnter(){
         var labelArr = [];
         var labelCountArr = [];
         var nutritionList = []; 
         var productUnit = [];
         var foo = Object.create(null);
         let ctx = this.canvas.nativeElement;
        //  var order = this.order;
         var backColor = [];
         var hoverColor = [];
         
         var temp = this.finalNutritionarray;


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
                nutritionList= [];
             productUnit = [];
            
            
               
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
               
                labelArr.push(key);//here we have all the labels
                labelCountArr.push(foo[key]);//here we have all the counts
                
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
