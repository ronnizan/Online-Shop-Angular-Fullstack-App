import {
  CanActivate,
  Router,
  UrlTree
} from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map,take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '../redux-ngrx/auth/auth-type';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private store: Store<AppState>
  ) { }

  canActivate():
    | boolean
    | UrlTree
    | Promise<boolean | UrlTree>
    | Observable<boolean | UrlTree> {
    return this.store.select('auth').pipe(
      take(1),
      map(authState => {      
        const isAuth = authState.isAuthenticated;
        const isAdmin = authState.user.role === "Admin";
        if (isAuth && !isAdmin) { 
          return true;
        }
        return this.router.createUrlTree(['/']);
      })
    );
  }
}
