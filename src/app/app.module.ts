import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {routes} from './app.router';
import { AppComponent } from './app.component';
import { ContactusComponent } from './contactus/contactus.component';
import { HomeComponent } from './home/home.component';
import { BookComponent } from './book/book.component';
import { HttpModule } from '@angular/http';
import { TestDetailsComponent } from './test-details/test-details.component';
import { ApiService } from './common/api.service';
import { NoopInterceptor } from './common/noop-interceptor';
import { CartComponent } from './cart/cart.component';
import { LoginComponent } from './login/login.component';
import { SlotsComponent } from './slots/slots.component';
import { PaymentComponent } from './payment/payment.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { NgForm,FormsModule } from '@angular/forms';
import { EqualValidator } from './login/password.match.directive';
import { AccountComponent } from './account/account.component';
import { WishlistComponent } from './wishlist/wishlist.component';
// import {CookieService} from 'angular2-cookie/core';
import { DatePipe } from '@angular/common';

//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//ng2-idle
 //import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';

import { MomentModule } from 'angular2-moment';

import {ReactiveFormsModule } from '@angular/forms';

import { OwlModule } from 'ng2-owl-carousel';
import { OurFacilitiesComponent } from './our-facilities/our-facilities.component';
import { OurNetworkComponent } from './our-network/our-network.component';
import { OurPackagesComponent } from './our-packages/our-packages.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { WalletComponent } from './wallet/wallet.component';

import {  HttpClient,HttpHandler,HTTP_INTERCEPTORS  } from '@angular/common/http';
import { LoadingModule,ANIMATION_TYPES } from 'ngx-loading';
import {NgxPaginationModule} from 'ngx-pagination';
import { AboutUsComponent } from './about-us/about-us.component';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { RefundCancelComponent } from './refund-cancel/refund-cancel.component';

// import {AngularFireModule} from 'angularfire2';
// import { WindowService } from './common/window.service';
// import { AngularFireAuth, AngularFireAuthModule } from 'angularfire2/auth';
import { TncComponent } from './tnc/tnc.component';
import { BillViewComponent } from './bill-view/bill-view.component';
import {NotificationsModule, NotificationsService} from 'angular4-notify';
import { NotFoundComponent } from './not-found/not-found.component';


export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: NoopInterceptor, multi: true },
];
export const firebaseconfig = {
  apiKey: "AIzaSyC3eZ9J7MsHBlaofBhwGSB1bD9xOtBAUlo",
  authDomain: "tenetdiagnostics.firebaseapp.com",
  databaseURL: "https://tenetdiagnostics.firebaseio.com",
  projectId: "tenetdiagnostics",
  storageBucket: "tenetdiagnostics.appspot.com",
  messagingSenderId: "380621725594"
};

@NgModule({
  declarations: [
    AppComponent,
    ContactusComponent,
    HomeComponent,
    BookComponent,
    TestDetailsComponent,
    CartComponent,
    LoginComponent,
    SlotsComponent,
    PaymentComponent,
    InvoiceComponent,
    EqualValidator,
    AccountComponent,
    WishlistComponent,
    OurFacilitiesComponent,
    OurNetworkComponent,
    OurPackagesComponent,
    OrderHistoryComponent,
    WalletComponent,
    AboutUsComponent,
    PrivacyPolicyComponent,
    RefundCancelComponent,
    TncComponent,
    BillViewComponent,
    NotFoundComponent,
    // NgxMyDatePickerModule,
   
 

  ],
  imports: [
    BrowserModule,
    routes,
    HttpModule,
    FormsModule,
    MomentModule,
    OwlModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    
    // BrowserAnimationsModule, 
    //  AngularFireModule.initializeApp(firebaseconfig),
    //  AngularFireAuthModule,
    NgxMyDatePickerModule.forRoot(),
   ScrollToModule.forRoot(),
   NotificationsModule,
  // NgIdleKeepaliveModule,
   LoadingModule.forRoot({
      animationType: ANIMATION_TYPES.threeBounce,
      backdropBackgroundColour: 'rgba(0,0,0,0.1)', 
      backdropBorderRadius: '10px',
      primaryColour: '#f05b25', 
      secondaryColour: '#f05b25', 
      tertiaryColour: '#f05b25'
  }),
   // NgIdleKeepaliveModule.forRoot()
  ],
  providers: [HomeComponent,ApiService,AppComponent,LoginComponent,httpInterceptorProviders,HttpClient,DatePipe,NotificationsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
