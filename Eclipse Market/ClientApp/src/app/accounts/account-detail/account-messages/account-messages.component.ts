import { Component, OnInit } from '@angular/core';
import { IMessage, IMessageResponse } from 'src/app/_models/message.model';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-account-messages',
  templateUrl: './account-messages.component.html',
  styleUrls: ['./account-messages.component.scss']
})
export class AccountMessagesComponent implements OnInit {
  listingDesc: string = 'asdasdasdasdasdadasdasdadasdasdadasdasdasdasdasdasdasdadasdasdadasdasdadasdasdasdasdasdasdasdadasdasdadasdasdadasdasd0';
  messageList: IMessageResponse[] = [];
  messageIsSelected: boolean = false;
  selectedMessage?: IMessage;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.fetchMessages();
    console.log(this.messageList)
  }

  fetchMessages() {
    this.messageList = this.userService.loggedUser?.messages!;
  }
  onSelectMessage(message: IMessageResponse) {
    this.messageIsSelected = true;
    this.selectedMessage = message;
  }

}
