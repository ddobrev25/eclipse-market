import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from "@angular/forms";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { ListingCategoryGetAllResponse } from "src/app/core/models/listing-category.model";
import { AuctionCreateService } from "src/app/core/services/auction-create.service";
import { ListingCategoryService } from "src/app/core/services/http/listing-category.service";
import { UserService } from "src/app/core/services/http/user.service";
import { ListingCreateCommunicationService } from "src/app/core/services/listing-create.service";
import { UserDataService } from "src/app/core/services/store/user.data.service";

@Component({
  selector: "app-listing-create-general",
  templateUrl: "./listing-create-general.component.html",
  styleUrls: ["./listing-create-general.component.scss"],
})
export class ListingCreateGeneralComponent implements OnInit {

  categorySubs?: Subscription;
  listingCategories?: ListingCategoryGetAllResponse = [];
  remainingCharacters: number = 800;
  textAreaValue: string = "";

  auctionMode: boolean = false;

  createListingForm: FormGroup = this.fb.group({
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
    price: this.fb.control(""),
    location: this.fb.control("", [Validators.required]),
    listingCategoryId: this.fb.control("", [Validators.required]),
    imageBase64Strings: this.fb.array([""]),
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
    price: this.fb.control(""),
    location: this.fb.control("", [Validators.required]),
    listingCategoryId: this.fb.control("", [Validators.required]),
    imageBase64Strings: this.fb.array([""]),
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

  constructor(
    private router: Router,
    private listingComService: ListingCreateCommunicationService,
    private listingCategoryService: ListingCategoryService,
    private fb: FormBuilder,
    private userDataService: UserDataService,
    private auctionCreateService: AuctionCreateService
  ) {}

  ngOnInit() {
    this.fetchCategories();
    if (!this.userDataService.isLoggedIn) this.router.navigate(["/auth"]);
    }
  fetchCategories() {
    this.categorySubs = this.listingCategoryService.getAll().subscribe({
      next: (resp: ListingCategoryGetAllResponse) => {
        this.listingCategories = resp;
        this.listingCategoryService.categories = resp;
      },
    });
  }

  valueChange(textAreaValue: string) {
    this.remainingCharacters = 800 - textAreaValue.length;
  }

  onAuctionMode() {
    this.auctionMode = true;
    this.createAuctionForm.patchValue({
      title: "",
      description: "",
      price: "",
      location: "",
      listingCategoryId: "",
      imageBase64Strings: [""],
      listingId: "",
      expireTime: "", 
      startingPrice: "",
      bidIncrementPercentage: "",
      buyoutPrice: "",
    });
    this.textAreaValue = "";
  }
  onListingMode() {
    this.auctionMode = false;
    this.createListingForm.patchValue({
      title: "",
      description: "",
      price: "",
      location: "",
      listingCategoryId: "",
      imageBase64Strings: [""]
    });
    this.textAreaValue = "";
  }

  nextPage() {
    if (!this.auctionMode) {
      this.listingComService.sendListingData(this.createListingForm.value);
      this.listingComService.isAuction = false;
    } else {
      this.auctionCreateService.setAuctionData(this.createAuctionForm.value);
      this.listingComService.isAuction = true;
    }
    this.router.navigate(["/listings/create/gallery"]);
  }

  ngOnDestroy() {
    this.categorySubs?.unsubscribe();
  }
}
