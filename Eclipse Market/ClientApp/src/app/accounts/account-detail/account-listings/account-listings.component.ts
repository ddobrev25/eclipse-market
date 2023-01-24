import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { map, Subscription } from 'rxjs';
import { ListingPreviewService } from 'src/app/core/services/listing-preview.service';
import { ListingService } from 'src/app/core/services/http/listing.service';
import {
  ListingGetAllResponse,
  ListingGetByIdResponse,
  ListingUpdateRequest,
} from 'src/app/core/models/listing.model';
import { UserDataService } from 'src/app/core/services/store/user.data.service';
import { BookmarkListingRequest, DeleteRequest, UnBookmarkListingRequest, User$ } from 'src/app/core/models/user.model';
import { UserService } from 'src/app/core/services/http/user.service';

@Component({
  selector: 'app-account-listings',
  templateUrl: './account-listings.component.html',
  styleUrls: ['./account-listings.component.scss'],
})
export class AccountListingsComponent implements OnInit {
  @ViewChild('bookmark') bookmark?: ElementRef;

  updateSubs?: Subscription;
  userListingsChangedSubs?: Subscription;
  deleteSubs?: Subscription;
  userListingGetSubs?: Subscription;
  userListingFetchSubs?: Subscription;
  bookmarkListingSubs?: Subscription;
  bookmarkedListingFetchSubs?: Subscription;
  bookmarkedListingGetSubs?: Subscription;


  bookmarkedListings?: ListingGetAllResponse;
  userListings?: ListingGetAllResponse;
  listingSelected: boolean = false;
  listingsChanged: boolean = false;

  listingForUpdate?: ListingGetByIdResponse;
  listingUpdateDialog: boolean = false;

  remainingCharacters: number = 800;
  textAreaValue: string = '';

  constructor(
    private userDataService: UserDataService,
    private router: Router,
    private listingPreviewService: ListingPreviewService,
    private listingService: ListingService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private userService: UserService
  ) {}

  listingUpdateForm: FormGroup = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    price: new FormControl(''),
    location: new FormControl(''),
    listingCategory: new FormControl(''),
  });

  ngOnInit(): void {
    this.fecthUserListings();
  }

  fecthUserListings() {
    if (this.listingsChanged) 
      this.fetchUserListingsFromService();
      this.userListingGetSubs = this.userDataService.userData.subscribe({
      next: (data: User$ | null) => {
        if (data && data.currentListings)  {
          console.log('inside if')
          // this.checkIfListingIsBookmarked();
          this.userListings = data.currentListings;
        } else {
          this.fetchUserListingsFromService();
        }
      },
    });
  }

  fetchUserListingsFromService() {
    this.userListingFetchSubs = this.listingService
      .getCurrentListings()
      .subscribe({
        next: (resp: ListingGetAllResponse) => {
          this.listingsChanged = false;
          const newData = {
            currentListings: resp,
          };
          this.userDataService.setUserData(newData);
        },
        error: (err) => console.log(err),
      });
  }

  valueChange(textAreaValue: string) {
    this.remainingCharacters = 800 - textAreaValue.length;
  }

  onSelectListing(id: number) {
    this.listingPreviewService.sendListingId(id);
    this.listingSelected = true;
    this.router.navigate(['/account/listing/preview']);
  }
  onSelectListingForEdit(listingForUpdate: ListingGetByIdResponse) {
    this.listingForUpdate = listingForUpdate;
    this.listingUpdateDialog = true;
  }

  onEditListing() {
    const body: ListingUpdateRequest = {
      id: this.listingForUpdate?.id!,
      title: this.listingUpdateForm.get('title')?.value,
      description: this.listingUpdateForm.get('description')?.value,
      price: this.listingUpdateForm.get('price')?.value,
      location: this.listingUpdateForm.get('location')?.value,
      listingCategoryId: this.listingUpdateForm.get('listingCategoryId')?.value,
      imageBase64Strings: ['']
    };
    if (body.price == null) {
      body.price = 0;
    }
    this.resetUpdateForm();
    this.updateSubs = this.listingService.update(body).subscribe({
      error: (error: any) => {
        console.log(error);
      },
      complete: () => {
        this.listingsChanged = true;
        this.listingUpdateDialog = false;
        this.messageService.add({
          severity: 'success',
          detail: 'Промените са запазени!',
          life: 3000,
        });
        this.fecthUserListings();
      },
    });
  }

  resetUpdateForm() {
    this.listingUpdateForm.patchValue({
      title: '',
      description: '',
      price: null,
      location: '',
      listingCategoryId: 0,
    });
  }

  onDiscard() {
    this.listingUpdateDialog = false;
    this.resetUpdateForm();
  }

  onDeleteListing(listingForDelete: ListingGetByIdResponse) {
    const body: DeleteRequest = {
      id: listingForDelete.id!,
    };

    this.confirmationService.confirm({
      message: `Сигурнили сте, че искате да изтриете ${listingForDelete.title} ?`,
      header: 'Потвърди',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Да',
      rejectLabel: 'Не',
      accept: () => {
        this.deleteSubs = this.listingService.delete(body).subscribe({
          complete: () => {
            this.listingsChanged = true;
            this.messageService.add({
              severity: 'success',
              detail: 'Обявате е изтрита успешно!',
              life: 3000,
            });
            this.fecthUserListings();
          },
          error: (error: any) => {
            console.log(error);
          },
        });
      },
    });
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

  // fetchBookmarkedListings() {
  //   this.bookmarkedListingFetchSubs = this.listingService
  //     .getBookmarkedListings()
  //     .subscribe({
  //       next: (resp: ListingGetAllResponse) => {
  //         const newData = {
  //           bookmarkedListings: resp,
  //         };
  //         this.userDataService.setUserData(newData);
  //       },
  //     });
  // }

  // checkIfListingIsBookmarked() {
  //   this.bookmarkedListingGetSubs = this.userDataService.userData
  //     .pipe(map((b) => b?.bookmarkedListings))
  //     .subscribe({
  //       next: (resp?: ListingGetAllResponse) => {
  //         if (!resp) this.fetchBookmarkedListings();
  //         if (resp) {
  //           this.bookmarkedListings = resp;
  //           console.log(this.bookmarkedListings, this.userListings)
  //           this.userListings?.forEach(listing => {
  //             resp.forEach((bookmarkedListing) => {
  //               if (+listing.id === +bookmarkedListing.id) {
  //                 this.bookmark?.nativeElement.classList.add('bookmarked');
  //                 this.bookmark?.nativeElement.classList.remove('pi-bookmark');
  //                 this.bookmark?.nativeElement.classList.add('pi-bookmark-fill');
  //               }
  //             });
  //           })
           
  //         }
  //       },
  //     });
  // }

  ngOnDestroy() {
    this.updateSubs?.unsubscribe();
    this.userListingsChangedSubs?.unsubscribe();
    this.deleteSubs?.unsubscribe();
    this.userListingGetSubs?.unsubscribe();
    this.userListingFetchSubs?.unsubscribe();
  }
}
