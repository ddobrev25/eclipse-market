import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  IChatGetAllByUserIdResponse,
  IChatGetAllResponse,
} from 'src/app/core/models/chat.model';
import {
  IMessageGetAllByChatId,
  IMessageResponse,
} from 'src/app/core/models/message.model';
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

  primaryMessages?: IMessageResponse[];
  secondaryMessages?: IMessageResponse[];

  constructor(
    private userService: UserService,
    private chatService: ChatService,
    private msgService: MsgService
  ) {}

  ngOnInit(): void {
    this.fetchChats();
  }

  fetchChats() {
    if (this.userService.loggedUser?.chats!) {
      this.chats = this.userService.loggedUser?.chats!;
      return;
    }
    this.fetchSubs = this.chatService.getAllByUserId().subscribe({
      next: (resp: any) => {
        this.userService.loggedUser!.chats = resp;
        this.chats = resp;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  onSelectChat(selectedChat: IChatGetAllResponse) {
    this.chatIsSelected = true;
    this.selectedChat = selectedChat;
    this.messageSubs = this.msgService
      .getAllByChatId(this.selectedChat.id)
      .subscribe({
        next: (resp: IMessageGetAllByChatId) => {
          this.primaryMessages = resp.primaryMessages;
          this.secondaryMessages = resp.secondaryMessages;
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  ngOnDestroy() {
    this.fetchSubs?.unsubscribe();
    this.chatIsSelected = false;
  }
}
