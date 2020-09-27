import { OrderModel } from './../models/Order';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ordersBaseUrl } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private http: HttpClient) { }

  getTotalAmountOfOrders() {
    return this.http.get<number>(ordersBaseUrl + "/orders-amount")
  }
  addOrder(orderData) {
    return this.http.post<boolean>(ordersBaseUrl + "/add-order", orderData);
  }
  checkIfDeliveryDateIsAvailable(dateOfDelivery:string) {
    return this.http.post<boolean>(ordersBaseUrl + "/check-if-deliveryDate-available", {dateOfDelivery:dateOfDelivery});
  }
   
  getLastOrder() {
    return this.http.get<OrderModel>(ordersBaseUrl + "/get-last-order")
  }
  getOrderDeatils(cartId: string) {
    return this.http.get<{
      firstName: string,
      lastName: string, 
      totalPrice: number,
      city: string,
      street: string,
      createdAt: string,
      dateOfDelivery: string
    }>(ordersBaseUrl + "/get-receipt/" + cartId)
  }
}
