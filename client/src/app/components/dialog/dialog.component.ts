import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { LoginStart } from 'src/app/redux-ngrx/auth/auth-actions-types';
import { AppState } from 'src/app/redux-ngrx/auth/auth-type';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  email: string;
  password: string;
  constructor(private store: Store<{ auth: AppState }>) { }

  ngOnInit(): void {
  }


  onSubmit() {

    this.store.dispatch(
      new LoginStart({email: this.email,password: this.password} )
    );

}

}
