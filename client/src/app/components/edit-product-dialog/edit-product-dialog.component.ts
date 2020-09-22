 import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { mimeType } from 'src/app/helpers/mime-type.validator';
import { ProductModel } from 'src/app/models/Product';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-edit-product-dialog',
  templateUrl: './edit-product-dialog.component.html',
  styleUrls: ['./edit-product-dialog.component.css']
})
export class EditProductDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private snackBar: MatSnackBar, private productsService: ProductsService) { }

  categories: { _id: string, name: string }[];
  editedProduct: ProductModel;
  form: FormGroup;
  imagePreview: string;

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required]
      }),
      price: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, { validators: [Validators.required], asyncValidators: [mimeType] }),
      category: new FormControl(null, { validators: [Validators.required] }),
    });
    if (this.data?.editedProduct) {
      this.editedProduct = this.data.editedProduct;
      this.form.setValue({
        name: this.editedProduct.name,
        price: this.editedProduct.price,
        image: this.editedProduct.imagePath,
        category: this.editedProduct.category,
      });
      this.imagePreview = ""
    }


    this.productsService.getCategories().subscribe(categories => {
      this.categories = categories

    })

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




  ngOnDestroy() {
  }

}
