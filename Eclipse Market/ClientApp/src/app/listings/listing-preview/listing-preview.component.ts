import { CursorError } from '@angular/compiler/src/ml_parser/lexer';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ChatCreateRequest } from 'src/app/core/models/chat.model';
import { ListingGetByIdResponse, ListingGetByIdWithAuthorResponse } from 'src/app/core/models/listing.model';
import { MessageSendRequest } from 'src/app/core/models/message.model';
import { ChatService } from 'src/app/core/services/http/chat.service';
import { ListingService } from 'src/app/core/services/http/listing.service';
import { MsgService } from 'src/app/core/services/http/message.service';
import { UserListingsService } from 'src/app/core/services/user-listings.service';

@Component({
  selector: 'app-listing-preview',
  templateUrl: './listing-preview.component.html',
  styleUrls: ['./listing-preview.component.scss'],
})
export class ListingPreviewComponent implements OnInit {
  @ViewChild('img') imgEl?: ElementRef;

  currentImage?: string;
  selectedListingImages: string[] = [];
  selectedListing?: ListingGetByIdWithAuthorResponse;
  selectedListingId: number = 0;
  listingSubs?: Subscription;
  sub?: Subscription;
  createChatSubs?: Subscription;
  sendMessageSubs?: Subscription;
  listingCategorySubs?: Subscription;
  incrementViewsSubs?: Subscription;

  remainingCharacters: number = 200;
  textAreaValue: string = '';

  constructor(
    private listingService: ListingService,
    private route: ActivatedRoute,
    private router: Router,
    private userListingsService: UserListingsService,
    private chatService: ChatService,
    private messageService: MessageService,
    private msgService: MsgService
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
    if (!this.selectedListing) return;
    this.userListingsService.setUserListings(this.selectedListing.author);
    this.router.navigate(['/listings/user']);
  }

  fetchListingInfo() {
    this.listingSubs = this.listingService
      .getById(this.selectedListingId)
      .subscribe({
        next: (resp: ListingGetByIdWithAuthorResponse | ListingGetByIdResponse) => {
          if('authorId' in resp) return;
          this.selectedListing = resp;
          this.selectedListingImages = resp.imageBase64String;
          this.incrementViews(this.selectedListingId);
        },
        error: (err) => console.log(err),
      });
  }

  incrementViews(id: number) {
    this.incrementViewsSubs = this.listingService
      .incrementViews(id)!
      .subscribe({
        error: (err) => console.log(err),
      });
  }

  valueChange(textAreaValue: string) {
    this.remainingCharacters = 200 - textAreaValue.length;
  }

  onSendMessage() {
    const body: ChatCreateRequest = {
      topicListingId: this.selectedListingId,
    };
    this.createChatSubs = this.chatService.create(body).subscribe({
      next: (resp: number) => {
        this.sendMessage(resp);
      },
      error: (err) => console.log(err),
    });
  }

  sendMessage(chatId: any) {
    const body: MessageSendRequest = {
      body: this.textAreaValue,
      chatId: chatId,
    };
    this.sendMessageSubs = this.msgService.send(body).subscribe({
      next: (resp: any) => {
        this.messageService.add({
          key: 'tc',
          severity: 'success',
          detail: 'Съобщението е изпратено успешно!',
          life: 3000,
        });
        this.textAreaValue = '';
      },
      error: (err: any) => console.log(err),
    });
  }

  onShowImageOverlay(event: any) {
    if(this.selectedListingImages.length <= 1) {
      const smh = event.target.children[1].children[0].children;
      Object.entries(smh).forEach((el: any) => {
        el[1].style.opacity = 0.5;
      });
    }
    event.target.children[0].classList.toggle('show-overlay')
  }
  onNextImage(event: any) {
    const currentImage = this.imgEl?.nativeElement.currentSrc;
    const currentImageIndex = this.selectedListingImages.indexOf(currentImage);
    const nextImage = this.selectedListingImages[currentImageIndex + 1];
    if(currentImageIndex >= this.selectedListingImages.length - 1) {
      this.currentImage = currentImage;
      return;
    }
    event.target.parentElement.children[0].style.opacity = 1;
    if(currentImageIndex + 1 === this.selectedListingImages.length - 1) {
      event.target.style.opacity = 0.5;
      this.currentImage = nextImage;
      return;
    } else {
      event.target.style.opacity = 1;
      this.currentImage = nextImage;
    }
  }


  onPreviousImage(event: any) {
    const currentImage = this.imgEl?.nativeElement.currentSrc;
    const currentImageIndex = this.selectedListingImages.indexOf(currentImage);
    const previousImage = this.selectedListingImages[currentImageIndex - 1];
    if(currentImageIndex - 1 < 0) {
      this.currentImage = currentImage;
      return;
    }
    event.target.nextSibling.style.opacity = 1;
    if(currentImageIndex - 1 === 0) {
      event.target.style.opacity = 0.5;
      this.currentImage = previousImage;
      return;
    }
    event.target.style.opacity = 1;
    this.currentImage = previousImage;
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
    this.listingSubs?.unsubscribe();
    this.createChatSubs?.unsubscribe();
    this.sendMessageSubs?.unsubscribe();
    this.incrementViewsSubs?.unsubscribe();
    this.listingCategorySubs?.unsubscribe();
  }
}
