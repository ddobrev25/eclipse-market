import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ListingCreateCommunicationService } from 'src/app/core/services/listing-create.service';
import { ListingService } from 'src/app/core/services/http/listing.service';
import { ListingAddRequest } from 'src/app/core/models/listing.model';

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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchFormData();
  }

  onCreateListing() {
    const body: ListingAddRequest = {
      title: this.listingForm.get('title')?.value,
      description: this.listingForm.get('description')?.value,
      price: this.listingForm.get('price')?.value,
      location: this.listingForm.get('location')?.value,
      listingCategoryId: this.listingForm.get('listingCategoryId')?.value,
      primaryImageBase64String:
        this.listingForm.get('imageBase64String')?.value,
      secondaryImageBase64String: this.listingForm
        .get('imageBase64String')
        ?.value.toArray(),
    };

    this.listingAddSubs = this.listingService.add(body).subscribe({
      complete: () => {
        // this.userService.loggedUser = undefined;
        this.messageService.add({
          key: 'tc',
          severity: 'success',
          detail: 'Обявате е добавена успешно!',
          life: 3000,
        });
        this.router.navigate(['/home']);
      },
      error: (err) => console.log(err),
    });
  }

  fetchFormData() {
    this.subs = this.listingComService.listingCreateData.subscribe(
      (resp: ListingAddRequest) => {
        this.listingForm.patchValue({
          title: resp.title,
          description: resp.description,
          price: resp.price,
          location: resp.location,
          listingCategoryId: resp.listingCategoryId,
          primaryImageBase64String: resp.primaryImageBase64String,
          secondaryImageBase64String: resp.secondaryImageBase64String,
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
