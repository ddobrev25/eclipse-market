import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IListingCategories } from '../_models/listing-category.model';
import { ListingCategoryService } from '../_services/listing-category.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  categoryList: IListingCategories = [];

  categoryGetSubs?: Subscription;

  constructor(private listingCategoryService: ListingCategoryService) { }

  ngOnInit(): void {
    this.fetchCategories();
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

}
