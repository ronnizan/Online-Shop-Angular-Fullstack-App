import { ProductModel } from './../models/Product';
import { HttpClient } from '@angular/common/http';
import { productsBaseUrl, categoriesBaseUrl } from './../../environments/environment';
import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private productsListener = new Subject<ProductModel[]>();
  private products: ProductModel[];

  constructor(private http: HttpClient) { }

  getTotalAmountOfProducts() {
    return this.http.get<number>(productsBaseUrl + "/products-amount")
  }
  getProductsForHomepage() {
    return this.http.get<{
      milkAndEggsProducts: ProductModel[],
      vegetablesAndFruitsProducts: ProductModel[],
      meatAndFishProducts: ProductModel[],
      wineAndDrinks: ProductModel[]
    }>(productsBaseUrl + "/products-for-homepage")

  }
  getCategories() {
    return this.http.get<{ _id: string, name: string }[]>(categoriesBaseUrl);
  }

  async getProductsByCategory(categoryId: string) {
    const products = await this.http.get<ProductModel[]>(productsBaseUrl + "/products-by-category/" + categoryId).toPromise();
    this.setProducts(products)

  }

  addProduct(name: string, image: File, price: number, category: string) {
    const productData = new FormData();
    productData.append("name", name);
    productData.append("price", price.toString());
    productData.append("image", image, name);
    productData.append("category", category);
   return this.http
      .post<any>(
        productsBaseUrl + "/add-product",
        productData
      )
    
  }

  updateProduct(name: string, image: File | string, price: number, category: string, id: string) {
    let productData;
    if (typeof image === "object") {
      productData = new FormData();
      productData.append("name", name);
      productData.append("price", price.toString());
      productData.append("image", image, name);
      productData.append("category", category);
    } else {
      productData = {
        name: name,
        price: price,
        imagePath: image,
        category: category
      };
    }
    return this.http.put<{message:string}>(productsBaseUrl + '/update/' + id, productData)
  }


  setProducts(products: ProductModel[]) {
    this.products = products;
    this.productsListener.next([...this.products]);
  }
  getProductsListener() {
    return this.productsListener.asObservable();
  }
}
