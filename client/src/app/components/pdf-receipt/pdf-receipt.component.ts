import { CartModel } from './../../models/Cart';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

declare var jsPDF: any;

@Component({
  selector: 'app-pdf-receipt',
  templateUrl: './pdf-receipt.component.html',
  styleUrls: ['./pdf-receipt.component.css']
})
export class PdfReceiptComponent {
  constructor(private router: Router, private dialog: MatDialog) { }
  @Input() public orderDeatils: {
    firstName: string,
    lastName: string,
    totalPrice: number,
    city: string,
    street: string,
    createdAt: string,
    dateOfDelivery: string
  };
  @Input() public cart: CartModel;

  @ViewChild('pdfTable', { static: false }) pdfTable: ElementRef;
  public hide: true;


  public downloadAsPDF() {
    const doc = new jsPDF();

    const specialElementHandlers = {
      '#editor': function (element, renderer) {
        return true;
      }
    };

    const pdfTable = this.pdfTable.nativeElement;

    doc.fromHTML(pdfTable.innerHTML, 15, 15, {
      width: 90,
      'elementHandlers': specialElementHandlers
    });

    doc.save('receipt' + new Date(this.orderDeatils.createdAt).toLocaleDateString() + '.pdf');
    this.dialog.closeAll();
    this.router.navigateByUrl("/");
  }

}
