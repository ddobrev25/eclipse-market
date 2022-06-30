import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

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
              private route: ActivatedRoute) { }




  ngOnInit() {

  }
  onCreateListing() {

  }
  nextPage() {
    this.router.navigate(['/listings/create/preview']);
    console.log(this.route.url)
  }

}
