import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IChatGetAllResponse } from 'src/app/core/models/chat.model';
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
  chats: IChatGetAllResponse[] = [
    {
      id: 1,
      topicListingId: 2,
      timeStarted: 'dneska',
      messageIds: [],
      participantIds: [1, 2],
    },
  ];

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.fetchChats();
  }

  fetchChats() {
    // this.fetchSubs = this.chatService.getById().subscribe({

    // })
    console.log('chats fetched!');
  }
  onSelectChat(selectedChat: IChatGetAllResponse) {
    this.chatIsSelected = true;
  }

  ngOnDestroy() {
    this.fetchSubs?.unsubscribe();
  }
}
