import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {TableModule} from 'primeng/table';

import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { InputTextModule } from 'primeng/inputtext';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ListingsComponent } from './listings/listings.component';
import { HomeComponent } from './home/home.component';
import { AccountsComponent } from './accounts/accounts.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormErrorsComponent } from './form-errors/form-errors.component';
import { FooterComponent } from './footer/footer.component';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { AccountDetailComponent } from './accounts/account-detail/account-detail.component';
import { AuthComponent } from './auth/auth.component';
import { AuthInterceptor } from './_interceptors/auth.interceptor';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { SpinnerComponent } from './loader/spinner/spinner.component';
import { AccountListingsComponent } from './accounts/account-detail/account-listings/account-listings.component';
import { AccountMessagesComponent } from './accounts/account-detail/account-messages/account-messages.component';
import { AccountSettingsComponent } from './accounts/account-detail/account-settings/account-settings.component';
import {ToastModule} from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ErrorInterceptor } from './_interceptors/error-handler.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ListingsComponent,
    HomeComponent,
    AccountsComponent,
    FormErrorsComponent,
    FooterComponent,
    AccountDetailComponent,
    AuthComponent,
    SpinnerComponent,
    AccountListingsComponent,
    AccountMessagesComponent,
    AccountSettingsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgHttpLoaderModule.forRoot(),
    ToastModule
  ],
  providers: [
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS }, JwtHelperService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
