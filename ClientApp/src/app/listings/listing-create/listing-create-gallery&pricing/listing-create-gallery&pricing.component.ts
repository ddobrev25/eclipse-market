import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  FormArray,
} from "@angular/forms";
import { Router } from "@angular/router";
import { ReplaySubject, takeUntil } from "rxjs";
import { Auction$ } from "src/app/core/models/auction.model";
import { ListingAddRequest } from "src/app/core/models/listing.model";
import { AuctionCreateService } from "src/app/core/services/auction-create.service";
import { ListingCreateCommunicationService } from "src/app/core/services/listing-create.service";

@Component({
  selector: "app-listing-create-gallery&pricing",
  templateUrl: "./listing-create-gallery&pricing.component.html",
  styleUrls: ["./listing-create-gallery&pricing.component.scss"],
})
export class ListingCreateGalleryComponent implements OnInit {
  images: string[] = [];
  isAuction: boolean = false;
  destroy$: ReplaySubject<void> = new ReplaySubject<void>(1);

  constructor(
    private router: Router,
    private listingComService: ListingCreateCommunicationService,
    private auctionCreateService: AuctionCreateService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.fetchFormData();
    this.images = [];
    this.isAuction = this.listingComService.isAuction;
  }

  createListingForm: FormGroup = new FormGroup({
    title: this.fb.control("", [
      Validators.required,
      Validators.maxLength(30),
      Validators.minLength(3),
    ]),
    description: this.fb.control("", [
      Validators.required,
      Validators.maxLength(800),
      Validators.minLength(80),
    ]),
    price: this.fb.control("", [Validators.required]),
    location: this.fb.control("", [Validators.required]),
    listingCategoryId: this.fb.control("", [Validators.required]),
    imageBase64Strings: this.fb.array([""], [Validators.required]),
  });

  createAuctionForm: FormGroup = this.fb.group({
    title: this.fb.control("", [
      Validators.required,
      Validators.maxLength(30),
      Validators.minLength(3),
    ]),
    description: this.fb.control("", [
      Validators.required,
      Validators.maxLength(800),
      Validators.minLength(80),
    ]),
    price: this.fb.control(0),
    location: this.fb.control("", [Validators.required]),
    listingCategoryId: this.fb.control("", [Validators.required]),
    imageBase64Strings: this.fb.array([""], [Validators.required]),
    listingId: this.fb.control(""),
    expireTime: this.fb.control("", [Validators.required]),
    startingPrice: this.fb.control("", [Validators.required]),
    bidIncrementPercentage: this.fb.control("", [
      Validators.required,
      Validators.min(5),
      Validators.max(15),
    ]),
    buyoutPrice: this.fb.control("", [Validators.required]),
  });

  fetchFormData() {
    if (!this.listingComService.isAuction)
      this.listingComService.listingCreateData
        .pipe(takeUntil(this.destroy$))
        .subscribe((resp: ListingAddRequest | null) => {
          if (!resp) {
            this.router.navigate(["/listings/create/general"]);
            return;
          }
          this.images = resp.imageBase64Strings;
          this.createListingForm.patchValue({
            title: resp.title,
            description: resp.description,
            price: this.createListingForm.get("price")?.value,
            location: resp.location,
            listingCategoryId: resp.listingCategoryId,
            imageBase64Strings: resp.imageBase64Strings,
          });
        });
    else {
      this.auctionCreateService.auctionData
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (resp: Auction$ | null) => {
            if (!resp) {
              this.router.navigate(["/listings/create/general"]);
              return;
            }
            this.images = resp.imageBase64Strings;
            this.createAuctionForm.patchValue({
              title: resp.title,
              description: resp.description,
              price: this.createAuctionForm.get("price")?.value,
              location: resp.location,
              listingCategoryId: resp.listingCategoryId,
              imageBase64Strings: resp.imageBase64Strings,
              listingId: resp.listingId,
              expireTime: resp.expireTime,
              startingPrice: resp.startingPrice,
              bidIncrementPercentage: resp.bidIncrementPercentage,
              buyoutPrice: resp.buyoutPrice,
            });
            console.log(this.createAuctionForm.value);
          },
        });
    }
  }
  getBase64(event: any) {
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (reader.result) this.images.push(reader.result.toString());
    };
    reader.onerror = (error) => console.log("Error: ", error);
    event.target.value = "";
  }

  async setImages(listingType: "LISTING" | "AUCTION") {
    let imagesControl: FormArray;
    if (listingType === "LISTING")
      imagesControl = this.createListingForm.get(
        "imageBase64Strings"
      ) as FormArray;
    else
      imagesControl = this.createAuctionForm.get(
        "imageBase64Strings"
      ) as FormArray;

    imagesControl.clear();
    this.images.filter((image) => image);
    this.images.forEach((image) => {
      imagesControl.push(new FormControl(image));
    });
  }

  previousPage() {
    this.router.navigate(["/listings/create/general"]);
  }
  async nextPage() {
    const listingType = this.listingComService.isAuction
      ? "AUCTION"
      : "LISTING";
    await this.setImages(listingType);

    if (listingType === "LISTING") {
      this.listingComService.sendListingData(this.createListingForm.value);
    } else {
      this.auctionCreateService.setAuctionData(this.createAuctionForm.value);
    }
    this.router.navigate(["/listings/create/preview"]);
  }

  onMouseOver(event: any) {
    event.target.children[1].classList.toggle("visible");
  }
  onRemoveImage(image: string) {
    const index = this.images.indexOf(image);
    this.images.splice(index, 1);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
