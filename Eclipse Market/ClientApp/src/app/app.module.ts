import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FooterComponent } from './footer/footer.component';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { AuthComponent } from './auth/auth.component';
import { AuthInterceptor } from './_interceptors/auth.interceptor';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { SpinnerComponent } from './loader/spinner/spinner.component';
import { ConfirmationService, MessageService,  } from 'primeng/api';
import { ErrorInterceptor } from './_interceptors/error-handler.interceptor';
import { ErrorPageComponent } from './error-page/error-page.component';
import { AccountModule } from './_modules/account.module';
import { SharedModule } from './_shared/shared.module';
import { ListingModule } from './_modules/listings.module';
import { ListingCreatePricingComponent } from './listings/listing-create/listing-create-pricing/listing-create-pricing.component';
import { ListingCreateGalleryComponent } from './listings/listing-create/listing-create-gallery/listing-create-gallery.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    FooterComponent,
    AuthComponent,
    SpinnerComponent,
    ErrorPageComponent,
    ListingCreatePricingComponent,
    ListingCreateGalleryComponent,

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    NgHttpLoaderModule.forRoot(),
    AccountModule,
    ListingModule,
    SharedModule
  ],
  providers: [
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS }, JwtHelperService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    MessageService,
    ConfirmationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
