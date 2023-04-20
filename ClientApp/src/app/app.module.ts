import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/layout/header/header.component';
import { HomeComponent } from './home/home.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FooterComponent } from './shared/layout/footer/footer.component';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { AuthComponent } from './auth/auth.component';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { ConfirmationService, MessageService,  } from 'primeng/api';
import { ErrorPageComponent } from './shared/error-page/error-page.component';
import { AccountModule } from './accounts/account.module';
import { SharedModule } from './shared/shared.module';
import { ListingModule } from './listings/listings.module';
import { ErrorInterceptor } from './core/interceptors/error-handler.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    FooterComponent,
    AuthComponent,
    SpinnerComponent,
    ErrorPageComponent
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
