import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IListingGetResponse } from 'src/app/core/models/listing.model';
import { ListingPreviewService } from 'src/app/core/services/listing-preview.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-account-listings',
  templateUrl: './account-listings.component.html',
  styleUrls: ['./account-listings.component.scss']
})
export class AccountListingsComponent implements OnInit {
  userListings?: IListingGetResponse[];
  listingSelected: boolean = false;

  constructor(private userService: UserService,
              private router: Router,
              private listingPreviewService: ListingPreviewService) { }

  ngOnInit(): void {
    this.fecthUserListings();
  }

  fecthUserListings() {
    this.userListings = this.userService.loggedUser?.currentListings;
  }

  onSelectListing(id: number) {
    this.listingPreviewService.sendListingId(id);
    this.listingSelected = true;
    this.router.navigate(['/account/listing/preview'])
  }

}
