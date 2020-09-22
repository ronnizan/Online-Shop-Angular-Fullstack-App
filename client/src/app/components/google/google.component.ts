import { AuthService } from './../../services/auth.service';
import { Component, NgZone, Input, OnInit } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthState } from 'src/app/redux-ngrx/auth/auth-type';
import { LoginWithGoogle } from 'src/app/redux-ngrx/auth/auth-actions-types';

@Component({
  selector: 'app-google',
  templateUrl: './google.component.html',
  styleUrls: ['./google.component.css']
})
export class GoogleComponent implements OnInit {
  @Input() public changeColor: boolean;
  constructor(private authService: AuthService, private store: Store<{ auth: AuthState }>, private zone: NgZone) {

  }

  @ViewChild('loginRef', { static: true }) loginElement: ElementRef;
  auth2: any;
  show: any;
  Name: any;
  ngOnInit() {
    this.authService.setSecondGoogleButton(this.loginElement);
    this.googleInitialize();
  }

  googleInitialize() {
    window['googleSDKLoaded'] = () => {
      window['gapi'].load('auth2', () => {
        this.auth2 = window['gapi'].auth2.init({
          client_id: '977133625704-dp234g9c8jsgti3od30buhnpoi03s17c.apps.googleusercontent.com',
          cookie_policy: 'single_host_origin',
          scope: 'profile email'
        });
        this.prepareLogin();
      });
    }
    (function (d, s, id) {
      let js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s);
      js.id = id;
      js.src = "https://apis.google.com/js/platform.js?onload=googleSDKLoaded";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'google-jssdk'));
  }

  prepareLogin() {
    this.auth2.attachClickHandler(this.loginElement.nativeElement, {},
      (googleUser) => {
        this.zone.run(() => {
          let profile = googleUser.getBasicProfile();
          this.store.dispatch(
            new LoginWithGoogle(googleUser.getAuthResponse().id_token)
          );
          this.show = true;
          this.Name = profile.getName();
        })

      }, (error) => {
        alert(JSON.stringify(error, undefined, 2));
      });
  }

}
