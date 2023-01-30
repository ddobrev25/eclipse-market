import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
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
    title: this.fb.control('', [
      Validators.required,
      Validators.maxLength(30),
      Validators.minLength(3),
    ]),
    description: this.fb.control('', [
      Validators.required,
      Validators.maxLength(800),
      Validators.minLength(80),
    ]),
    price: this.fb.control('', [Validators.required]),
    location: this.fb.control('', [Validators.required]),
    listingCategoryId: this.fb.control('', [Validators.required]),
    imageBase64Strings: this.fb.array([''], [Validators.required]),
  });

  constructor(
    private listingComService: ListingCreateCommunicationService,
    private listingService: ListingService,
    private messageService: MessageService,
    private router: Router,
    private fb: FormBuilder
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
      imageBase64Strings: this.listingForm.get('imageBase64Strings')?.value,
    };
    
    this.listingAddSubs = this.listingService.add(body).subscribe({
      complete: () => {
        this.listingComService.sendListingData(null);
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
      (resp: ListingAddRequest | null) => {
        if (!resp) {
          this.router.navigate(['/listings/create/general']);
          return;
        }
        this.listingForm.patchValue({
          title: resp.title,
          description: resp.description,
          price: resp.price,
          location: resp.location,
          listingCategoryId: resp.listingCategoryId
        });

        const imagesControl: FormArray = this.listingForm.get(
          'imageBase64Strings'
        ) as FormArray;
        imagesControl.clear();
        const images: string[] = resp.imageBase64Strings;
        images.forEach((image) => {
          imagesControl.push(new FormControl(image));
        });

      }
    );
  }

  previousPage() {
    this.listingForm.reset();
    this.router.navigate(['/listings/create/general']);
  }

  ngOnDestroy() {
    this.listingComService.sendListingData(null);
    this.subs?.unsubscribe();
    this.listingAddSubs?.unsubscribe();
  }
}
