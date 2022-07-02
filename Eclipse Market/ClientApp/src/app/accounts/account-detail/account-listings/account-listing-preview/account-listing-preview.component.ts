import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IListingGetResponse } from 'src/app/_models/listing.model';
import { ListingPreviewService } from 'src/app/_services/listing-preview.service';
import { ListingService } from 'src/app/_services/listing.service';

@Component({
  selector: 'app-account-listing-preview',
  templateUrl: './account-listing-preview.component.html',
  styleUrls: ['./account-listing-preview.component.scss']
})
export class AccountListingPreviewComponent implements OnInit {
  listingSubs?: Subscription;
  selectedListing?: IListingGetResponse;

  constructor(private router: Router,
              private listingPreviewService: ListingPreviewService,
              private listingService: ListingService) { }

  ngOnInit(): void {
    this.fetchListingInfo();
  }

  fetchListingInfo() {
    const id = this.listingPreviewService.listingPreviewId.getValue();
    this.listingSubs = this.listingService.getById(id).subscribe({
      next: (resp: IListingGetResponse) => {
        this.selectedListing = resp;
      },
      error: err => {
        console.log(err)
      }
    });
  }

  ngOnDestroy() {
    this.listingSubs?.unsubscribe();
  }
}
