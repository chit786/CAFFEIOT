import {Component} from '@angular/core';
@Component({
    selector: 'chat-bubble',
    inputs: ['comment: message'],
    template:
    `
      <div class="chatBubble">
        <div class="profile-pic {{comment.position}}"></div>
        <div class="chat-bubble {{comment.position}}">
          <div class="message">{{comment?.desc}}</div>
         
        </div>
      </div>
  `
})
export class ChatBubble {
    public msg: any;
    constructor() {
        this.msg = {
            content: 'Am I dreaming?',
            position: 'left',
            time: '12/3/2016',
            senderName: 'Gregory'
        }
    }
}