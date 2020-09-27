import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { debounceTime, map, take } from 'rxjs/operators';
import { CartModel } from 'src/app/models/Cart';
import { UserModel } from 'src/app/models/User';
import { AppState } from 'src/app/redux-ngrx/auth/auth-type';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { OrdersService } from 'src/app/services/orders.service';
import { FinishedOrderDialogComponent } from '../finished-order-dialog/finished-order-dialog.component';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css']
})
export class OrderFormComponent implements OnInit, OnDestroy {
  storeSub: Subscription;
  citiesList = ["Tel-Aviv", "Haifa", "Jerusalem", "Beer Sheva", "Ashdod", "Rishon LeZion", "Petah Tikva", "Netanya", "Ramat Gan", "Holon"]
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  user: UserModel;
  cartSub: Subscription;
  cart: CartModel;
  minDate = new Date().toISOString().split("T")[0];
  minDateForYearAndMonthInput: string;
  isSocialUser = null;
  orderDeatils: {
    firstName: string,
    lastName: string,
    totalPrice: number,
    city: string,
    street: string,
    createdAt: string,
    dateOfDelivery: string
  }
  @Input() public cartId: string;
  @Input() public totalCartPrice: number;


  constructor(private store: Store<AppState>, public dialog: MatDialog, private _formBuilder: FormBuilder, private authService: AuthService, private ordersService: OrdersService, private cartService: CartService) { }

  ngOnInit(): void {
    this.cartService.getActiveCart();
    this.cartSub = this.cartService.getCartListener().subscribe(cart => {
      this.cart = cart;

    })
    this.setMinDateForYearAndMonthInput();
    this.authService.setRoute("/shop");
    this.storeSub = this.store.select('auth').subscribe(authState => {
      if (authState.isAuthenticated) {
        this.user = authState.user;
        this.isSocialUser = null;
      }
    })
    this.firstFormGroup = this._formBuilder.group({
      cityCtrl: ["", [Validators.required]],
      streetCtrl: ["", [Validators.required]],
      identityNumberCtrl: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern("^[0-9]*$")], [this.validateId(this.authService)]],

    });
    this.secondFormGroup = this._formBuilder.group({
      cityCtrl: [this.user.city, [Validators.required]],
      streetCtrl: [this.user.street, [Validators.required]],
      deliveryDateCtrl: ['', [Validators.required],[this.checkIfDeliveryDateIsAvailable(this.ordersService)]],
      creditCardCtrl: ['', [Validators.required, Validators.pattern("^(?:4[0-9]{12}(?:[0-9]{3})?|(?:5[1-5][0-9]{2}| 222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}|3[47][0-9]{13}|  3(?:0[0-5]|[68][0-9])[0-9]{11}|  6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\d{3})\d{11})$")]],
      //    validation for:
      //    Visa
      //    MasterCard
      //    American Express
      //    Diners Club
      //    Discover
      //    JCB
      creditCardExpirationDateCtrl: ['', [Validators.required]],
      cvvCtrl: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3), Validators.pattern("^[0-9]*$")]],
    });

  }


  validateId = (authService: AuthService) => (c: FormControl) => {

    return authService.checkIfIdentityNumberExists(c.value)
      .pipe(debounceTime(10000), take(1),
        map((isTaken: boolean) => {
          return isTaken
            ? { idAlreadyExistsInDb: true } : null;
        }),
      );
  };
  checkIfDeliveryDateIsAvailable = (ordersService: OrdersService) => (c: FormControl) => {
    return ordersService.checkIfDeliveryDateIsAvailable(c.value)
      .pipe(debounceTime(10000), take(1),
        map((IsAvailable: boolean) => {
          return IsAvailable
            ? null : { deliveryDateNotAvailable: true };
        }),
      );
  };

  setMinDateForYearAndMonthInput() {
    if ((new Date().getUTCMonth() + 1).toString().length === 1) {
      this.minDateForYearAndMonthInput = new Date().getUTCFullYear() + "-" + "0" + (new Date().getUTCMonth() + 1)
    } else {
      this.minDateForYearAndMonthInput = new Date().getUTCFullYear() + "-" + (new Date().getUTCMonth() + 1)
    }
  }
  submitSocialUserUpdate() {
    if (this.firstFormGroup.status === "VALID") {
      const updatedFieldsToSend = {
        identityNumber: this.firstFormGroup.value.identityNumberCtrl,
        city: this.firstFormGroup.value.cityCtrl,
        street: this.firstFormGroup.value.streetCtrl,
      }

      this.authService.updateSocialUserInfo(updatedFieldsToSend).subscribe(msg => {
        this.secondFormGroup.controls['cityCtrl'].setValue(this.firstFormGroup.value.cityCtrl);
        this.secondFormGroup.controls['streetCtrl'].setValue(this.firstFormGroup.value.streetCtrl);

      }, (err) => { console.log(err) })
    }
  }


  onSubmit() {
    const orderData = {

      cart: this.cartId,
      totalPrice: this.totalCartPrice,
      city: this.secondFormGroup.controls.cityCtrl.value,
      street: this.secondFormGroup.controls.streetCtrl.value,
      dateOfDelivery: this.secondFormGroup.controls.deliveryDateCtrl.value,
      creditCardLastDigits: this.secondFormGroup.controls.creditCardCtrl.value.substr(this.secondFormGroup.controls.creditCardCtrl.value.length - 4)
    }
    this.ordersService.addOrder(orderData).subscribe(orderCreated => {
      if (orderCreated) {
        this.ordersService.getOrderDeatils(this.cartId).subscribe(orderDeatils => {
          this.orderDeatils = orderDeatils
          this.openDialog();
        })
      }
    }, (err => console.log(err)))
  }
  openDialog() {
    this.dialog.open(FinishedOrderDialogComponent, {
      panelClass: 'order-dialog',
      data: { orderDeatils: this.orderDeatils, cart: this.cart }
    });
  }

  ngOnDestroy() {
    this.storeSub.unsubscribe();
    this.cartSub.unsubscribe();
  }
}
