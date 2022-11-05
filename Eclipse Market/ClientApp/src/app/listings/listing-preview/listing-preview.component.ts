import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IChatCreateRequest } from 'src/app/core/models/chat.model';
import { IListingGetByIdResponse } from 'src/app/core/models/listing.model';
import { IMessageSendRequest } from 'src/app/core/models/message.model';
import { ChatService } from 'src/app/core/services/chat.service';
import { ListingService } from 'src/app/core/services/listing.service';
import { MessageService } from 'src/app/core/services/message.service';
import { UserListingsService } from 'src/app/core/services/user-listings.service';

@Component({
  selector: 'app-listing-preview',
  templateUrl: './listing-preview.component.html',
  styleUrls: ['./listing-preview.component.scss'],
})
export class ListingPreviewComponent implements OnInit {
  selectedListing?: IListingGetByIdResponse;
  selectedListingId: number = 0;
  listingSubs?: Subscription;
  sub?: Subscription;
  createChatSubs?: Subscription;
  sendMessageSubs?: Subscription;

  remainingCharacters: number = 200;
  textAreaValue: string = '';

  constructor(
    private listingService: ListingService,
    private route: ActivatedRoute,
    private router: Router,
    private userListingsService: UserListingsService,
    private chatService: ChatService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.fetchQueryParams();
  }

  fetchQueryParams() {
    this.sub = this.route.queryParams.subscribe((params) => {
      this.selectedListingId = params['id'];
      this.fetchListingInfo();
    });
  }
  onLoadUserListings() {
    this.userListingsService.next(this.selectedListing?.author!);
    this.router.navigate(['/listings/user']);
  }

  fetchListingInfo() {
    this.listingSubs = this.listingService
      .getById(this.selectedListingId)
      .subscribe({
        next: (resp: IListingGetByIdResponse) => {
          this.selectedListing = resp;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  valueChange(textAreaValue: string) {
    this.remainingCharacters = 200 - textAreaValue.length;
  }

  onSendMessage() {
    const body: IChatCreateRequest = {
      topicListingId: this.selectedListingId
    }
    this.createChatSubs = this.chatService.create(body).subscribe({
      next: (resp: any) => {
        console.log(resp);
        console.log('Chat created');
        this.sendMessage(resp);
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  sendMessage(chatId: any) {
    const body: IMessageSendRequest = {
      body: this.textAreaValue,
      chatId: chatId,
    }
    this.sendMessageSubs = this.messageService.send(body).subscribe({
      next: (resp: any) => {
        console.log(resp);
        console.log('Message Sent');
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
