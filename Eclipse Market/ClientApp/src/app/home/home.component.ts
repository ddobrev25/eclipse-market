import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IListingCategories } from '../_models/listing-category.model';
import { IListing, IListingGetResponse } from '../_models/listing.model';
import { ListingCategoryService } from '../_services/listing-category.service';
import { ListingPreviewService } from '../_services/listing-preview.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  categoryList: IListingCategories = [];
  categoryGetSubs?: Subscription;

  randomListingList: IListingGetResponse[] = [];

  constructor(private listingCategoryService: ListingCategoryService,
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
    this.randomListingList[0] = {
      title: 'Test',
      description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Corporis, sit. Repudiandae, doloremque saepe, eaque enim eius recusandae dolore voluptatem perspiciatis labore nisi ab expedita obcaecati consequuntur omnis modi eligendi! Cumque.',
      price: 30,
      location: 'Gabrovo',
      listingCategoryId: 1,
      authorId: 1,
      views: 12,
      timesbookmarked: 3
    }
  }

  onSelectListing(listingForPreview: IListing) {
    this.router.navigate(['/listings/preview'], {queryParams: {id: 1}})
  }

}
