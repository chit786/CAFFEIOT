import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { AlertController,ToastController } from 'ionic-angular';
import {AngularFire, FirebaseObjectObservable} from 'angularfire2';
import { Http,Response, Headers, RequestOptions  } from '@angular/http';

@Injectable()
export class TeamsData {
 // We'll use this to create a database reference to the userProfile node.
  userProfile: any; 
  memberRegID : FirebaseObjectObservable<any>;
  profileindex : FirebaseObjectObservable<any>;
  // We'll use this to create an auth reference to the logged in user.
  currentUser: any; 

  constructor(public alertCtrl : AlertController,private http: Http,public af:AngularFire,public toastCtrl: ToastController) {

    this.http = http;
    
    this.currentUser = firebase.auth().currentUser;
    this.userProfile = firebase.database().ref('/userProfile/'+  this.currentUser.uid );
   
  }

  //send notification to client
  sendNotify(regID,key){
    var myAlert = this.alertCtrl;
    var myhttp = this.http;
    var member= this.memberRegID;
    var af = this.af;
   
    this.profileindex = this.af.database.object('/profile-index/' + regID.replace("@","CAFFEIOTAT").replace(".","CAFFEIOTDOT") + '/uniqueID')

     this.profileindex.$ref.on('value',function(snapshot){
    
        member = af.database.object('/teams/' + key + '/members/' + snapshot.val() + '/regID');
        member.$ref.on('value',function(childsnap){
   
            let headers = new Headers({ 'Content-Type': 'application/json','Authorization':'key=AAAAggFbpvo:APA91bG6IRvRoSGJP2rcNGG8BLV3NxE7mbkFmvQhD_lYjAuhGtFVvX9OkYbMlTR_cP6p8kBDpvw_790o1JJbcAs0ScnwB_4wuwyGuxrtp6UlnxeyYl2b43fh6pUTVHi1jGFkTuTp58wtJjX6zSNvLg_CLKdBAEY_YA' }); // ... Set content type to JSON
            let options = new RequestOptions({ headers: headers });
              if(childsnap.val()){     
              myhttp.post("https://fcm.googleapis.com/fcm/send",'{"data":{"title":"CAFFEIOT","message":"Coffee?"},"to":'+ JSON.stringify(childsnap.val())+"}",options)
              .subscribe(data=>{
                  let alert = myAlert.create({
                  title: 'New Member',
                 subTitle: 'member Added!!',
                 buttons: ['OK']
             });
              alert.present();

             })
              }
             
        })

    

     })
     
   



  }

  //ask Coffee to the team
  askCoffee(memberDetail){
var myhttp = this.http;
 var myAlert = this.toastCtrl;
    memberDetail.forEach(function(snapshot){
                       
                    snapshot.forEach(function(child){
                      if(child.$key!=firebase.auth().currentUser.uid){
                          //added
                           let headers = new Headers({ 'Content-Type': 'application/json','Authorization':'key=AAAAggFbpvo:APA91bG6IRvRoSGJP2rcNGG8BLV3NxE7mbkFmvQhD_lYjAuhGtFVvX9OkYbMlTR_cP6p8kBDpvw_790o1JJbcAs0ScnwB_4wuwyGuxrtp6UlnxeyYl2b43fh6pUTVHi1jGFkTuTp58wtJjX6zSNvLg_CLKdBAEY_YA' }); // ... Set content type to JSON
                            let options = new RequestOptions({ headers: headers });
                              console.log('{"data":{"title":"CAFFEIOT","message":"Coffee?"},"to":'+ JSON.stringify(child.regID)+"}");

                              myhttp.post("https://fcm.googleapis.com/fcm/send",'{"data":{"title":"CAFFEIOT","message":"Coffee?"},"to":'+ JSON.stringify(child.regID)+"}",options)
                              .subscribe(data=>{
                                      let alert = myAlert.create({
                                    message: child.firstName + ' notified!',
                                    duration: 3000
                                });
                                  alert.present();

                                })
                          //
                            
                      }


                    })

                    
                    
                  })
  }



   sendNotifyContact(regID,key,message){
    var myAlert = this.alertCtrl;
    var myhttp = this.http;
    var member= this.memberRegID;
    var af = this.af;
   
        console.log('/teams/' + key + '/members/' + regID+ '/regID')
        member = af.database.object('/teams/' + key + '/members/' + regID+ '/regID');
        member.$ref.on('value',function(childsnap){
   
            let headers = new Headers({ 'Content-Type': 'application/json','Authorization':'key=AAAAggFbpvo:APA91bG6IRvRoSGJP2rcNGG8BLV3NxE7mbkFmvQhD_lYjAuhGtFVvX9OkYbMlTR_cP6p8kBDpvw_790o1JJbcAs0ScnwB_4wuwyGuxrtp6UlnxeyYl2b43fh6pUTVHi1jGFkTuTp58wtJjX6zSNvLg_CLKdBAEY_YA' }); // ... Set content type to JSON
            let options = new RequestOptions({ headers: headers });
              if(childsnap.val()){     
              myhttp.post("https://fcm.googleapis.com/fcm/send",'{"data":{"title":"CAFFEIOT","message":"'+message+'"},"to":'+ JSON.stringify(childsnap.val())+"}",options)
              .subscribe(data=>{
                  let alert = myAlert.create({
                  title: 'New Member',
                 subTitle: 'member Added!!',
                 buttons: ['OK']
             });
              alert.present();

             })
              }
             
        })





  }

  //getTeams
 //get teams
  getTeams() : any{
    var myItems = [];
    var teams = this.userProfile.child("teams");
    var teamName;
    var memberGroup;
    console.log("hi")
    teams.on('value',function(snapshot){
      
      if(snapshot.val()){
          //loop though all the team names and check in the teams to get the team name
           snapshot.forEach( function (arrayItem){
                  var teamName = firebase.database().ref('/teams/'+arrayItem.val().teamID );
                      teamName.on('value',function(name){
                               //this.saveTeam(name.val())
                               var team = name.val();
                               team.id = name.key;  
                                myItems.push(team);
                      });
                    }
                 );
            }
    })
    return myItems;
  } 
  //getClients associated to teamID
  getClientInfo(item){
    var memberList = []
    for(var val in item.members){

        var member = firebase.database().ref('/userProfile/'+item.members[val].userID);
        member.on('value',function(detail){
            var detailmember = detail.val();
            detailmember.id = detail.key;
            memberList.push(detailmember);

        })

    }
    return memberList;

  }

  //remove client
  removeClientfromList(item,member){
    console.log('/userProfile/'+member+'/teams');
    var memberNode = firebase.database().ref('/userProfile/'+member+'/teams');

    memberNode.once('value',function(snapshot){

        snapshot.forEach(function(arritem){
          console.log(arritem.val().teamID );
          console.log(item );
          if(arritem.val().teamID == item){
              console.log('here');
              arritem.child('teamID').ref.remove(); //remove node from member list
              
           //   arritem.ref.on('child_removed',function(childItem){
                 console.log('here');
                 console.log('/teams/'+item + '/members');
                  var teamNode = firebase.database().ref('/teams/'+item + '/members');

                   teamNode.on('value',function(snapshotteam){
                      snapshotteam.forEach(function(val){
                          console.log(val.val().userID);
                          console.log(member);
                          if(val.val().userID == member){
                             val.child('userID').ref.remove();
                             return true;

                        }
                        return false;
                      })
                        


                   })

              //})

              return true;

          }
            return false;
        });

    })


  }


  //add member
  addMembertoTeam(email,itemId){
    var memberNode;
    var status;
    status = false;
    var teamID = itemId.id;
     let alert1 = this.alertCtrl.create({
                   title: 'New Member Added!',
                   subTitle: email + ' is just added!!',
                   buttons: ['OK']
                 });
    
     let alert2 = this.alertCtrl.create({
                   title: 'Some Issue in adding new member!',
                   subTitle: ' Please retry ',
                   buttons: ['OK']
                 });
     var uniqueTeam;
     var clientNode = firebase.database().ref('/userProfile');
     clientNode.once('value',function(snapshot){

        snapshot.forEach(function(arrItem){
          console.log('email'+ arrItem.val().email);
          console.log('exp' + email);
            if(arrItem.val().email == email){
               
                 
              //  uniqueTeam.push(data);
                status = true;
                memberNode = arrItem;
              
                  var data = {teamID:teamID }
                  uniqueTeam = firebase.database().ref('/userProfile/'+memberNode.key+'/teams');
                  uniqueTeam.push(data);
                  var teamNode =  firebase.database().ref('/teams/'+teamID + '/members');
                  var dataMember = {userID:memberNode.key}
                  teamNode.push(dataMember);
                  if(status){
                    
               
                 alert1.present();
                
               }else{
                
                 alert2.present();
               }
                  return status;

            }

          return status;
        });

     });

     return this.getClientInfo(itemId);
      


  }


}
