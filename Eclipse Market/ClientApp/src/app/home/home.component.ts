import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription, take } from "rxjs";
import { ListingCategoryGetAllResponse } from "../core/models/listing-category.model";
import {
  ListingGetAllResponse,
  ListingGetByIdResponse,
  ListingGetRecommendedResponse,
} from "../core/models/listing.model";
import { ListingCategoryService } from "../core/services/http/listing-category.service";
import { ListingService } from "../core/services/http/listing.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  categoryList: ListingCategoryGetAllResponse = [];
  categoryGetSubs?: Subscription;

  randomListingList?: ListingGetRecommendedResponse;
  randomListingGetSubs?: Subscription;
  randomListingByCategoryGetSubs?: Subscription;

  heading: string = "Промо Обяви";

  nodes: any[] = [
    {
      label: "Всичко",
    },
    {
      label: "Търгове",
    },
    {
      label: "Обяви",
    },
  ];
  selectedNode: any;

  constructor(
    private listingCategoryService: ListingCategoryService,
    private listingService: ListingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchCategories();
    this.fetchRandomListings();
  }
  fetchCategories() {
    if (!this.listingCategoryService.categories) {
      this.listingCategoryService
        .getAll()
        .pipe(take(1))
        .subscribe({
          next: (resp: ListingCategoryGetAllResponse) => {
            this.listingCategoryService.categories = resp;
            this.categoryList = resp;
          },
          error: (err) => {
            console.log(err);
          },
        });
    } else {
      this.categoryList = this.listingCategoryService.categories;
    }
  }
  onGetRecommendedByCategoryId(categoryId: number) {
    this.listingService
      .getRecommendedByCategory(4, categoryId)
      .pipe(take(1))
      .subscribe({
        next: (resp: ListingGetRecommendedResponse) => {
          this.heading = "Резултати от търсенето";
          this.randomListingList = resp;
        },
        error: (err) => console.log(err),
      });
  }

  fetchRandomListings() {
    this.listingService
      .getRecommended(4)
      .pipe(take(1))
      .subscribe({
        next: (resp: ListingGetRecommendedResponse) => {
          this.randomListingList = resp;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  onSearch(e: any) {
    let auctionsOnly = null;
    if (this.selectedNode)
      switch (this.selectedNode.label) {
        case "Всичко": {
          auctionsOnly = null;
          break;
        }
        case "Търгове": {
          auctionsOnly = true;
          break;
        }
        case "Обяви": {
          auctionsOnly = false;
          break;
        }
        default: {
          auctionsOnly = null;
          break;
        }
      }
    const query = e.target.value;
    this.listingService
      .search(query, auctionsOnly)
      .pipe(take(1))
      .subscribe({
        next: (resp: ListingGetAllResponse) => {
          console.log(resp);
          this.randomListingList = resp;
          this.heading = "Резултати от търсенето";
        },
        error: (err) => console.log(err),
      });
    console.log(this.selectedNode, auctionsOnly);
  }

  onSelectListing(listingForPreview: ListingGetByIdResponse) {
    this.router.navigate(["/listings/preview"], {
      queryParams: { id: listingForPreview.id },
    });
  }
}
