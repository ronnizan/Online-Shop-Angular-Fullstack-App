import { CartService } from './../../services/cart.service';
import { CartModel } from './../../models/Cart';
import { OrderModel } from './../../models/Order';
import { OrdersService } from './../../services/orders.service';
import { ProductsService } from './../../services/products.service';
import { Subscription } from "rxjs";
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { DialogComponent } from './../dialog/dialog.component';
import { UserModel } from 'src/app/models/User';
import { AuthState } from 'src/app/redux-ngrx/auth/auth-type';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit, OnDestroy {
  totalAmountOfProducts: number;
  totalAmountOfOrders: number;
  lastOrder: OrderModel;
  cart: CartModel;
  totalCartPrice: number;
  userIsAuthenticated: boolean;
  storeSub: Subscription;
  totalCartPriceSub: Subscription;
  getTotalAmountOfProductsSub: Subscription;
  getTotalAmountOfOrdersSub: Subscription;
  getLastOrderSub: Subscription;
  cartSub: Subscription;
  user: UserModel;

  constructor(private cartService: CartService, public dialog: MatDialog, private productsService: ProductsService, private ordersService: OrdersService, private authService: AuthService, private store: Store<{ auth: AuthState }>) {

  }




  ngOnInit() {
    this.getTotalAmountOfProductsSub = this.productsService.getTotalAmountOfProducts().subscribe(totalProducts => this.totalAmountOfProducts = totalProducts)
    this.getTotalAmountOfOrdersSub = this.ordersService.getTotalAmountOfOrders().subscribe(totalOrders => this.totalAmountOfOrders = totalOrders);
    this.authService.setRoute("/");
    this.storeSub = this.store.select('auth').subscribe(authState => {
      this.userIsAuthenticated = authState.isAuthenticated;
      this.user = authState.user;
      if (this.userIsAuthenticated) {
        this.cartService.getActiveCart();
        this.getLastOrderSub = this.ordersService.getLastOrder().subscribe(order => {
          this.lastOrder = order;
        });
        this.totalCartPriceSub = this.cartService.getCartTotalPriceListener().subscribe(cartTotalPrice => {
          this.totalCartPrice = cartTotalPrice;
        })
        this.cartSub = this.cartService.getCartListener().subscribe(cart => {
          if (cart) {
            this.cart = cart
          }
        });
      }
    });

  }


  openDialog() {
    const dialogRef = this.dialog.open(DialogComponent, {
      panelClass: 'dialog'
    });
  }

  ngOnDestroy() {
    this.getTotalAmountOfProductsSub.unsubscribe();
    this.getTotalAmountOfOrdersSub.unsubscribe();
    this.storeSub.unsubscribe();

    if (this.getLastOrderSub) {
      this.getLastOrderSub.unsubscribe();
    }
    if (this.totalCartPriceSub) {
      this.totalCartPriceSub.unsubscribe();

    }
    if (this.cartSub) {
      this.cartSub.unsubscribe();

    }
  }



}
