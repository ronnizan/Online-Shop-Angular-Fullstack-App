import { CartModel } from './../models/Cart';
import { cartBaseUrl } from './../../environments/environment.prod';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartListener = new Subject<CartModel>();
  private cart: CartModel;
  private sumOfProductsListener = new Subject<number>();
  private cartTotalPriceListener = new Subject<number>();
  private sumOfProducts: number;
  private cartTotalPrice: number;
  constructor(private http: HttpClient) { }

  async getActiveCart() {

    const cart = await this.http.get<CartModel[]>(cartBaseUrl + "/get-cart").toPromise();
    if (cart.length > 0) {
      let sum = 0;
      cart[0].cartItems.forEach(cartItem => {
        cartItem.totalPrice = cartItem.product.price * cartItem.amount;
      });
      cart[0].cartItems.forEach(cartItem => {
        sum += cartItem.totalPrice;
      });
      this.setCart(cart[0]);
      this.setCartTotalPrice(sum);
      this.setProductsSum(this.cart.cartItems.length);
    }
    else {
      const cart = await this.http.get<CartModel>(cartBaseUrl).toPromise();
      this.setCart(null);
      this.setProductsSum(0);
      this.setCartTotalPrice(0);
    }

  }


  async updateCart(cart: CartModel) {
    const updatedCart = await this.http.patch<{}>(cartBaseUrl + "/update-cart", { _id: cart._id, cartItems: cart.cartItems }).toPromise();
    let sum = 0;
    cart.cartItems.forEach(cartItem => {
      cartItem.totalPrice = cartItem.product.price * cartItem.amount;
    });
    cart.cartItems.forEach(cartItem => {
      sum += cartItem.totalPrice;
    });
    this.setCartTotalPrice(sum);
    this.setProductsSum(this.cart.cartItems.length);

  }



  setCart(cart: CartModel) {
    this.cart = cart;
    this.cartListener.next(this.cart);
  }
  getCartListener() {
    return this.cartListener.asObservable();
  }
  setProductsSum(productsSum: number) {
    this.sumOfProducts = productsSum;
    this.sumOfProductsListener.next(this.sumOfProducts);
  }
  getSumOfProductsListener() {
    return this.sumOfProductsListener.asObservable();
  }

  setCartTotalPrice(cartTotalPrice: number) {
    this.cartTotalPrice = cartTotalPrice;
    this.cartTotalPriceListener.next(this.cartTotalPrice);
  }

  getCartTotalPriceListener() {
    return this.cartTotalPriceListener.asObservable();
  }




}
