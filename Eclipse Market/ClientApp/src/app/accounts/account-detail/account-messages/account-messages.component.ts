import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IChatGetAllByUserIdResponse, IChatGetAllResponse } from 'src/app/core/models/chat.model';
import { ChatService } from 'src/app/core/services/chat.service';
import { MessageService } from 'src/app/core/services/message.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-account-messages',
  templateUrl: './account-messages.component.html',
  styleUrls: ['./account-messages.component.scss'],
})
export class AccountMessagesComponent implements OnInit {
  fetchSubs?: Subscription;

  listingDesc: string =
    'asdasdasdasdasdadasdasdadasdasdadasdasdasdasdasdasdasdadasdasdadasdasdadasdasdasdasdasdasdasdadasdasdadasdasdadasdasd0';
  chatIsSelected: boolean = false;
  chats: IChatGetAllByUserIdResponse[] = [];
  selectedChat?: IChatGetAllByUserIdResponse;

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.fetchChats();
  }

  fetchChats() {
    this.fetchSubs = this.chatService.getAllByUserId().subscribe({
      next: (resp: any) => {
        this.userService.loggedUser!.chats = resp;
        this.chats = resp;
        console.log(resp);
      },
      error: err => {
        console.log(err)
      }
    });
  }
  onSelectChat(selectedChat: IChatGetAllResponse) {
    this.chatIsSelected = true;
    this.selectedChat = selectedChat;
  }

  ngOnDestroy() {
    this.fetchSubs?.unsubscribe();
    this.chatIsSelected = false;
  }
}
