import { LoginWithFacebook } from './../../redux-ngrx/auth/auth-actions-types';
import { Component, NgZone, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthState } from 'src/app/redux-ngrx/auth/auth-type';



declare const FB: any;
@Component({
  selector: 'app-facebook',
  templateUrl: './facebook.component.html',
  styleUrls: ['./facebook.component.css']
})


export class FacebookComponent implements OnInit {
  @Input() public changeColor: boolean;

  constructor(private store: Store<{ auth: AuthState }>, private zone: NgZone) { }
  ngOnInit(): void {
    (window as any).fbAsyncInit = function () {
      FB.init({
        appId: '349852056191405',
        cookie: true,
        xfbml: true,
        version: 'v3.1'
      });
      FB.AppEvents.logPageView();
    };

    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }

  submitLogin() {
      FB.login((response) => {
        this.zone.run(() => {
        if (response.authResponse) {
          this.store.dispatch(
            new LoginWithFacebook({ userID: response.authResponse.userID, accessToken: response.authResponse.accessToken })
          );
        }
        else {
        }
      }, { scope: 'public_profile,email' });
    })


  }

}
