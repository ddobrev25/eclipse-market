import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-listing-preview',
  templateUrl: './account-listing-preview.component.html',
  styleUrls: ['./account-listing-preview.component.scss']
})
export class AccountListingPreviewComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  ngOnDestroy() {
    this.router.navigate(['/account/listings'])
  }
}
