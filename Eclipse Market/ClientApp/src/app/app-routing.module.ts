import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountDetailComponent } from './accounts/account-detail/account-detail.component';
import { AccountInfoComponent } from './accounts/account-detail/account-info/account-info.component';
import { AccountListingsComponent } from './accounts/account-detail/account-listings/account-listings.component';
import { AccountMessagesComponent } from './accounts/account-detail/account-messages/account-messages.component';
import { AccountSettingsComponent } from './accounts/account-detail/account-settings/account-settings.component';
import { AccountsComponent } from './accounts/accounts.component';
import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './home/home.component';
import { ListingsComponent } from './listings/listings.component';
import { AccountGuardService } from './_guards/account.guard.service';
import { AuthGuardService } from './_guards/auth.guard.service';

const routes: Routes = [
  { path: '', redirectTo:  'home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'listings', component: ListingsComponent, canActivate: [AuthGuardService] },
  { path: 'account', component: AccountsComponent, canActivate: [AccountGuardService]},
  { path: 'account/:id', component: AccountDetailComponent, children: [
    { path: '', component: AccountInfoComponent },
    { path: 'listings', component: AccountListingsComponent },
    { path: 'messages', component: AccountMessagesComponent },
    { path: 'settings', component: AccountSettingsComponent },
  ]},
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
