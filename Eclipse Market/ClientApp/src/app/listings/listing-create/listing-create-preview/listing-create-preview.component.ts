import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IListingAddRequest } from 'src/app/_models/listing.model';
import { ListingCreateCommunicationService } from 'src/app/_services/listing-create.service';
import { ListingService } from 'src/app/_services/listing.service';

@Component({
  selector: 'app-listing-create-preview',
  templateUrl: './listing-create-preview.component.html',
  styleUrls: ['./listing-create-preview.component.scss']
})
export class ListingCreatePreviewComponent implements OnInit {
  subs?: Subscription;
  listingAddSubs?: Subscription;
  listingForCreation: any;

  listingForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    price: new FormControl('', [Validators.required]),
    location: new FormControl('', [Validators.required]),
    listingCategoryId: new FormControl('', [Validators.required])
  })
  
  constructor(private listingComService: ListingCreateCommunicationService,
              private listingService: ListingService) { }

  ngOnInit(): void {
    this.subs = this.listingComService.listingCreateData.subscribe(
      (resp: IListingAddRequest)  => {
        this.listingForm.patchValue({
          title: resp.title,
          description: resp.description,
          price: resp.price,
          location: resp.location,
          listingCategoryId: resp.listingCategoryId
        });
      }
    )
    console.log(this.listingForm);
  }

  transformListing() {
    return {
      title: this.listingForm.get('title')?.value
    }
  }

  onCreateListing() {
    const body = {
      'Title': this.listingForm.get('title')?.value,
      'Description': this.listingForm.get('description')?.value,
      'Price': this.listingForm.get('price')?.value,
      'Location': this.listingForm.get('location')?.value,
      'ListingCategoryId': 1
    }
    console.log(body);
    this.listingAddSubs = this.listingService.add(body).subscribe({
      complete: () => {
        console.log("Listing Added!")
      },
      error: err => {
        console.log(err)
      }
    });

  }

  ngOnDestroy() {
    this.subs?.unsubscribe();
    this.listingAddSubs?.unsubscribe();
  }

}
