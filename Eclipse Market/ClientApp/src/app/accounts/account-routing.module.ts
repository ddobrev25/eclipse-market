import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AccountBookmarksComponent } from "./account-detail/account-bookmarks/account-bookmarks.component";
import { AccountDetailComponent } from "./account-detail/account-detail.component";
import { AccountInfoComponent } from "./account-detail/account-info/account-info.component";
import { AccountListingPreviewComponent } from "./account-detail/account-listings/account-listing-preview/account-listing-preview.component";
import { AccountListingsComponent } from "./account-detail/account-listings/account-listings.component";
import { AccountMessagesComponent } from "./account-detail/account-messages/account-messages.component";
import { AccountSettingsComponent } from "./account-detail/account-settings/account-settings.component";
import { AdminListingCategoriesComponent } from "./admin-panel/admin-listing-categories/admin-listing-categories.component";
import { AdminManageComponent } from "./admin-panel/admin-manage/admin-manage.component";
import { AdminPanelComponent } from "./admin-panel/admin-panel.component";
import { AdminRolesComponent } from "./admin-panel/admin-roles/admin-roles.component";
import { AccountListingsGuardService } from "../core/guards/account-listing.guard.service";
import { AccountGuardService } from "../core/guards/account.guard.service";
import { AdminGuard } from "../core/guards/admin.guard.service";
import { AccountListingUpdateComponent } from "./account-detail/account-listings/account-listing-update/account-listing-update.component";

const routes: Routes = [
    { path: '', component: AccountDetailComponent, canActivate: [AccountGuardService], children: [
        { path: 'info', component: AccountInfoComponent },
        { path: 'messages', component: AccountMessagesComponent },
        { path: 'edit', component: AccountSettingsComponent },
        { path: 'listings', component: AccountListingsComponent, canActivate: [AccountListingsGuardService] },
        { path: 'listing/preview', component: AccountListingPreviewComponent, canActivate: [AccountListingsGuardService] },
        { path: 'listing/update', component: AccountListingUpdateComponent},
        { path: 'bookmarks', component: AccountBookmarksComponent },
        { path: 'admin-panel', component: AdminPanelComponent, canActivate: [AdminGuard], children: [
            { path: 'manage-accounts', component: AdminManageComponent },
            { path: 'manage-roles', component: AdminRolesComponent },
            { path: 'manage-categories', component: AdminListingCategoriesComponent },
            { path: '**', redirectTo: 'manage-accounts', pathMatch: 'full' }
        ]},
        { path: '**', redirectTo: 'info', pathMatch: 'full' },
    ]},
];
  
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class AccountRoutingModule {}