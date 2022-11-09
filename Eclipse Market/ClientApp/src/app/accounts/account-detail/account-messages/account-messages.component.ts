import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IChatGetAllByUserIdResponse, IChatGetAllResponse } from 'src/app/core/models/chat.model';
import { ChatService } from 'src/app/core/services/chat.service';
import { MsgService } from 'src/app/core/services/message.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-account-messages',
  templateUrl: './account-messages.component.html',
  styleUrls: ['./account-messages.component.scss'],
})
export class AccountMessagesComponent implements OnInit {
  fetchSubs?: Subscription;
  messageSubs?: Subscription;

  listingDesc: string =
    'asdasdasdasdasdadasdasdadasdasdadasdasdasdasdasdasdasdadasdasdadasdasdadasdasdasdasdasdasdasdadasdasdadasdasdadasdasd0';
  chatIsSelected: boolean = false;
  chats: IChatGetAllByUserIdResponse[] = [];  
  selectedChat?: IChatGetAllByUserIdResponse;

  firstParticipantMessages?: any[];
  secondParticipantMessages?: any[];


  constructor(
    private userService: UserService,
    private chatService: ChatService,
    private msgService: MsgService
  ) {}

  ngOnInit(): void {
    this.fetchChats();
  }

  fetchChats() {
    if(this.userService.loggedUser!.chats) {
      this.chats = this.userService.loggedUser!.chats;
      return;
    }
    this.fetchSubs = this.chatService.getAllByUserId().subscribe({
      next: (resp: any) => {
        this.userService.loggedUser!.chats = resp;
        this.chats = resp; 
      },
      error: err => {
        console.log(err)
      }
    });
  }

  sortMessages(messages: any) {
    const firstOption = messages[0].senderId
    messages.forEach((message: any) => {
        if(message.senderId === firstOption) {
          this.firstParticipantMessages!.push(message);
        } else {
          this.secondParticipantMessages!.push(message);
        }
    });
    this.firstParticipantMessages!.forEach((message: any) => {
      console.log("First " + message);
    });
    this.secondParticipantMessages!.forEach((message: any) => {
      console.log("Second " + message);
    });
  }

  onSelectChat(selectedChat: IChatGetAllResponse) {
    this.chatIsSelected = true;
    this.selectedChat = selectedChat;
    this.messageSubs = this.msgService.getAllByChatId(this.selectedChat.id).subscribe({
      next: (resp: any) => {
        this.sortMessages(resp);
        console.log(resp);
      },
      error: (err: any) => {
        console.log(err);
      }
    })
  }

  ngOnDestroy() {
    this.fetchSubs?.unsubscribe();
    this.chatIsSelected = false;
  }
}
