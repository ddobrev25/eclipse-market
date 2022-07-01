import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IListingGetResponse } from 'src/app/_models/listing.model';
import { UserService } from 'src/app/_services/user.service';

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
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.fecthUserListings();
  }
  ngOnChanges() {
    this.fecthUserListings();
  }

  fecthUserListings() {
    this.userListings = this.userService.loggedUser?.currentListings;
  }

  onSelectListing(listing: IListingGetResponse) {
    console.log("listing was selected!")
    this.listingSelected = true;
    this.router.navigate(['/account/listing/preview'])
  }

}
