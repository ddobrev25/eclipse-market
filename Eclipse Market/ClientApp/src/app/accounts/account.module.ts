import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AccountBookmarksComponent } from './account-detail/account-bookmarks/account-bookmarks.component';
import { AccountDetailComponent } from './account-detail/account-detail.component';
import { AccountInfoComponent } from './account-detail/account-info/account-info.component';
import { AccountListingsComponent } from './account-detail/account-listings/account-listings.component';
import { AccountMessagesComponent } from './account-detail/account-messages/account-messages.component';
import { AccountSettingsComponent } from './account-detail/account-settings/account-settings.component';
import { AccountRoutingModule } from './account-routing.module';
import { AdminListingCategoriesComponent } from './admin-panel/admin-listing-categories/admin-listing-categories.component';
import { AdminManageComponent } from './admin-panel/admin-manage/admin-manage.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { AdminRolesComponent } from './admin-panel/admin-roles/admin-roles.component';

@NgModule({
  declarations: [
    AccountListingsComponent,
    AccountMessagesComponent,
    AccountSettingsComponent,
    AccountInfoComponent,
    AccountDetailComponent,
    AdminPanelComponent,
    AdminManageComponent,
    AdminRolesComponent,
    AdminListingCategoriesComponent,
    AccountBookmarksComponent,
    AccountBookmarksComponent,
  ],
  imports: [SharedModule, AccountRoutingModule, RouterModule],
  exports: [
    SharedModule,
    AccountListingsComponent,
    AccountMessagesComponent,
    AccountSettingsComponent,
    AccountInfoComponent,
    AccountDetailComponent,
    AccountRoutingModule,
    AdminPanelComponent,
    AdminManageComponent,
    AdminRolesComponent,
    AdminListingCategoriesComponent,
    AccountBookmarksComponent,
  ],
})
export class AccountModule {}
