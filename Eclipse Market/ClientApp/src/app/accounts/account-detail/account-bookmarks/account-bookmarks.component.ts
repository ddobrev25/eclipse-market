import { HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { map, Subscription } from 'rxjs';
import {
  ListingGetAllResponse,
  ListingGetByIdResponse,
} from 'src/app/core/models/listing.model';
import {
  BookmarkListingRequest,
  UnBookmarkListingRequest,
} from 'src/app/core/models/user.model';
import { ListingService } from 'src/app/core/services/http/listing.service';
import { UserService } from 'src/app/core/services/http/user.service';
import { UserDataService } from 'src/app/core/services/store/user.data.service';

@Component({
  selector: 'app-account-bookmarks',
  templateUrl: './account-bookmarks.component.html',
  styleUrls: ['./account-bookmarks.component.scss'],
})
export class AccountBookmarksComponent implements OnInit, OnDestroy {
  bookmarkedListingsGetSubs?: Subscription;
  bookmarkedListingsFetchSubs?: Subscription;
  bookmarkListingSubs?: Subscription;

  bookmarkedListings?: ListingGetAllResponse;

  constructor(
    private userDataService: UserDataService,
    private listingService: ListingService,
    private router: Router,
    private messageService: MessageService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.fetchBookmarkedListings();
  }
  fetchBookmarkedListings() {
    this.bookmarkedListingsGetSubs = this.userDataService.userData
      .pipe(map((b) => b?.bookmarkedListings))
      .subscribe({
        next: (resp?: ListingGetAllResponse) => {
          if (resp) {
            this.bookmarkedListings = resp;
          } else {
            this.fetchBookmarkedListingsFromService();
          }
        },
        error: (err) => console.log(err),
      });
  }
  fetchBookmarkedListingsFromService() {
    this.bookmarkedListingsFetchSubs = this.listingService
      .getBookmarkedListings()
      .subscribe({
        next: (resp: ListingGetAllResponse) => {
          const newData = {
            bookmarkedListings: resp,
          };
          this.userDataService.setUserData(newData);
        },
        error: (err) => console.log(err),
      });
  }

  onPreviewListing(listingId: number) {
    this.router.navigateByUrl(`/listings/preview?id=${listingId}`);
  }

  onBookmarkListing(event: any, listing: ListingGetByIdResponse) {
    event.target.classList.toggle('bookmarked');
    event.target.classList.toggle('pi-bookmark');
    event.target.classList.toggle('pi-bookmark-fill');
    if (event.target.classList.contains('pi-bookmark-fill')) {
      const body: BookmarkListingRequest = {
        listingId: listing.id,
      };
      this.bookmarkListingSubs = this.userService
        .bookmarkListing(body)
        .subscribe({
          complete: () => {
            this.bookmarkedListings?.push(listing)
            const newData = {
              bookmarkedListings: this.bookmarkedListings,
            };
            this.userDataService.setUserData(newData);
            this.messageService.add({
              key: 'tc',
              severity: 'success',
              detail: 'Обявата е добавена към отметки!',
              life: 3000,
            });
          },
        });
    } else {
      const body: UnBookmarkListingRequest = {
        listingId: listing.id,
      };
      this.bookmarkListingSubs = this.userService
        .unBookmarkListing(body)
        .subscribe({
          complete: () => {
            const index = this.bookmarkedListings?.findIndex(
              (x) => x.id === listing.id
            );
            if (index) {
              this.bookmarkedListings?.splice(index, 1);
              const newData = {
                bookmarkedListings: this.bookmarkedListings
              }
              this.userDataService.setUserData(newData);
            }
            this.messageService.add({
              key: 'tc',
              severity: 'warn',
              detail: 'Обявата е премахната от отметки!',
              life: 3000,
            });
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.bookmarkedListingsGetSubs?.unsubscribe();
    this.bookmarkedListingsFetchSubs?.unsubscribe();
  }
}
