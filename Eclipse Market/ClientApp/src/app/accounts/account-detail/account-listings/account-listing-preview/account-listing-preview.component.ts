import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('img') imgEl?: ElementRef;

  currentImage?: string;
  selectedListingImages: string[] = [];
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
  onShowImageOverlay(event: any) {
    if(this.selectedListingImages.length <= 1) {
      const smh = event.target.children[1].children[0].children;
      Object.entries(smh).forEach((el: any) => {
        el[1].style.opacity = 0.5;
      });
    }
    event.target.children[0].classList.toggle('show-overlay')
  }
  onNextImage(event: any) {
    const currentImage = this.imgEl?.nativeElement.currentSrc;
    const currentImageIndex = this.selectedListingImages.indexOf(currentImage);
    const nextImage = this.selectedListingImages[currentImageIndex + 1];
    if(currentImageIndex >= this.selectedListingImages.length - 1) {
      this.currentImage = currentImage;
      return;
    }
    event.target.parentElement.children[0].style.opacity = 1;
    if(currentImageIndex + 1 === this.selectedListingImages.length - 1) {
      event.target.style.opacity = 0.5;
      this.currentImage = nextImage;
      return;
    } else {
      event.target.style.opacity = 1;
      this.currentImage = nextImage;
    }
  }


  onPreviousImage(event: any) {
    const currentImage = this.imgEl?.nativeElement.currentSrc;
    const currentImageIndex = this.selectedListingImages.indexOf(currentImage);
    const previousImage = this.selectedListingImages[currentImageIndex - 1];
    if(currentImageIndex - 1 < 0) {
      this.currentImage = currentImage;
      return;
    }
    event.target.nextSibling.style.opacity = 1;
    if(currentImageIndex - 1 === 0) {
      event.target.style.opacity = 0.5;
      this.currentImage = previousImage;
      return;
    }
    event.target.style.opacity = 1;
    this.currentImage = previousImage;
  }

  ngOnDestroy() {
    this.listingSubs?.unsubscribe();
  }
}
