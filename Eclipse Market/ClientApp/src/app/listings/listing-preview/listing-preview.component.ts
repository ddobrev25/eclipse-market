import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IListingGetByIdResponse, IListingGetResponse } from 'src/app/_models/listing.model';
import { ListingService } from 'src/app/_services/listing.service';
import { UserListingsService } from 'src/app/_services/user-listings.service';

@Component({
  selector: 'app-listing-preview',
  templateUrl: './listing-preview.component.html',
  styleUrls: ['./listing-preview.component.scss']
})
export class ListingPreviewComponent implements OnInit {
  selectedListing?: IListingGetByIdResponse;
  selectedListingId: number = 0;
  listingSubs?: Subscription;
  sub?: Subscription;


  remainingCharacters: number = 200;
  textAreaValue: string = '';

  constructor(private listingService: ListingService,
              private route: ActivatedRoute,
              private router: Router,
              private userListingsService: UserListingsService) { }

  ngOnInit(): void {
    this.fetchQueryParams();
  }

  fetchQueryParams() {
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        this.selectedListingId = params['id'];
        this.fetchListingInfo();
      });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  onLoadUserListings() {
      this.userListingsService.next(this.selectedListing?.author!)
      this.router.navigate(['/listings/user'])
  }

  fetchListingInfo() {
    this.listingSubs = this.listingService.getById(this.selectedListingId).subscribe({
      next: (resp: IListingGetByIdResponse) => {
        this.selectedListing = resp;
      },
      error: err => {
        console.log(err);
      }
    })
  }

  valueChange(textAreaValue: string) {
    this.remainingCharacters = 200 - textAreaValue.length;
  }

}
