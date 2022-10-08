import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { ErrorPageComponent } from './shared/error-page/error-page.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: 'home', component: HomeComponent },
  { path: 'auth', component: AuthComponent },
  {
    path: "account",
    loadChildren: () =>
      import("./accounts/account.module").then(m => m.AccountModule)
  },
  { 
    path: 'listings',     
    loadChildren: () =>
      import("./listings/listings.module").then(m => m.ListingModule) 
  },
  { path: '404', component: ErrorPageComponent },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
