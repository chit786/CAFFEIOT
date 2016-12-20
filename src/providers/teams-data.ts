import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { AlertController } from 'ionic-angular';


@Injectable()
export class TeamsData {
 // We'll use this to create a database reference to the userProfile node.
  userProfile: any; 

  // We'll use this to create an auth reference to the logged in user.
  currentUser: any; 


  constructor(public alertCtrl : AlertController) {
    
    this.currentUser = firebase.auth().currentUser;
    this.userProfile = firebase.database().ref('/userProfile/'+  this.currentUser.uid );

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
