import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  IChatGetAllByUserIdResponse,
  IChatGetAllResponse,
} from 'src/app/core/models/chat.model';
import {
  IMessageGetAllByChatId,
  IMessageResponse,
  IMessageSendRequest,
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
  @ViewChild('msgInput') msgInput!: ElementRef;

  fetchSubs?: Subscription;
  messageSubs?: Subscription;
  sendMessageSubs?: Subscription;

  chatIsSelected: boolean = false;
  chats: IChatGetAllByUserIdResponse[] = [];
  selectedChat?: IChatGetAllByUserIdResponse;

  primaryMessages?: IMessageResponse[];
  secondaryMessages?: IMessageResponse[];
  combinedMessages?: IMessageResponse[];

  constructor(
    private userService: UserService,
    private chatService: ChatService,
    private msgService: MsgService
  ) {}

  ngOnInit(): void {
    this.fetchChats();
  }

  fetchChats() {
    if (this.userService.loggedUser?.chats?.length) {
      this.chats = this.userService.loggedUser.chats;
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

  separateMessage(message: IMessageResponse): boolean {
    if (this.primaryMessages?.includes(message)) {
      return true;
    }
    return false;
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
          this.combinedMessages = [
            ...this.primaryMessages,
            ...this.secondaryMessages,
          ];
          this.combinedMessages.sort(function (a, b) {
            return a.timeSent.localeCompare(b.timeSent);
          });
          this.combinedMessages.reverse();
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  onSendMessage() {
    if (this.selectedChat) {
      const body: IMessageSendRequest = {
        body: this.msgInput.nativeElement.value,
        chatId: this.selectedChat.id,
      };
      this.sendMessageSubs = this.msgService.send(body).subscribe({
        next: (resp: any) => {
          this.msgInput.nativeElement.value = null;
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }


  ngOnDestroy() {
    this.fetchSubs?.unsubscribe();
    this.chatIsSelected = false;
    this.fetchSubs?.unsubscribe;
    this.messageSubs?.unsubscribe;
    this.sendMessageSubs?.unsubscribe;
  }
}
