import { Component, OnInit } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { concatMap, EMPTY, of, ReplaySubject, takeUntil } from "rxjs";
import { ListingCreateCommunicationService } from "src/app/core/services/listing-create.service";
import { ListingService } from "src/app/core/services/http/listing.service";
import { ListingAddRequest } from "src/app/core/models/listing.model";
import { AuctionCreateService } from "src/app/core/services/auction-create.service";
import {
  Auction$,
  AuctionCreateRequest,
} from "src/app/core/models/auction.model";
import { AuctionService } from "src/app/core/services/http/auction.service";

@Component({
  selector: "app-listing-create-preview",
  templateUrl: "./listing-create-preview.component.html",
  styleUrls: ["./listing-create-preview.component.scss"],
})
export class ListingCreatePreviewComponent implements OnInit {
  destroy$: ReplaySubject<void> = new ReplaySubject<void>(1);
  isAuction: boolean = false;

  listingForm: FormGroup = new FormGroup({
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

  auctionForm: FormGroup = this.fb.group({
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
    listingId: this.fb.control(""),
    expireTime: this.fb.control("", [Validators.required]),
    startingPrice: this.fb.control("", [Validators.required]),
    bidIncrementPercentage: this.fb.control("", [
      Validators.required,
      Validators.min(5),
      Validators.max(15),
    ]),
    buyOutPrice: this.fb.control("", [Validators.required]),
  });

  constructor(
    private listingComService: ListingCreateCommunicationService,
    private listingService: ListingService,
    private messageService: MessageService,
    private router: Router,
    private fb: FormBuilder,
    private auctionCreateService: AuctionCreateService,
    private auctionService: AuctionService
  ) {}

  ngOnInit(): void {
    this.fetchFormData();
  }

  onCreateListing() {
    const sourceForm = this.listingComService.isAuction
      ? this.auctionForm
      : this.listingForm;

    const listingBody: ListingAddRequest = {
      title: sourceForm.get("title")?.value,
      description: sourceForm.get("description")?.value,
      price: sourceForm.get("price")?.value,
      location: sourceForm.get("location")?.value,
      listingCategoryId: sourceForm.get("listingCategoryId")?.value,
      imageBase64Strings: sourceForm.get("imageBase64Strings")?.value,
    };

    this.listingService
      .add(listingBody)
      .pipe(
        takeUntil(this.destroy$),
        concatMap((listingId: number) => {
          if (this.listingComService.isAuction) {
            const auctionBody: AuctionCreateRequest = {
              listingId: listingId,
              expireTime: sourceForm.get("expireTime")?.value,
              startingPrice: sourceForm.get("startingPrice")?.value,
              bidIncrementPercentage: sourceForm.get("bidIncrementPercentage")
                ?.value,
              buyoutPrice: sourceForm.get("buyoutPrice")?.value,
            };
            return this.auctionService.create(auctionBody);
          } else return EMPTY;
        })
      )
      .subscribe({
        complete: () => {
          const createdMessage = this.isAuction ? "Търгът е добавен успешно!" : "Обявата е добавена успешно!";
          this.messageService.add({
            key: "tc",
            severity: "success",
            detail: createdMessage,
            life: 3000,
          });
          this.router.navigate(["/home"]);
        },
        error: (err) => console.log(err),
      });

  }

  fetchFormData() {
    if (!this.listingComService.isAuction) {
      this.listingComService.listingCreateData
        .pipe(takeUntil(this.destroy$))
        .subscribe((resp: ListingAddRequest | null) => {
          if (!resp) {
            this.router.navigate(["/listings/create/general"]);
            return;
          }
          this.listingForm.patchValue({
            title: resp.title,
            description: resp.description,
            price: resp.price,
            location: resp.location,
            listingCategoryId: resp.listingCategoryId,
          });
          this.setImages(resp.imageBase64Strings);
        });
    } else {
      this.isAuction = true;
      this.auctionCreateService.auctionData
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (resp: Auction$ | null) => {
            if (!resp) {
              this.router.navigate(["/listings/create/general"]);
              return;
            }
            this.auctionForm.patchValue({
              title: resp.title,
              description: resp.description,
              price: resp.price,
              location: resp.location,
              listingCategoryId: resp.listingCategoryId,
              imageBase64Strings: resp.imageBase64Strings,
              listingId: resp.listingId,
              expireTime: resp.expireTime,
              startingPrice: resp.startingPrice,
              bidIncrementPercentage: resp.bidIncrementPercentage,
              buyoutPrice: resp.buyoutPrice,
            });
            this.setImages(resp.imageBase64Strings);
            console.log(this.auctionForm.value);
          },
        });
    }
  }

  private setImages(respImgs: string[]) {
    let imagesControl: FormArray;
    if (!this.listingComService.isAuction)
      imagesControl = this.listingForm.get("imageBase64Strings") as FormArray;
    else
      imagesControl = this.auctionForm.get("imageBase64Strings") as FormArray;

    imagesControl.clear();
    const images: string[] = respImgs;
    images.forEach((image) => {
      imagesControl.push(new FormControl(image));
    });
  }

  previousPage() {
    this.listingForm.reset();
    this.auctionForm.reset();
    this.router.navigate(["/listings/create/general"]);
  }

  ngOnDestroy() {
    this.listingComService.sendListingData(null);
    this.auctionCreateService.setAuctionData(null);
    this.destroy$.next();
    this.destroy$.complete();
  }
}
