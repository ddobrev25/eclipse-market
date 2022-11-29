import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import {
  AdminDataCategories$,
} from 'src/app/core/models/admin.model';
import {
  ListingCategoryAddRequest,
  ListingCategoryGetAllResponse,
  ListingCategoryGetByIdResponse,
} from 'src/app/core/models/listing-category.model';
import { DeleteRequest } from 'src/app/core/models/user.model';
import { ListingCategoryService } from 'src/app/core/services/http/listing-category.service';
import { AdminDataService } from 'src/app/core/services/store/admin.data.service';

@Component({
  selector: 'app-admin-listing-categories',
  templateUrl: './admin-listing-categories.component.html',
  styleUrls: ['./admin-listing-categories.component.scss'],
})
export class AdminListingCategoriesComponent implements OnInit {
  @ViewChild('ct') categoriesTable!: any;

  categoryList?: ListingCategoryGetAllResponse;
  categoryAddDialog?: boolean;
  categoryEditDialog?: boolean;
  categoriesChanged: boolean = false;

  categoryGetSubs?: Subscription;
  categoryFetchSubs?: Subscription;
  categoryAddSubs?: Subscription;
  categoryEditSubs?: Subscription;
  categoryDeleteSubs?: Subscription;

  constructor(
    private listingCategoryService: ListingCategoryService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private adminDataService: AdminDataService
  ) {}

  ngOnInit() {
    this.fetchCategories();
    this.categoryAddDialog = false;
    this.categoryEditDialog = false;
  }

  applyFilterGlobal($event: Event, stringVal: any) {
    this.categoriesTable.filterGlobal(
      ($event.target as HTMLInputElement).value,
      stringVal
    );
  }

  categoryForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    title: new FormControl('', [Validators.required]),
  });

  fetchCategories() {
    this.categoryGetSubs = this.adminDataService.categories.subscribe({
      next: (data: AdminDataCategories$) => {
        if (data) {
          this.categoryList = data;
        } else {
          this.fetchCategoriesFromService();
        }
      },
    });
  }

  fetchCategoriesFromService() {
    this.categoryFetchSubs = this.listingCategoryService.getAll().subscribe({
      next: (resp: ListingCategoryGetAllResponse) => {
        this.categoryList = resp;
        this.adminDataService.setCategories(resp);
      },
    });
  }

  onToggleCategoryAddDialog() {
    this.categoryAddDialog = true;
    this.categoryForm.reset();
  }

  onAddCategory() {
    const body: ListingCategoryAddRequest = {
      title: this.categoryForm.get('title')?.value,
    };
    this.categoryAddSubs = this.listingCategoryService.add(body).subscribe({
      complete: () => {
        this.categoriesChanged = true;
        this.messageService.add({
          severity: 'success',
          detail: 'Категорията е добавена успешно!',
          life: 3000,
        });
        this.fetchCategories();
        this.categoryAddDialog = false;
      },
      error: (err) => console.log(err),
    });
  }

  onDiscard() {
    this.categoryAddDialog = false;
    this.categoryEditDialog = false;
  }

  onToggleCategoryEditDialog(categoryForEdit: ListingCategoryGetByIdResponse) {
    this.categoryEditDialog = true;
    this.categoryForm.patchValue({
      id: categoryForEdit.id,
      title: categoryForEdit.title,
    });
  }

  onEditCategory() {
    const body = {
      id: this.categoryForm.get('id')?.value,
      title: this.categoryForm.get('title')?.value,
    };
    this.categoryEditSubs = this.listingCategoryService.update(body).subscribe({
      complete: () => {
        this.messageService.add({
          severity: 'success',
          detail: 'Промените са запазени!',
          life: 3000,
        });
        this.categoryEditDialog = false;
        this.categoriesChanged = true;
        this.fetchCategories();
      },
      error: (err) => console.log(err),
    });
  }

  onDeleteCategory(categoryForDelete: ListingCategoryGetByIdResponse) {
    const body: DeleteRequest = {
      id: categoryForDelete.id,
    };
    this.confirmationService.confirm({
      message: `Сигурнили сте, че искате да изтриете ${categoryForDelete.title} ?`,
      header: 'Потвърди',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Да',
      rejectLabel: 'Не',
      accept: () => {
        this.categoryDeleteSubs = this.listingCategoryService
          .delete(body)
          .subscribe({
            complete: () => {
              this.categoriesChanged = true;
              this.messageService.add({
                severity: 'success',
                detail: 'Категорията е изтрита успешно!',
                life: 3000,
              });
              this.fetchCategories();
            },
            error: (err) => console.log(err),
          });
      },
    });
  }

  ngOnDestroy(): void {
    this.categoryGetSubs?.unsubscribe();
    this.categoryFetchSubs?.unsubscribe();
    this.categoryAddSubs?.unsubscribe();
    this.categoryEditSubs?.unsubscribe();
    this.categoryDeleteSubs?.unsubscribe();
  }
}
