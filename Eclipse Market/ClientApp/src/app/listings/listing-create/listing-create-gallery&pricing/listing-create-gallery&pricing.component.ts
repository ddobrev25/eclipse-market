import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IListingAddRequest } from 'src/app/core/models/listing.model';
import { ListingCreateCommunicationService } from 'src/app/core/services/listing-create.service';

@Component({
  selector: 'app-listing-create-gallery&pricing',
  templateUrl: './listing-create-gallery&pricing.component.html',
  styleUrls: ['./listing-create-gallery&pricing.component.scss']
})
export class ListingCreateGalleryComponent implements OnInit {
  fetchSubs?: Subscription;
  imageAsBase64?: string;

  getBase64(event: any) {
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      //me.modelvalue = reader.result;
      this.imageAsBase64 = reader.result?.toString();
      console.log(this.imageAsBase64);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
 }


  constructor(private router: Router,
              private listingComService: ListingCreateCommunicationService) { }

  ngOnInit(): void {
    this.fetchFormData();
  }

  createListingForm: FormGroup = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    price: new FormControl('', [Validators.required]),
    location: new FormControl(''),
    listingCategoryId: new FormControl(''),
    imageBase64String: new FormControl('')
  })


  fetchFormData() {
    this.fetchSubs = this.listingComService.listingCreateData.subscribe(
      (resp: IListingAddRequest)  => {
        this.createListingForm.patchValue({
          title: resp.title,
          description: resp.description,
          price: this.createListingForm.get('price')?.value,
          location: resp.location,
          listingCategoryId: resp.listingCategoryId,
          imageBase64String: this.imageAsBase64
        });
      }
    )
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
