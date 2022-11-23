import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { IListingAddRequest } from 'src/app/core/models/listing.model';
import { ListingCreateCommunicationService } from 'src/app/core/services/listing-create.service';
import { ListingService } from 'src/app/core/services/listing.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-listing-create-preview',
  templateUrl: './listing-create-preview.component.html',
  styleUrls: ['./listing-create-preview.component.scss'],
})
export class ListingCreatePreviewComponent implements OnInit {
  subs?: Subscription;
  listingAddSubs?: Subscription;

  listingForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    price: new FormControl('', [Validators.required]),
    location: new FormControl('', [Validators.required]),
    listingCategoryId: new FormControl('', [Validators.required]),
    imageBase64String: new FormControl('', []),
  });

  constructor(
    private listingComService: ListingCreateCommunicationService,
    private listingService: ListingService,
    private messageService: MessageService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.fetchFormData();
  }

  onCreateListing() {
    const body: IListingAddRequest = {
      title: this.listingForm.get('title')?.value,
      description: this.listingForm.get('description')?.value,
      price: this.listingForm.get('price')?.value,
      location: this.listingForm.get('location')?.value,
      listingCategoryId: this.listingForm.get('listingCategoryId')?.value,
      imageBase64String: this.listingForm.get('imageBase64String')?.value
    };
    
    this.listingAddSubs = this.listingService.add(body).subscribe({
      complete: () => {
        this.userService.loggedUser = undefined;
        this.messageService.add({
          key: 'tc',
          severity: 'success',
          detail: 'Обявате е добавена успешно!',
          life: 3000,
        });
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  fetchFormData() {
    this.subs = this.listingComService.listingCreateData.subscribe(
      (resp: IListingAddRequest) => {
        this.listingForm.patchValue({
          title: resp.title,
          description: resp.description,
          price: resp.price,
          location: resp.location,
          listingCategoryId: resp.listingCategoryId,
          imageBase64String: resp.imageBase64String,
        });
      }
    );
  }

  previousPage() {
    this.listingForm.reset();
    this.router.navigate(['/listings/create/general']);
  }

  ngOnDestroy() {
    this.subs?.unsubscribe();
    this.listingAddSubs?.unsubscribe();
  }
}
