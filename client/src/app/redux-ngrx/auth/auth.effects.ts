import { UserModel } from './../../models/User';
import { AuthenticateFail, AuthenticateSuccess, LoginStart, LOGIN_START, LoadUser, LOAD_USER, LOGIN_WITH_GOOGLE, LoginWithGoogle, LOGIN_WITH_FACEBOOK, LoginWithFacebook, REGISTER_START, RegisterStart, LOGOUT, LogoutUser } from './auth-actions-types';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, ofType, Effect } from '@ngrx/effects';
import { switchMap, catchError, map, tap, take } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { authBaseUrl } from '../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';




const openSnackBar = (msg: string, className: string, snackBar: MatSnackBar) => {
  snackBar.open(msg, '', {
    duration: 3000,
    panelClass: className,
    horizontalPosition: 'left',
    verticalPosition: 'top',

  });
}

const handleAuthentication = (
  user: UserModel
) => {
  return new AuthenticateSuccess({
    city: user.city,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    street: user.street
  });
};
const handleError = (errorRes: any) => {
  let errorMessage = 'An unknown error occurred!';
  if (!errorRes.error || !errorRes.error.error) {
    return of(new AuthenticateFail(errorMessage));
  }
  return of(new AuthenticateFail(errorRes.error.error));
};


@Injectable()
export class AuthEffects {

  @Effect()
  authRegister = this.actions$.pipe(
    ofType(REGISTER_START),
    switchMap((registerAction: RegisterStart) => {
      return this.http
        .post<{ token: string }>(
          authBaseUrl + '/register',
          {
            firstName: registerAction.payload.firstName,
            lastName: registerAction.payload.lastName,
            email: registerAction.payload.email,
            password: registerAction.payload.password,
            city: registerAction.payload.city,
            street: registerAction.payload.street,
            identityNumber: registerAction.payload.identityNumber
          }
        )
        .pipe(
          map(resData => {
            localStorage.setItem("token", JSON.stringify(resData.token))
            return new LoadUser({
              token: resData.token,
              snackbarMSg: "You've Been Successfully Registered",
            });
          }),
          catchError(errorRes => {
            openSnackBar(errorRes.error.error, "snackbar-error", this.snackBar);
            return handleError(errorRes);
          })
        );
    })
  );

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(LOGIN_START),
    switchMap((authData: LoginStart) => {
      return this.http
        .post<{ token: string }>(
          authBaseUrl + '/login',
          {
            email: authData.payload.email,
            password: authData.payload.password
          }
        )
        .pipe(
          map(resData => {
            localStorage.setItem("token", JSON.stringify(resData.token))
            return new LoadUser({
              token: resData.token,
              snackbarMSg: "You've Been Successfully Logged In",
            });
          }),
          catchError(errorRes => {
            openSnackBar(errorRes.error.error, "snackbar-error", this.snackBar);
            return handleError(errorRes);
          })
        );
    })
  );
  @Effect()
  authLoginGoogle = this.actions$.pipe(
    ofType(LOGIN_WITH_GOOGLE),
    switchMap((authData: LoginWithGoogle) => {
      return this.http
        .post<{ token: string }>(
          authBaseUrl + '/google',
          {
            idToken: authData.payload
          }
        )
        .pipe(
          map(resData => {
            localStorage.setItem("token", JSON.stringify(resData.token))
            return new LoadUser({
              token: resData.token,
              snackbarMSg: "You've Been Successfully Logged In",
            });
          }),
          catchError(errorRes => {
            openSnackBar(errorRes.error.error, "snackbar-error", this.snackBar);
            return handleError(errorRes);
          })
        );
    })
  );
  @Effect()
  authLoginFacebook = this.actions$.pipe(
    ofType(LOGIN_WITH_FACEBOOK),
    switchMap((authData: LoginWithFacebook) => {
      return this.http
        .post<{ token: string }>(
          authBaseUrl + '/facebook',
          {
            userID: authData.payload.userID,
            accessToken: authData.payload.accessToken
          }
        )
        .pipe(
          map(resData => {
            localStorage.setItem("token", JSON.stringify(resData.token))

            return new LoadUser({
              token: resData.token,
              snackbarMSg: "You've Been Successfully Logged In",

            });
          }),
          catchError(errorRes => {
            openSnackBar(errorRes.error.error, "snackbar-error", this.snackBar);
            return handleError(errorRes);
          })
        );
    })
  );
  @Effect()
  loadUser = this.actions$.pipe(
    ofType(LOAD_USER),
    switchMap((authData: LoadUser) => {

      return this.http
        .get<UserModel>(
          authBaseUrl
        )
        .pipe(
          map(resData => {
            if (authData.payload.snackbarMSg) {
              openSnackBar(authData.payload.snackbarMSg, "snackbar", this.snackBar);
            }
            return handleAuthentication(
              resData
            );
          }),
          catchError(errorRes => {
            openSnackBar(errorRes.error.error, "snackbar-error", this.snackBar);
            return handleError(errorRes);
          })
        );
    })
  );

  @Effect({ dispatch: false })
  authLogout = this.actions$.pipe(
    ofType(LOGOUT),
    map(() => {
      openSnackBar("You've Been Successfully Logged Out", "snackbar-error", this.snackBar);
      localStorage.removeItem('token');
      this.router.navigate(['/']);
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }
}
