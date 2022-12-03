import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ListingPreviewService } from 'src/app/core/services/listing-preview.service';
import { ListingService } from 'src/app/core/services/http/listing.service';
import { ListingGetByIdResponse, ListingGetByIdWithAuthorResponse } from 'src/app/core/models/listing.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-listing-preview',
  templateUrl: './account-listing-preview.component.html',
  styleUrls: ['./account-listing-preview.component.scss'],
})
export class AccountListingPreviewComponent implements OnInit {
  listingSubs?: Subscription;
  selectedListing?: ListingGetByIdWithAuthorResponse;

  remainingCharacters: number = 200;
  textAreaValue: string = '';

  constructor(
    private listingPreviewService: ListingPreviewService,
    private listingService: ListingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchListingInfo();
  }

  fetchListingInfo() {
    const id = this.listingPreviewService.listingPreviewId.getValue();
    if(!id) {
      this.router.navigate(['/home']);
      
    }
    this.listingSubs = this.listingService.getById(id).subscribe({
      next: (resp: ListingGetByIdResponse | ListingGetByIdWithAuthorResponse) => {
        console.log(resp);
        if(!('author' in resp)) return;
        this.selectedListing = resp;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  fetchCategories() {}

  valueChange(textAreaValue: string) {
    this.remainingCharacters = 200 - textAreaValue.length;
  }

  ngOnDestroy() {
    this.listingSubs?.unsubscribe();
  }
}
