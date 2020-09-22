import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CartModel } from 'src/app/models/Cart';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-dialog',
  templateUrl: './cart-dialog.component.html',
  styleUrls: ['./cart-dialog.component.css']
})
export class CartDialogComponent implements OnInit, OnDestroy {
  cartSub: Subscription;
  totalCartPriceSub: Subscription;
  totalCartPrice: number;
  cart: CartModel;
  currentRoute: string;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.cartService.getActiveCart();
    this.cartSub = this.cartService.getCartListener().subscribe((cart) => {
      this.cart = cart;
    })
    this.totalCartPriceSub = this.cartService.getCartTotalPriceListener().subscribe(totalCartPrice => {
      this.totalCartPrice = totalCartPrice
    })
  }


  reduceCartItemAmountCart(index: number) {
    const cartCopy = { ...this.cart };
    if (cartCopy.cartItems[index].amount > 1) {
      cartCopy.cartItems[index].amount = cartCopy.cartItems[index].amount - 1;
      this.cartService.updateCart(cartCopy)
    }

  }
  addCartItemAmountCart(index: number) {
    const cartCopy = { ...this.cart };
    if (cartCopy.cartItems[index].amount < 10) {
      cartCopy.cartItems[index].amount = cartCopy.cartItems[index].amount + 1;
      this.cartService.updateCart(cartCopy)

    }
  }

  removeCartItem(index: number) {
    const cartCopy = { ...this.cart };
    cartCopy.cartItems.splice(index, 1);
    this.cartService.updateCart(cartCopy)
  }

  ngOnDestroy() {
    this.cartSub.unsubscribe();
    this.totalCartPriceSub.unsubscribe();
  }
}
