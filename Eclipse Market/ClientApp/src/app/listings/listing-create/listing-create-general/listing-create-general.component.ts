import { Component, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ListingCreateCommunicationService } from 'src/app/_services/listing-create.service';

@Component({
  selector: 'app-listing-create-general',
  templateUrl: './listing-create-general.component.html',
  styleUrls: ['./listing-create-general.component.scss']
})
export class ListingCreateGeneralComponent implements OnInit {

  createListingForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    price: new FormControl('', [Validators.required]),
    location: new FormControl('', [Validators.required]),
    listingCategoryId: new FormControl('', [Validators.required])
  })

  constructor(private router: Router,
              private listingComService: ListingCreateCommunicationService) { }

  ngOnInit() {

  }
  onCreateListing() {

  }
  nextPage() {
    this.listingComService.sendListingData(this.createListingForm.value);
    this.router.navigate(['/listings/create/preview']);
  }

}
