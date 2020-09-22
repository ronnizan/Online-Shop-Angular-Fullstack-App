import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-finished-order-dialog',
  templateUrl: './finished-order-dialog.component.html',
  styleUrls: ['./finished-order-dialog.component.css']
})
export class FinishedOrderDialogComponent implements OnInit, OnDestroy {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private router: Router) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.router.navigateByUrl("/");
  }

}
