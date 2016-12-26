import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavController } from 'ionic-angular';
import { QuestionsData } from '../../providers/questions-data';
import 'rxjs/add/operator/debounceTime';
/*
  Generated class for the MyQuestions page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-my-questions',
  templateUrl: 'my-questions.html'
})
export class MyQuestions {

  searchTerm: string = '';
  searchControl: FormControl;
    items: any;
 searching: any = false;

  constructor(public navCtrl: NavController, public dataService: QuestionsData) {
     this.searchControl = new FormControl();
  }

  ionViewDidLoad() {
   
        this.setFilteredItems();
 
        this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
              this.searching = false;
            this.setFilteredItems();
 
        });
  }


    onSearchInput(){
        this.searching = true;
    }
  setFilteredItems() {
 
        this.items = this.dataService.filterItems(this.searchTerm);
 
    }

}
