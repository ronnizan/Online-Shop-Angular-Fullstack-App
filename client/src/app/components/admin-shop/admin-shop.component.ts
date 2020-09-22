import { EditProductDialogComponent } from './../edit-product-dialog/edit-product-dialog.component';
import { mimeType } from './../../helpers/mime-type.validator';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ProductModel } from 'src/app/models/Product';
import { AuthService } from 'src/app/services/auth.service';
import { ProductsService } from 'src/app/services/products.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { error } from '@angular/compiler/src/util';


@Component({
  selector: 'app-admin-shop',
  templateUrl: './admin-shop.component.html',
  styleUrls: ['./admin-shop.component.css']
})
export class AdminShopComponent implements OnInit, OnDestroy {

  categories: { _id: string, name: string }[];
  categoriesListener: Subscription
  productListener: Subscription;
  products: ProductModel[];
  editedProduct: ProductModel;
  form: FormGroup;
  imagePreview: string;

  constructor(private snackBar: MatSnackBar, public dialog: MatDialog, private authService: AuthService, private productsService: ProductsService) { }


  ngOnInit(): void {
    this.authService.setRoute("/admin-shop");

    this.categoriesListener = this.productsService.getCategories().subscribe(categories => {
      this.categories = categories

      this.productsService.getProductsByCategory(this.categories[0]._id);
    })
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required]
      }),
      price: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, { validators: [Validators.required], asyncValidators: [mimeType] }),
      category: new FormControl(null, { validators: [Validators.required] }),
    });

    this.productListener = this.productsService.getProductsListener().subscribe(products => this.products = products)

  }

  sendProductToEditing(product: ProductModel) {
    this.editedProduct = product;
    this.form.setValue({
      name: this.editedProduct.name,
      price: this.editedProduct.price,
      image: this.editedProduct.imagePath,
      category: this.editedProduct.category,
    });
    this.imagePreview = ""

  }

  getProductsByCategory(categoryId: string) {
    this.productsService.getProductsByCategory(categoryId);
  }



  onImagePicked(event: Event) {

    const file = (event.target as HTMLInputElement).files[0];
    if (file) {
      this.form.patchValue({ image: file });
      this.form.get('image').updateValueAndValidity();
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      if (this.editedProduct) {
        this.form.patchValue({ image: this.editedProduct.imagePath });
        this.imagePreview = ""
      }


    }

  }


  switchToAddMode() {
    this.editedProduct = null;
    this.form.setValue({
      name: null,
      price: null,
      image: null,
      category: null
    });
    this.imagePreview = ""

  }

  onSaveProduct() {
    if (this.form.controls.image.errors?.invalidMimeType) {
      this.snackBar.open("Product Image Must be a jpg,jpeg or png file", '', {
        duration: 5000,
        panelClass: "snackbar-error",
        horizontalPosition: 'left',
        verticalPosition: 'top',

      });
      return;
    }
    if (!this.form.value.image) {
      this.snackBar.open("Product Image Is Required", '', {
        duration: 3000,
        panelClass: "snackbar-error",
        horizontalPosition: 'left',
        verticalPosition: 'top',

      });
      return;
    }
    if (this.form.invalid) {
      return;
    }
    if (this.editedProduct) {
      let categoryId = this.form.value.category;
      this.productsService.updateProduct(
        this.form.value.name, this.form.value.image, this.form.value.price, this.form.value.category, this.editedProduct._id
      ).subscribe(response => {
        this.snackBar.open(response.message, '', {
          duration: 3000,
          panelClass: "snackbar",
          horizontalPosition: 'left',
          verticalPosition: 'top',

        });
        this.productsService.getProductsByCategory(categoryId);
      }, (errResponse => {
        this.snackBar.open(errResponse.error.error, '', {
          duration: 3000,
          panelClass: "snackbar-error",
          horizontalPosition: 'left',
          verticalPosition: 'top',

        });
      }));;
    } else {
      let categoryId = this.form.value.category;
      this.productsService.addProduct(this.form.value.name, this.form.value.image, this.form.value.price, this.form.value.category).subscribe(responseData => {
        this.snackBar.open("Product Added Successfully", '', {
          duration: 3000,
          panelClass: "snackbar",
          horizontalPosition: 'left',
          verticalPosition: 'top',
        });
        this.productsService.getProductsByCategory(categoryId);
      }, (err => {
        this.snackBar.open("Failed To Add Product", '', {
          duration: 3000,
          panelClass: "snackbar-error",
          horizontalPosition: 'left',
          verticalPosition: 'top',
        });
      }));;
    }
    this.form.reset();
  }



  openUpdateProductDialog(product: ProductModel) {
    this.dialog.open(EditProductDialogComponent, {
      panelClass: 'dialog',
      data: { editedProduct: product }

    })

  }


  openAddProductDialog() {
    this.dialog.open(EditProductDialogComponent, {
      panelClass: 'dialog',

    });
  }

  ngOnDestroy(): void {
    this.categoriesListener.unsubscribe();
    this.productListener.unsubscribe();
  }


}
