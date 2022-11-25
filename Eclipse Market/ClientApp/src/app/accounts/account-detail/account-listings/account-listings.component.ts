import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ListingPreviewService } from 'src/app/core/services/listing-preview.service';
import { ListingService } from 'src/app/core/services/http/listing.service';
import { UserService } from 'src/app/core/services/http/user.service';
import { ListingGetAllResponse, ListingGetByIdResponse, ListingUpdateRequest } from 'src/app/core/models/listing.model';
import { UserDataService } from 'src/app/core/services/store/user.data.service';
import { DeleteRequest, UserGetInfoResponse } from 'src/app/core/models/user.model';

@Component({
  selector: 'app-account-listings',
  templateUrl: './account-listings.component.html',
  styleUrls: ['./account-listings.component.scss'],
})
export class AccountListingsComponent implements OnInit {
  updateSubs: Subscription | undefined;
  userListingsChangedSubs: Subscription | undefined;
  deleteSubs: Subscription | undefined;
  userListingSubs : Subscription | undefined;

  userListings?: ListingGetAllResponse;
  listingSelected: boolean = false;

  listingForUpdate?: ListingGetByIdResponse;
  listingUpdateDialog: boolean = false;

  remainingCharacters: number = 800;
  textAreaValue: string = '';

  constructor(
    private userService: UserService,
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
    listingCategory: new FormControl('')
  });

  ngOnInit(): void {
    this.fecthUserListings();
  }

  fecthUserListings() {
    this.userListingSubs = this.userDataService.userData.subscribe({
      next: (data) => {
        //need to fix
        // this.userListings = data.currentListings;
      }
    })
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
        this.listingUpdateDialog = false;
        this.messageService.add({
          severity: 'success',
          detail: 'Промените са запазени!',
          life: 3000,
        });
        this.ReFetchUserListings();
        this.fecthUserListings();
      },
    });
  }

  ReFetchUserListings() {
    this.userListingsChangedSubs = this.userService.getInfo().subscribe({
      next: (userInfo: UserGetInfoResponse) => {
        this.userDataService.setUserData(userInfo);
        //need to fix
        // this.userListings = userInfo.currentListings;
        this.resetUpdateForm();
      },
      error: (error: any) => {
        console.log(error);
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
            this.messageService.add({
              severity: 'success',
              detail: 'Обявате е изтрита успешно!',
              life: 3000,
            });
            this.ReFetchUserListings();
            this.fecthUserListings();
          },
          error: (error: any) => {
            console.log(error);
          },
        });
      }
    });
  }
  ngOnDestroy() {
    this.updateSubs?.unsubscribe();
    this.userListingsChangedSubs?.unsubscribe();
    this.deleteSubs?.unsubscribe();
  }
}
