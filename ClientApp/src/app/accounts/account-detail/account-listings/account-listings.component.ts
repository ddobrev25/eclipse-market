import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { ConfirmationService, MessageService } from "primeng/api";
import { forkJoin, Subscription, take } from "rxjs";
import { ListingService } from "src/app/core/services/http/listing.service";
import {
  ListingGetAllResponse,
  ListingGetByIdResponse,
  ListingUpdateImagesRequest,
  ListingUpdateRequest,
} from "src/app/core/models/listing.model";
import { UserDataService } from "src/app/core/services/store/user.data.service";
import {
  BookmarkListingRequest,
  DeleteRequest,
  UnBookmarkListingRequest,
  User$,
} from "src/app/core/models/user.model";
import { UserService } from "src/app/core/services/http/user.service";

@Component({
  selector: "app-account-listings",
  templateUrl: "./account-listings.component.html",
  styleUrls: ["./account-listings.component.scss"],
})
export class AccountListingsComponent implements OnInit {
  @ViewChild("bookmark") bookmark?: ElementRef;

  updateSubs?: Subscription;
  userListingsChangedSubs?: Subscription;
  deleteSubs?: Subscription;
  userListingGetSubs?: Subscription;
  userListingFetchSubs?: Subscription;
  bookmarkListingSubs?: Subscription;
  bookmarkedListingFetchSubs?: Subscription;
  bookmarkedListingGetSubs?: Subscription;
  updateImgSubs?: Subscription;

  bookmarkedListings?: ListingGetAllResponse;
  userListings?: ListingGetAllResponse;
  listingSelected: boolean = false;
  listingsChanged: boolean = false;

  listingForUpdate?: ListingGetByIdResponse;
  listingUpdateDialog: boolean = false;

  remainingCharacters: number = 800;
  textAreaValue: string = "";

  images: string[] = [];

  constructor(
    private userDataService: UserDataService,
    private router: Router,
    private listingService: ListingService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private userService: UserService,
    private fb: FormBuilder
  ) {}

  listingUpdateForm: FormGroup = this.fb.group({
    title: this.fb.control(""),
    description: this.fb.control(""),
    price: this.fb.control(""),
    location: this.fb.control(""),
    listingCategory: this.fb.control(""),
  });

  ngOnInit(): void {
    this.fecthUserListings();
  }

  fecthUserListings() {
    if (this.listingsChanged) this.fetchUserListingsFromService();
    this.userListingGetSubs = this.userDataService.userData.subscribe({
      next: (data: User$ | null) => {
        if (data && data.currentListings) {
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
    this.listingSelected = true;
    this.router.navigate(["/listings/preview"], {queryParams: {id: id}});
  }
  onSelectListingForEdit(listingForUpdate: ListingGetByIdResponse) {
    this.listingForUpdate = listingForUpdate;
    this.images = listingForUpdate.imageBase64Strings;
    this.listingUpdateDialog = true;
  }

  onEditListing() {
    if (!this.listingForUpdate) return;
    const body: ListingUpdateRequest = {
      id: this.listingForUpdate.id,
      title: this.listingUpdateForm.get("title")?.value,
      description: this.listingUpdateForm.get("description")?.value,
      price: this.listingUpdateForm.get("price")?.value,
      location: this.listingUpdateForm.get("location")?.value,
      listingCategoryId: this.listingUpdateForm.get("listingCategoryId")?.value,
    };
    if (body.price == null) {
      body.price = 0;
    }
    const imgBody: ListingUpdateImagesRequest = {
      listingId: this.listingForUpdate.id,
      imageBase64Strings: this.images,
    };

    this.resetUpdateForm();
    forkJoin([
      this.listingService.update(body),
      this.listingService.updateImages(imgBody),
    ])
      .pipe(take(1))
      .subscribe({
        error: (error: any) => {
          console.log(error);
        },
        complete: () => {
          this.listingsChanged = true;
          this.listingUpdateDialog = false;
          this.messageService.add({
            severity: "success",
            detail: "Промените са запазени!",
            life: 3000,
          });
          this.fecthUserListings();
        }
      });
  }

  resetUpdateForm() {
    this.listingUpdateForm.patchValue({
      title: "",
      description: "",
      price: null,
      location: "",
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
      header: "Потвърди",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Да",
      rejectLabel: "Не",
      accept: () => {
        this.deleteSubs = this.listingService.delete(body).subscribe({
          complete: () => {
            this.listingsChanged = true;
            this.messageService.add({
              severity: "success",
              detail: "Обявате е изтрита успешно!",
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
    event.target.classList.toggle("bookmarked");
    event.target.classList.toggle("pi-bookmark");
    event.target.classList.toggle("pi-bookmark-fill");
    if (event.target.classList.contains("pi-bookmark-fill")) {
      const body: BookmarkListingRequest = {
        listingId: listing.id,
      };
      this.bookmarkListingSubs = this.userService
        .bookmarkListing(body)
        .subscribe({
          complete: () => {
            this.bookmarkedListings?.push(listing);
            const newData = {
              bookmarkedListings: this.bookmarkedListings,
            };
            this.userDataService.setUserData(newData);
            this.messageService.add({
              key: "tc",
              severity: "success",
              detail: "Обявата е добавена към отметки!",
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
            if (index !== undefined && index >= 0) {
              this.bookmarkedListings?.splice(index, 1);
              const newData = {
                bookmarkedListings: this.bookmarkedListings,
              };
              this.userDataService.setUserData(newData);
            }
            this.messageService.add({
              key: "tc",
              severity: "warn",
              detail: "Обявата е премахната от отметки!",
              life: 3000,
            });
          },
        });
    }
  }

  onRemoveImage(imageForDeletion: string) {
    const index = this.images.indexOf(imageForDeletion);
    this.images.splice(index, 1);
  }
  onAddImage(event: any) {
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (reader.result) this.images.push(reader.result.toString());
    };
    reader.onerror = (error) => console.log("Error: ", error);
    event.target.value = "";
  }
  onMouseOver(event: any) {
    event.target.children[1].classList.toggle("visible");
  }

  ngOnDestroy() {
    this.updateSubs?.unsubscribe();
    this.userListingsChangedSubs?.unsubscribe();
    this.deleteSubs?.unsubscribe();
    this.userListingGetSubs?.unsubscribe();
    this.userListingFetchSubs?.unsubscribe();
    this.updateImgSubs?.unsubscribe();
  }
}
