import { Component } from '@angular/core';
import { NavController,ToastController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable,FirebaseObjectObservable} from 'angularfire2';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';

/*
  Generated class for the AskQuestion page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  
  selector: 'page-ask-question',
  templateUrl: 'ask-question.html'
})
export class AskQuestion {

  issearched :any;
  users:any;
  questionDetail: string = '';
  chips=[];
  searchTerm: string = '';
  selectcompany : FirebaseObjectObservable<any>;
  companyPreference;
   searching: any = false;
   searchControl: FormControl;
   tags : any;
  constructor(public toastCtrl: ToastController,public af : AngularFire, public navCtrl: NavController) {   
  this.searchControl = new FormControl();
  this.issearched = false;
  }

  ionViewDidLoad() {
        this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
        this.searching = false;
            
    this.af.database.object('/userProfile/'+firebase.auth().currentUser.uid + '/company',{ preserveSnapshot: true } ).subscribe(companyname=>
       {
           if(this.searchTerm==''){
          
             this.issearched = false;
           }
          else{
               this.issearched = true;
          }
          this.companyPreference = companyname.val();
           this.setFilteredItems(companyname.val(),this.searchTerm)
       }
        
    
    );
 
        });
  }

  onSearchInput(){
      this.searching = true;
  }

  setFilteredItems(company,searchTerm) {
  
       this.tags = this.af.database.list('/availabletags/' + company + '/tags').map(items=>{
        const filtered = items.filter((item) => {
            return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
        })
        return filtered;
      },
      );
  }

  delete(chip:Element){
    chip.remove();
    console.log(chip.textContent.trim());
    const foundAt = this.chips.indexOf(chip.textContent.trim());
    this.chips.splice(foundAt, 1);
    
  }

  addChip(tagName){
    const foundAt = this.chips.indexOf(tagName);
     if (foundAt >= 0) {
        //this.chips.splice(foundAt, 1);
     } else {
        this.chips.push(tagName);
    }
  }

  clearQuestion(){
    this.questionDetail = '';
    this.chips = [];
  }

  postQuestion(){
    var tags = this.chips.slice(0);
    var qdesc = this.questionDetail;
    var users = [];
    firebase.database().ref('/userProfile/'+ firebase.auth().currentUser.uid+'/myquestions').push({
      questionTitle : this.questionDetail,
      questionTags : this.chips
    }).then((key)=>{
        let questionDet = {

                     tags : tags,
                     questionTitle : qdesc,

                   }
       firebase.database().ref('/questions/' + key.key).update(questionDet)


      this.questionDetail = "";
      this.issearched = false;
      this.chips = [];
          let toast = this.toastCtrl.create({
          message: 'Question Posted',
          duration: 3000
        });
        toast.present();

        //search from all client preferences and take the unique ID's
        var index = 0;
        firebase.database().ref('/userProfile').on('value',function(snapshot){
          snapshot.forEach(function(childsnap){

               for( var val in childsnap.val().skills){
               
                 
                 if (tags.indexOf(childsnap.val().skills[val].name)>=0 && users.indexOf(childsnap.key)==-1 ){
                   users.push(childsnap.key);
                   var isScheduled = false;
                   if(childsnap.key==firebase.auth().currentUser.uid){
                      isScheduled = true;
                   }


                   
                   let member = {
                    isScheduled : isScheduled, 
                    memberID : childsnap.key,
                    memberRegID : childsnap.val().regID

                   }
                   var today = new Date().toISOString();
                   let askDetail= {

                     name : childsnap.val().firstName + ' ' + childsnap.val().lastName,
                     profilepic : childsnap.val().profilepic,
                     date : today

                   }
                   firebase.database().ref('/questions/' + key.key + '/members/' + index).update(member);
                   if(index==0){
                      firebase.database().ref('/questions/' + key.key + '/askedBy').update(askDetail);
                   }
                   
                    index = index + 1;

                   if(childsnap.key!=firebase.auth().currentUser.uid){
                      firebase.database().ref('/userProfile/' + childsnap.key + '/feeds/' + key.key).update(questionDet);
                      firebase.database().ref('/userProfile/' + childsnap.key + '/feeds/' + key.key).update({
                        isread : "false",
                        isFav : 0
                      });
                   }

                            
                  // users.push(childsnap.key);
                   
                   break;
                 }
               }
                
               
               return false;
          }
            
          
          )
           



        });
        
        


    });





  }


}
