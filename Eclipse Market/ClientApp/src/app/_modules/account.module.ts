import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AccountBookmarksComponent } from "../accounts/account-bookmarks/account-bookmarks.component";
import { AccountDetailComponent } from "../accounts/account-detail/account-detail.component";
import { AccountInfoComponent } from "../accounts/account-detail/account-info/account-info.component";
import { AccountListingPreviewComponent } from "../accounts/account-detail/account-listings/account-listing-preview/account-listing-preview.component";
import { AccountListingsComponent } from "../accounts/account-detail/account-listings/account-listings.component";
import { AccountMessagesComponent } from "../accounts/account-detail/account-messages/account-messages.component";
import { AccountSettingsComponent } from "../accounts/account-detail/account-settings/account-settings.component";
import { AdminListingCategoriesComponent } from "../accounts/admin-panel/admin-listing-categories/admin-listing-categories.component";
import { AdminManageComponent } from "../accounts/admin-panel/admin-manage/admin-manage.component";
import { AdminPanelComponent } from "../accounts/admin-panel/admin-panel.component";
import { AdminRolesComponent } from "../accounts/admin-panel/admin-roles/admin-roles.component";
import { SharedModule } from "../_shared/shared.module";
import { AccountRoutingModule } from "./account-routing.module";

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
        AccountListingPreviewComponent,
        AdminListingCategoriesComponent,
        AccountBookmarksComponent,
    ],
    imports: [
        SharedModule,
        AccountRoutingModule,
        RouterModule
    ],
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
        AccountListingPreviewComponent,
        AdminListingCategoriesComponent,
        AccountBookmarksComponent,
    ]
})
export class AccountModule {}
