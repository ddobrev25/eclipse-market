import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  FormArray,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ListingAddRequest } from 'src/app/core/models/listing.model';
import { ListingCreateCommunicationService } from 'src/app/core/services/listing-create.service';

@Component({
  selector: 'app-listing-create-gallery&pricing',
  templateUrl: './listing-create-gallery&pricing.component.html',
  styleUrls: ['./listing-create-gallery&pricing.component.scss'],
})
export class ListingCreateGalleryComponent implements OnInit {
  fetchSubs?: Subscription;
  images: string[] = [];

  constructor(
    private router: Router,
    private listingComService: ListingCreateCommunicationService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.fetchFormData();
    this.images = [];
  }

  createListingForm: FormGroup = new FormGroup({
    title: this.fb.control('', [
      Validators.required,
      Validators.maxLength(30),
      Validators.minLength(3),
    ]),
    description: this.fb.control('', [
      Validators.required,
      Validators.maxLength(800),
      Validators.minLength(80),
    ]),
    price: this.fb.control('', [Validators.required]),
    location: this.fb.control('', [Validators.required]),
    listingCategoryId: this.fb.control('', [Validators.required]),
    imageBase64Strings: this.fb.array([''], [Validators.required]),
  });

  fetchFormData() {
    this.fetchSubs = this.listingComService.listingCreateData.subscribe(
      (resp: ListingAddRequest | null) => {
        if (!resp) {
          this.router.navigate(['/listings/create/general']);
          return;
        }
        this.images = resp.imageBase64Strings;
        this.createListingForm.patchValue({
          title: resp.title,
          description: resp.description,
          price: this.createListingForm.get('price')?.value,
          location: resp.location,
          listingCategoryId: resp.listingCategoryId,
          imageBase64Strings: resp.imageBase64Strings,
        });
      }
    );
  }
  getBase64(event: any) {
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (reader.result) this.images.push(reader.result.toString());
    };
    reader.onerror = (error) => console.log('Error: ', error);
    event.target.value = '';
  }

  async setImages() {
    const imagesControl: FormArray = this.createListingForm.get(
      'imageBase64Strings'
    ) as FormArray;
    imagesControl.clear();
    this.images.filter((image) => image);
    this.images.forEach((image) => {
      imagesControl.push(new FormControl(image));
    });
    console.log(this.createListingForm.value)
  }

  previousPage() {
    this.router.navigate(['/listings/create/general']);
  }
  async nextPage() {
    await this.setImages();
    this.listingComService.sendListingData(this.createListingForm.value);
    this.router.navigate(['/listings/create/preview']);
  }


  onMouseOver(event: any) {
    event.target.children[1].classList.toggle('visible');
  }
  onRemoveImage(image: string) {
    const index = this.images.indexOf(image);
    this.images.splice(index, 1);
  }



  ngOnDestroy() {
    this.fetchSubs?.unsubscribe();
  }
}
