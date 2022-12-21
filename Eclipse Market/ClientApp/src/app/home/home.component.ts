import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ListingCategoryGetAllResponse } from '../core/models/listing-category.model';
import { ListingGetByIdResponse, ListingGetRecommendedResponse } from '../core/models/listing.model';
import { ListingCategoryService } from '../core/services/http/listing-category.service';
import { ListingService } from '../core/services/http/listing.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  categoryList: ListingCategoryGetAllResponse = [];
  categoryGetSubs?: Subscription;

  randomListingList?: ListingGetRecommendedResponse;
  randomListingGetSubs?: Subscription;
  randomListingByCategoryGetSubs?: Subscription;



  constructor(private listingCategoryService: ListingCategoryService,
              private listingService: ListingService,
              private router: Router) { }

  ngOnInit(): void {
    this.fetchCategories();
    this.fetchRandomListings();
  }
  fetchCategories() {
    if(!this.listingCategoryService.categories) {
      this.categoryGetSubs = this.listingCategoryService.getAll().subscribe({
        next: (resp: ListingCategoryGetAllResponse) => {
          this.listingCategoryService.categories = resp;
          this.categoryList = resp;
        },
        error: err => {
          console.log(err);
        }
      })
    } else {
      this.categoryList = this.listingCategoryService.categories;
    }
  }

  fetchRandomListings() {
    this.randomListingGetSubs = this.listingService.getRecommended(1).subscribe({
      next: (resp: ListingGetRecommendedResponse) => {
        this.randomListingList = resp;
      },
      error: err => {
        console.log(err);
      }
    })
  }
  onGetRecommendedByCategoryId(categoryId: number) {
    this.randomListingByCategoryGetSubs = this.listingService.getRecommendedByCategory(1, categoryId).subscribe({
      next: (resp: ListingGetRecommendedResponse) => {
        this.randomListingList = resp;
      },
      error: err => console.log(err)
    })
  }


  onSelectListing(listingForPreview: ListingGetByIdResponse) {
    this.router.navigate(['/listings/preview'], {queryParams: {id: listingForPreview.id}})
  }

  ngOnDestroy() {
    this.categoryGetSubs?.unsubscribe();
    this.randomListingByCategoryGetSubs?.unsubscribe();
    this.randomListingGetSubs?.unsubscribe();
  }

}
