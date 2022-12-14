import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ListingCategoryGetAllResponse } from 'src/app/core/models/listing-category.model';
import { ListingCategoryService } from 'src/app/core/services/http/listing-category.service';
import { ListingCreateCommunicationService } from 'src/app/core/services/listing-create.service';

@Component({
  selector: 'app-listing-create-general',
  templateUrl: './listing-create-general.component.html',
  styleUrls: ['./listing-create-general.component.scss'],
})
export class ListingCreateGeneralComponent implements OnInit {
  categorySubs?: Subscription;
  listingCategories?: ListingCategoryGetAllResponse = [];
  remainingCharacters: number = 800;
  textAreaValue: string = '';

  auctionMode: boolean = false;


  createListingForm: FormGroup = this.fb.group({
    title: this.fb.control('', [Validators.required, Validators.maxLength(30), Validators.minLength(3)]),
    description: this.fb.control('', [Validators.required, Validators.maxLength(800), Validators.minLength(80)]),
    price: this.fb.control(''),
    location: this.fb.control('', [Validators.required]),
    listingCategoryId: this.fb.control('', [Validators.required]),
    imageBase64Strings: this.fb.array([''])
  })

  createAuctionForm: FormGroup = new FormGroup({
    title: new FormControl('', [
      Validators.required,
      Validators.maxLength(30),
      Validators.minLength(3),
    ]),
    description: new FormControl('', [
      Validators.required,
      Validators.maxLength(800),
      Validators.minLength(80),
    ]),
    location: new FormControl('', [Validators.required]),
    listingCategoryId: new FormControl('', [Validators.required]),
  });


  constructor(private router: Router,
              private listingComService: ListingCreateCommunicationService,
              private listingCategoryService: ListingCategoryService,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.fetchCategories();
  }
  fetchCategories() {
    this.categorySubs = this.listingCategoryService.getAll().subscribe({
      next: (resp: ListingCategoryGetAllResponse) => {
        this.listingCategories = resp;
        this.listingCategoryService.categories = resp;
      },
    });
  }

  valueChange(textAreaValue: string) {
    this.remainingCharacters = 800 - textAreaValue.length;
  }

  onSelectListing() {
    this.auctionMode = false;
  }
  onSelectAuction() {
    this.auctionMode = true;
  }

  nextPage() {
    this.listingComService.sendListingData(this.createListingForm.value);
    this.router.navigate(['/listings/create/gallery']);
  }

  ngOnDestroy() {
    this.categorySubs?.unsubscribe();
  }
}
