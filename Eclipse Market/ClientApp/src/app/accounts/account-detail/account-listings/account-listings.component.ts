import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ListingPreviewService } from 'src/app/core/services/listing-preview.service';
import { ListingService } from 'src/app/core/services/http/listing.service';
import {
  ListingGetAllResponse,
  ListingGetByIdResponse,
  ListingUpdateRequest,
} from 'src/app/core/models/listing.model';
import { UserDataService } from 'src/app/core/services/store/user.data.service';
import { DeleteRequest, User$ } from 'src/app/core/models/user.model';

@Component({
  selector: 'app-account-listings',
  templateUrl: './account-listings.component.html',
  styleUrls: ['./account-listings.component.scss'],
})
export class AccountListingsComponent implements OnInit {
  updateSubs?: Subscription;
  userListingsChangedSubs?: Subscription;
  deleteSubs?: Subscription;
  userListingGetSubs?: Subscription;
  userListingFetchSubs?: Subscription;

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
    private confirmationService: ConfirmationService
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
      next: (data: User$) => {
        if (data && data.currentListings)  {
          console.log(data)
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
      imageBase64String: ['']
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
  ngOnDestroy() {
    this.updateSubs?.unsubscribe();
    this.userListingsChangedSubs?.unsubscribe();
    this.deleteSubs?.unsubscribe();
    this.userListingGetSubs?.unsubscribe();
    this.userListingFetchSubs?.unsubscribe();
  }
}
