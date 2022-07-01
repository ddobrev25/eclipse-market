import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { IListingCategories } from 'src/app/_models/listing-category.model';
import { ListingCategoryService } from 'src/app/_services/listing-category.service';
import { ListingCreateCommunicationService } from 'src/app/_services/listing-create.service';

@Component({
  selector: 'app-listing-create-general',
  templateUrl: './listing-create-general.component.html',
  styleUrls: ['./listing-create-general.component.scss']
})
export class ListingCreateGeneralComponent implements OnInit {
  categorySubs?: Subscription;
  listingCategories?: IListingCategories = [];
  remainingCharacters: number = 800;
  textAreaValue: string = '';


  createListingForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.maxLength(30), Validators.minLength(3)]),
    description: new FormControl('', [Validators.required, Validators.maxLength(800), Validators.minLength(80)]),
    price: new FormControl('', [Validators.required]),
    location: new FormControl('', [Validators.required]),
    listingCategoryId: new FormControl('', [Validators.required])
  })

  constructor(private router: Router,
              private listingComService: ListingCreateCommunicationService,
              private listingCategoryService: ListingCategoryService,
              private messageService: MessageService) { }

  ngOnInit() {
    this.fetchCategories();
  }
  fetchCategories() {
    this.categorySubs = this.listingCategoryService.getAll().subscribe({
      next: (resp: IListingCategories) => {
        this.listingCategories = resp;
      }
    })
  }

  valueChange(textAreaValue: string) {
    this.remainingCharacters = 800 - textAreaValue.length;
  }

  nextPage() {
    this.listingComService.sendListingData(this.createListingForm.value);
    this.router.navigate(['/listings/create/preview']);
  }

  ngOnDestroy() {
    this.categorySubs?.unsubscribe();
  }

}
