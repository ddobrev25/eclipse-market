import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ListingAddRequest } from 'src/app/core/models/listing.model';
import { ListingCreateCommunicationService } from 'src/app/core/services/listing-create.service';

@Component({
  selector: 'app-listing-create-gallery&pricing',
  templateUrl: './listing-create-gallery&pricing.component.html',
  styleUrls: ['./listing-create-gallery&pricing.component.scss'],
})
export class ListingCreateGalleryComponent implements OnInit {
  fetchSubs?: Subscription;
  imageAsBase64?: string;

  getBase64(event: any) {
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.imageAsBase64 = reader.result?.toString();
    };
    reader.onerror = (error) => console.log('Error: ', error);
  }

  constructor(
    private router: Router,
    private listingComService: ListingCreateCommunicationService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.fetchFormData();
  }

  createListingForm: FormGroup = this.fb.group({
    title: this.fb.control(''),
    description: this.fb.control(''),
    price: this.fb.control('', [Validators.required]),
    location: this.fb.control(''),
    listingCategoryId: this.fb.control(''),
    imageBase64String: this.fb.array([])
  });

  fetchFormData() {
    this.fetchSubs = this.listingComService.listingCreateData.subscribe(
      (resp: ListingAddRequest) => {
        //need to fix
        const imageArr: string[] = [];
        if(this.imageAsBase64) {
          imageArr.push(this.imageAsBase64);
        }
        this.createListingForm.patchValue({
          title: resp.title,
          description: resp.description,
          price: this.createListingForm.get('price')?.value,
          location: resp.location,
          listingCategoryId: resp.listingCategoryId,
          imageBase64String: [
            '3431'
          ],
        });
      }
    );
  }

  previousPage() {
    this.router.navigate(['/listings/create/general']);
  }
nextPage() {
    this.fetchFormData();
    
    this.listingComService.sendListingData(this.createListingForm.value);
    this.router.navigate(['/listings/create/preview']);
  }

  ngOnDestroy() {
    this.fetchSubs?.unsubscribe();
  }
}
