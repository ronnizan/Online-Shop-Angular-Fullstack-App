import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { CartModel } from 'src/app/models/Cart';
import { UserModel } from 'src/app/models/User';
import { AuthState } from 'src/app/redux-ngrx/auth/auth-type';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cart: CartModel;
  totalCartPrice: number;
  userIsAuthenticated: boolean;
  storeSub: Subscription;
  totalCartPriceSub: Subscription;
  cartSub: Subscription;
  user: UserModel;
  searchedProduct: string;

  constructor(private cartService: CartService, private router: Router, public dialog: MatDialog, private authService: AuthService, private snackBar: MatSnackBar, private store: Store<{ auth: AuthState }>) {

  }


  ngOnInit() {
    this.storeSub = this.store.select('auth').subscribe(authState => {
      this.userIsAuthenticated = authState.isAuthenticated;
      this.user = authState.user;
      if (this.userIsAuthenticated) {
        this.cartService.getActiveCart();
        this.totalCartPriceSub = this.cartService.getCartTotalPriceListener().subscribe(cartTotalPrice => {
          this.totalCartPrice = cartTotalPrice;
          if (cartTotalPrice === 0) {
            this.openSnackBar("your cart is empty please Choose some Products!", "snackbar-error")
            this.router.navigateByUrl("/shop");
          }
        })
        this.cartSub = this.cartService.getCartListener().subscribe(cart => {
          if (cart) {
            this.cart = cart
            this.authService.setRoute("/checkout");
          }
        });
      }
    });
    this.dialog.closeAll();
  }


  openSnackBar = (msg: string, className: string) => {
    this.snackBar.open(msg, '', {
      duration: 3000,
      panelClass: className,
      horizontalPosition: 'left',
      verticalPosition: 'top',

    });
  }


  checkSearchedProduct(productName: string) {
    if (productName.includes(this.searchedProduct)) {
      return true;
    }
    if (productName.toLowerCase().includes(this.searchedProduct)) {
      return true;
    }
    return false;
  }

  ngOnDestroy() {
    this.storeSub.unsubscribe();
    this.totalCartPriceSub.unsubscribe();
    this.cartSub.unsubscribe();
  }


}
