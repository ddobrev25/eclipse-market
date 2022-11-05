import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IListingCategories } from '../core/models/listing-category.model';
import { IListingGetRecommended, IListing } from '../core/models/listing.model';
import { ListingCategoryService } from '../core/services/listing-category.service';
import { ListingService } from '../core/services/listing.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  categoryList: IListingCategories = [];
  categoryGetSubs?: Subscription;

  randomListingList?: IListingGetRecommended;
  randomListingGetSubs?: Subscription;


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
        next: (resp: IListingCategories) => {
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
    this.randomListingGetSubs = this.listingService.getRecommended(5).subscribe({
      next: (resp: IListingGetRecommended) => {
        this.randomListingList = resp;
      },
      error: err => {
        console.log(err);
      }
    })
  }

  onSelectListing(listingForPreview: IListing) {
    this.router.navigate(['/listings/preview'], {queryParams: {id: listingForPreview.id}})
  }

  ngOnDestroy() {
    this.categoryGetSubs?.unsubscribe();
    this.randomListingGetSubs?.unsubscribe();
  }

}
