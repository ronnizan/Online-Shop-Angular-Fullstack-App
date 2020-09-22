import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material/input'
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { FacebookComponent } from './components/facebook/facebook.component';
import { GoogleComponent } from './components/google/google.component';
import { PdfReceiptComponent } from './components/pdf-receipt/pdf-receipt.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomePageComponent } from './components/home-page/home-page.component';
import { ProductsTabsComponent } from './components/products-tabs/products-tabs.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { authReducer } from './redux-ngrx/auth/auth-reducer';
import { AuthInterceptorService } from './helpers/auth-interceptor.service';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from './redux-ngrx/auth/auth.effects';
import { RegisterComponent } from './components/register/register.component';
import { CartDialogComponent } from './components/cart-dialog/cart-dialog.component';
import { ShopComponent } from './components/shop/shop.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { OrderFormComponent } from './components/order-form/order-form.component';
import { FinishedOrderDialogComponent } from './components/finished-order-dialog/finished-order-dialog.component';
import { AdminShopComponent } from './components/admin-shop/admin-shop.component';
import { EditProductDialogComponent } from './components/edit-product-dialog/edit-product-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    FacebookComponent,
    GoogleComponent,
    PdfReceiptComponent,
    NavbarComponent,
    HomePageComponent,
    ProductsTabsComponent,
    DialogComponent,
    RegisterComponent,
    CartDialogComponent,
    ShopComponent,
    CheckoutComponent,
    OrderFormComponent,
    FinishedOrderDialogComponent,
    AdminShopComponent,
    EditProductDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot({ auth: authReducer }),
    HttpClientModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatTabsModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatStepperModule,
    MatSelectModule,
    MatSidenavModule,
    EffectsModule.forRoot([AuthEffects])
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
