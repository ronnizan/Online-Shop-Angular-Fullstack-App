import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './redux-ngrx/auth/auth-type';
import { LoadUser } from './redux-ngrx/auth/auth-actions-types';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private store: Store<{ auth: AppState }>) {

  }

  ngOnInit() {
    //auto-login
    if (localStorage.getItem('token')) {
      let stringToken = localStorage.getItem('token').substring(1);
      stringToken = stringToken.substring(0, stringToken.length - 1);
      this.store.dispatch(
        new LoadUser({ token: stringToken, snackbarMSg: "" })
      );

    }

  }

}
