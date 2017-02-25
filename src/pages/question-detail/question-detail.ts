import { Component, ViewChild } from '@angular/core';
import { NavParams,ViewController,NavController,Content, TextInput } from 'ionic-angular';
import { AngularFire, FirebaseListObservable,FirebaseObjectObservable} from 'angularfire2';
import {ScheduleMeeting} from '../schedule-meeting/schedule-meeting';
import firebase from 'firebase';
/*
  Generated class for the QuestionDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-question-detail',
  templateUrl: 'question-detail.html'
})
export class QuestionDetail {
 public message = "";
 membercanmeet = true;
  question : FirebaseObjectObservable<any>;
  comments : FirebaseListObservable<any>;
  @ViewChild(Content) content: Content;
  @ViewChild('chat_input') messageInput: TextInput;
  constructor(public navParams: NavParams,public navCtrl: NavController, public view: ViewController, public af:AngularFire) {}

  ionViewDidLoad() {

    this.question = this.af.database.object('/questions/' + this.navParams.get('qsKey'))
                    .map((_qs)=>{
                      _qs.host = this.af.database.object('/userProfile/' + _qs.param);
                      return _qs;
                    }) as FirebaseObjectObservable<any>;
                 
    this.comments = this.af.database.list('/questions/' + this.navParams.get('qsKey') + '/comments').map((cms)=>{
      return cms.map((cm)=>{

        if(cm.askedBy==firebase.auth().currentUser.uid){
            cm.questionflag = false;
            cm.position = 'right';
        }else{
            cm.questionflag = true;
            cm.position = 'left';
        }
        
       // cm.userProfile = this.af.database.object('/userProfile/' + cm.$key.askedBy)
        cm.user= this.af.database.object('/userProfile/'+ cm.askedBy ),
        cm.detail = this.af.database.object('/questions/'+this.navParams.get('qsKey') )
        return cm;
        
      }

      )

    }) as FirebaseListObservable<any>;

    
  }

  sendMessage() {
    // this.messages.push({
    //   position: 'left',
    //   body: this.message
    // });
    firebase.database().ref('/questions/' + this.navParams.get('qsKey') + '/comments').push({
      askedBy : firebase.auth().currentUser.uid,
      desc : this.message
    });
    this.message = "";

    this.messageInput.setFocus();
    this.updateScroll();
  }
  updateScroll() {
  
    setTimeout(() => {
      this.content.scrollToBottom();
    }, 400)
  }

  close(){

    this.view.dismiss();
  }

  scheduleMeetingWithMember(qKey,comment){

    var nav = this.navCtrl;

    
    firebase.database().ref('/userProfile/' + comment.user.$ref.key).once('value',function(snapshot){

      var updates = {};
      let newTeam = {
        'isOwner' : true,
        'teamName' : 'team with ' + snapshot.val().firstName

      }

      let isOwnerfalse = {
        'isOwner' : false,
        'teamName' : 'team with ' + snapshot.val().firstName

      }


      let userDetail = {

        firstName : snapshot.val().firstName,
        lastName : snapshot.val().lastName,
        profilepic : snapshot.val().profilepic,
        // regID : snapshot.val().regID

      }

      firebase.database().ref('/userProfile/'+ firebase.auth().currentUser.uid).once('value',function(chsnapshot){
          var cuserKey = chsnapshot.key;


        let cUserdetail = {
           firstName : chsnapshot.val().firstName,
           lastName : chsnapshot.val().lastName,
           profilepic : chsnapshot.val().profilepic,
          //  regID : chsnapshot.val().regID

        }

         firebase.database().ref('/teams').push({
          members : 'temp'
        }).then(pushkey =>{

          // updates['/teams/ '+ pushkey.key +'/members/' + cuserKey] = cUserdetail;
           // updates['/teams/'+pushkey.key+'/members/' + user.$key ] = userDetail
           
           updates['/userProfile/'+ firebase.auth().currentUser.uid + '/teams/' + pushkey.key] = newTeam;
           updates['/userProfile/'+ snapshot.key + '/teams/' + pushkey.key] = isOwnerfalse;
          updates['/userProfile/' + firebase.auth().currentUser.uid  + '/contacts/' + snapshot.key ] = userDetail;

           
           firebase.database().ref().update(updates).then(key =>{
            firebase.database().ref('/teams/'+pushkey.key+'/members/' + snapshot.key).set(userDetail);
             firebase.database().ref('/teams/'+pushkey.key+'/members/' + cuserKey).set(cUserdetail);
                 nav.push(ScheduleMeeting,{
                   teamName: 'team with ' + snapshot.val().firstName
                 })

               })
        })

      })


    })



  }

 
}
