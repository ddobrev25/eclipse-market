import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AccountDetailComponent } from "../accounts/account-detail/account-detail.component";
import { AccountInfoComponent } from "../accounts/account-detail/account-info/account-info.component";
import { AccountListingsComponent } from "../accounts/account-detail/account-listings/account-listings.component";
import { AccountMessagesComponent } from "../accounts/account-detail/account-messages/account-messages.component";
import { AccountSettingsComponent } from "../accounts/account-detail/account-settings/account-settings.component";
import { AdminManageComponent } from "../accounts/admin-panel/admin-manage/admin-manage.component";
import { AdminPanelComponent } from "../accounts/admin-panel/admin-panel.component";
import { AdminRolesComponent } from "../accounts/admin-panel/admin-roles/admin-roles.component";
import { AccountGuardService } from "../_guards/account.guard.service";
import { AdminGuard } from "../_guards/admin.guard.service";

const routes: Routes = [
    { path: '', component: AccountDetailComponent, canActivate: [AccountGuardService], children: [
        { path: 'info', component: AccountInfoComponent },
        { path: 'messages', component: AccountMessagesComponent },
        { path: 'edit', component: AccountSettingsComponent },
        { path: 'listings', component: AccountListingsComponent },
        { path: 'admin-panel', component: AdminPanelComponent, canActivate: [AdminGuard], children: [
            { path: 'manage-accounts', component: AdminManageComponent },
            { path: 'manage-roles', component: AdminRolesComponent },
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