import { CartItemModel } from './../../models/Cart-Item';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CartModel } from 'src/app/models/Cart';
import { ProductModel } from 'src/app/models/Product';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit, OnDestroy {
  cart: CartModel;
  cartSub: Subscription;
  totalCartPriceSub: Subscription;
  totalCartPrice: number;
  categories: { _id: string, name: string }[];
  products: ProductModel[];
  amountSelected = 1;

  constructor(private authService: AuthService, private cartService: CartService, private productsService: ProductsService) { }


  ngOnInit(): void {
    this.authService.setRoute("/shop");
    this.cartSub = this.cartService.getCartListener().subscribe(cart => {
      this.cart = cart;
    })
    this.totalCartPriceSub = this.cartService.getCartTotalPriceListener().subscribe(totalCartPrice => {
      this.totalCartPrice = totalCartPrice
    })
    this.productsService.getCategories().subscribe(categories => {
      this.categories = categories

      this.productsService.getProductsByCategory(this.categories[0]._id);
    })

    this.cartService.getActiveCart();

    this.productsService.getProductsListener().subscribe(products => this.products = products)

  }

  getProductsByCategory(categoryId: string) {
    this.productsService.getProductsByCategory(categoryId);
  }


  reduceCartItemAmountCart(index: number) {
    const cartCopy = { ...this.cart };
    // const cartItemsCheck = [...this.cart.cartItems]
    if (cartCopy.cartItems[index].amount > 1) {
      cartCopy.cartItems[index].amount = cartCopy.cartItems[index].amount - 1;
      this.cartService.updateCart(cartCopy)
    }

  }
  addCartItemAmountCart(index: number) {
    const cartCopy = { ...this.cart };
    // const cartItemsCheck = [...this.cart.cartItems]
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
  addAmountToProduct(index: number) {
    let productsCopy = [...this.products];
    if (!productsCopy[index].amount) {
      productsCopy[index].amount = 1;
    }
    if (productsCopy[index].amount < 10) {
      productsCopy[index].amount = productsCopy[index].amount + 1;
      this.products = productsCopy
    }
  }
  reduceAmountFromProduct(index: number) {
    let productsCopy = [...this.products];
    if (!productsCopy[index].amount) {
      productsCopy[index].amount = 1;
    }
    if (productsCopy[index].amount > 1) {
      productsCopy[index].amount = productsCopy[index].amount - 1;
      this.products = productsCopy

    }
  }

  addCartItem(product: ProductModel) {
    const cartCopy = { ...this.cart };
    if (!product.amount) {
      product.amount = 1;
    }
    const productInCartIndex = cartCopy.cartItems.findIndex(item => item.product.name === product.name);
    // console.log(productInCartIndex);
    if (productInCartIndex !== -1) {
      cartCopy.cartItems[productInCartIndex].amount = product.amount;
      cartCopy.cartItems[productInCartIndex].totalPrice = product.amount * product.price;
      this.cartService.updateCart(cartCopy);
      return;

    }

    cartCopy.cartItems.push({ amount: product.amount, totalPrice: product.amount * product.price, product: product });
    this.cartService.updateCart(cartCopy)


  }


  checkIfProductInCart(product: ProductModel) {
    const isProductInCart = this.cart.cartItems.find(item => item.product.name === product.name);
    if (isProductInCart) {
      return "Update Cart"
    }else{
      return "Add To Cart"
    }
  }

  ngOnDestroy(): void {
    this.cartSub.unsubscribe();
  }



}
