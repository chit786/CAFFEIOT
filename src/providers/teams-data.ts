import { Injectable } from '@angular/core';
import firebase from 'firebase';


@Injectable()
export class TeamsData {
 // We'll use this to create a database reference to the userProfile node.
  userProfile: any; 

  // We'll use this to create an auth reference to the logged in user.
  currentUser: any; 


  constructor() {
    
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
                                myItems.push(name.val());
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

            memberList.push(detail.val());

        })

    }
    return memberList;

  }


}
