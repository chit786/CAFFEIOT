import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { Orders } from '../pages/orders/orders';
import { PlaceOrder } from '../pages/place-order/place-order';
import {OrderDetail} from '../pages/order-detail/order-detail';
import { LoginPage } from '../pages/login/login';
import { ResetPasswordPage } from '../pages/reset-password/reset-password';
import { SignupPage } from '../pages/signup/signup';
import {Meetings} from '../pages/meetings/meetings';
import {MyTeams} from '../pages/my-teams/my-teams';
import {Questions} from '../pages/questions/questions';
import {MeetingDetails} from '../pages/meeting-details/meeting-details';
import {ProfilePage} from '../pages/profile/profile';
import { AuthData } from '../providers/auth-data';
import {OrderData} from '../providers/order-data';
import {ProfileData} from '../providers/profile-data';
import {TeamsData} from '../providers/teams-data';
import { Ionic2RatingModule } from 'ionic2-rating';
import {MyTeamDetails} from '../pages/my-team-details/my-team-details';


import { AngularFireModule } from 'angularfire2';

export const firebaseConfig = {
  apiKey: "AIzaSyCLoFM5qxP6IXTMThJ1mm7B8EqXYaEMXAE",
  authDomain: "caffeiot.firebaseapp.com",
  databaseURL: "https://caffeiot.firebaseio.com",
  storageBucket: "caffeiot.appspot.com"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    Orders,
    Meetings,
    MyTeams,
    PlaceOrder,
    OrderDetail,
    Questions,
    LoginPage,
    ResetPasswordPage,
    SignupPage,
    MeetingDetails,
    ProfilePage,
    MyTeamDetails
  ],
  imports: [
    IonicModule.forRoot(MyApp),
       AngularFireModule.initializeApp(firebaseConfig),
       Ionic2RatingModule
       
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    Orders,
    Meetings,
    MyTeams,
    PlaceOrder,
    OrderDetail,
    Questions,
    LoginPage,
    ResetPasswordPage,
    SignupPage,
    MeetingDetails,
    ProfilePage,
    MyTeamDetails
  ],
  providers: [AuthData,OrderData,ProfileData,TeamsData]
})
export class AppModule {}
