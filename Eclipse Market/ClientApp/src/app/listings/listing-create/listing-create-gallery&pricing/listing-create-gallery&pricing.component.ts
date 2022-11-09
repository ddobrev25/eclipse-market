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
  // images : string[] = [];


  // myForm = new FormGroup({
  //   name: new FormControl('', [Validators.required, Validators.minLength(3)]),
  //   file: new FormControl('', [Validators.required]),
  //   fileSource: new FormControl('', [Validators.required])
  // });

  // get f(){
  //   return this.myForm.controls;
  // }

  // onFileChange(event:any) {
  //   if (event.target.files && event.target.files[0]) {
  //       var filesAmount = event.target.files.length;
  //       for (let i = 0; i < filesAmount; i++) {
  //               var reader = new FileReader();
  //               reader.onload = (event:any) => {
  //                  this.images.push(event.target.result); 
  //                  this.myForm.patchValue({
  //                     fileSource: this.images
  //                  });
  //               }
  //               reader.readAsDataURL(event.target.files[i]);
  //       }
  //   }
  // }

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
    listingCategoryId: new FormControl('')
  })


  fetchFormData() {
    this.fetchSubs = this.listingComService.listingCreateData.subscribe(
      (resp: IListingAddRequest)  => {
        this.createListingForm.patchValue({
          title: resp.title,
          description: resp.description,
          price: this.createListingForm.get('price')?.value,
          location: resp.location,
          listingCategory: resp.listingCategory
        });
      }
    )
  }

  previousPage() {
    this.router.navigate(['/listings/create/general']);
  }
  nextPage() {
    this.listingComService.sendListingData(this.createListingForm.value);
    this.router.navigate(['/listings/create/preview']);
  }

  ngOnDestroy() {
    this.fetchSubs?.unsubscribe();
  }

}
