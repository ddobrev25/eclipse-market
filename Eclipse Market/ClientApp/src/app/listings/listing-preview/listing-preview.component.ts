import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { IListingGetResponse } from 'src/app/_models/listing.model';
import { ListingService } from 'src/app/_services/listing.service';

@Component({
  selector: 'app-listing-preview',
  templateUrl: './listing-preview.component.html',
  styleUrls: ['./listing-preview.component.scss']
})
export class ListingPreviewComponent implements OnInit {
  selectedListing?: IListingGetResponse;
  selectedListingId: number = 0;
  listingSubs?: Subscription;
  sub?: Subscription;


  remainingCharacters: number = 200;
  textAreaValue: string = '';

  constructor(private listingService: ListingService,
              private route: ActivatedRoute) { }

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

  fetchListingInfo() {
    this.listingSubs = this.listingService.getById(this.selectedListingId).subscribe({
      next: (resp: IListingGetResponse) => {
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
