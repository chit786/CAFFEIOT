import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { Orders } from '../pages/orders/orders';
import {Tasks} from '../pages/tasks/tasks';
import { PlaceOrder } from '../pages/place-order/place-order';
import {OrderDetail} from '../pages/order-detail/order-detail';
import { LoginPage } from '../pages/login/login';
import { ResetPasswordPage } from '../pages/reset-password/reset-password';
import { SignupPage } from '../pages/signup/signup';
import {Meetings} from '../pages/meetings/meetings';
import {MinutesOfMeeting} from '../pages/minutes-of-meeting/minutes-of-meeting';
import {MyTeams} from '../pages/my-teams/my-teams';
import {Questions} from '../pages/questions/questions';
import {MeetingDetails} from '../pages/meeting-details/meeting-details';
import {ProfilePage} from '../pages/profile/profile';
import { AuthData } from '../providers/auth-data';
import {OrderData} from '../providers/order-data';
import {ProfileData} from '../providers/profile-data';
import {TeamsData} from '../providers/teams-data';
import {QuestionsData} from '../providers/questions-data';
import { Ionic2RatingModule } from 'ionic2-rating';
import {MyTeamDetails} from '../pages/my-team-details/my-team-details';
import {AskQuestion} from '../pages/ask-question/ask-question';
import {Favourite} from '../pages/favourite/favourite';
import {Feed} from '../pages/feed/feed';
import {MyQuestions} from '../pages/my-questions/my-questions';
import {ScheduleMeeting} from '../pages/schedule-meeting/schedule-meeting';
import { AngularFireModule,AuthProviders,AuthMethods} from 'angularfire2';
import {Preferences} from '../pages/preferences/preferences';
import {Contacts} from '../pages/contacts/contacts';
import {MomentModule} from 'angular2-moment';
import {QuestionDetail} from '../pages/question-detail/question-detail';
import {TeamOrder} from '../pages/team-order/team-order';
import {ChatBubble} from '../components/chat-bubble/chat-bubble';



export const firebaseConfig = {
  apiKey: "AIzaSyCLoFM5qxP6IXTMThJ1mm7B8EqXYaEMXAE",
  authDomain: "caffeiot.firebaseapp.com",
  databaseURL: "https://caffeiot.firebaseio.com",
  storageBucket: "caffeiot.appspot.com"
};
// const myFirebaseAuthConfig = {
//   provider: AuthProviders.Password,
//   method: AuthMethods.Password
// }
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
    MyTeamDetails,
    AskQuestion,
    Favourite,
    Feed,
    MyQuestions,
    ScheduleMeeting,
    Preferences,
    Contacts,
    MinutesOfMeeting,
    QuestionDetail,
    Tasks,
    TeamOrder,
    ChatBubble
  ],
  imports: [
    IonicModule.forRoot(MyApp),
       AngularFireModule.initializeApp(firebaseConfig),
       Ionic2RatingModule,
       MomentModule
       
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
    MyTeamDetails,
    AskQuestion,
    Tasks,
    Favourite,
    Feed,
    MyQuestions,
    ScheduleMeeting,
    Preferences,
    Contacts,
    MinutesOfMeeting,
    QuestionDetail,
    TeamOrder,
    ChatBubble
  ],
  providers: [AuthData,OrderData,ProfileData,TeamsData,QuestionsData]
})
export class AppModule {}
