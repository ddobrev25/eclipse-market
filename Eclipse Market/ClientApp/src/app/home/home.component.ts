import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IListingCategories } from '../_models/listing-category.model';
import { IListing, IListingGetRecommended, IListingGetResponse } from '../_models/listing.model';
import { ListingCategoryService } from '../_services/listing-category.service';
import { ListingPreviewService } from '../_services/listing-preview.service';
import { ListingService } from '../_services/listing.service';

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
    // this.randomListingList[0] = {
    //   title: 'Test',
    //   description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Corporis, sit. Repudiandae, doloremque saepe, eaque enim eius recusandae dolore voluptatem perspiciatis labore nisi ab expedita obcaecati consequuntur omnis modi eligendi! Cumque.',
    //   price: 30,
    //   location: 'Gabrovo',
    //   listingCategoryId: 1,
    //   authorId: 1,
    //   views: 12,
    //   timesbookmarked: 3
    // }
    this.randomListingGetSubs = this.listingService.getRecommended(1).subscribe({
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
