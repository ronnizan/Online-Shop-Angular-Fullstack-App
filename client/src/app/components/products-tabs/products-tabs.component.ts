import { ProductModel } from './../../models/Product';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductsService } from './../../services/products.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-products-tabs',
  templateUrl: './products-tabs.component.html',
  styleUrls: ['./products-tabs.component.css']
})
export class ProductsTabsComponent implements OnInit, OnDestroy {
  getProductsForHomepageSub: Subscription;
  products: {
    milkAndEggsProducts: ProductModel[],
    vegetablesAndFruitsProducts: ProductModel[],
    meatAndFishProducts: ProductModel[],
    wineAndDrinks: ProductModel[]
  }

  constructor(private productsService: ProductsService) { }


  ngOnInit() {
    this.getProductsForHomepageSub = this.productsService.getProductsForHomepage().subscribe(products => {
      this.products = products;
    })

  }

  ngOnDestroy() {
    this.getProductsForHomepageSub.unsubscribe();
  }


}
