import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { RegisterStart } from 'src/app/redux-ngrx/auth/auth-actions-types';
import { AppState } from 'src/app/redux-ngrx/auth/auth-type';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {
  storeSub: Subscription;
  citiesList = ["Tel-Aviv", "Haifa", "Jerusalem", "Beer Sheva", "Ashdod", "Rishon LeZion", "Petah Tikva", "Netanya", "Ramat Gan", "Holon"]
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  constructor(private store: Store<AppState>, private router: Router, private _formBuilder: FormBuilder, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.setRoute("/shop");

    this.firstFormGroup = this._formBuilder.group({
      emailCtrl: ['', [Validators.required, Validators.email]],
      identityNumberCtrl: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern("^[0-9]*$")], [this.validateId(this.authService)]],
      passwordCtrl: ['', [Validators.required, Validators.minLength(6)]],
      confirmPasswordCtrl: ['', [Validators.required, Validators.minLength(6)]],

    }, { validator: this.comparePasswords });
    this.secondFormGroup = this._formBuilder.group({
      cityCtrl: ['', [Validators.required]],
      streetCtrl: ['', [Validators.required,]],
      firstNameCtrl: ['', [Validators.required]],
      lastNameCtrl: ['', [Validators.required]],
    });
    this.storeSub = this.store.select('auth').subscribe(authState => {
      if (authState.isAuthenticated) {
        return this.router.navigateByUrl('/');
      }
    })
  }

  comparePasswords = (c: any) => {
    {
      const isPasswordsMatch = c.controls.passwordCtrl.value === c.controls.confirmPasswordCtrl.value;
      return isPasswordsMatch ? null : c.controls.confirmPasswordCtrl.setErrors({ passwordsNotMatching: true });;
    };
  }


  validateId = (authService: AuthService) => (c: FormControl) => {

    return authService.checkIfIdentityNumberExists(c.value)
      .pipe(take(1),
        map((isTaken: boolean) => {
          return isTaken
            ? { idAlreadyExistsInDb: true } : null;
        }),
      );

  };


  onSubmit() {

    const userToRegister = {
      firstName: this.secondFormGroup.controls.firstNameCtrl.value,
      lastName: this.secondFormGroup.controls.lastNameCtrl.value,
      email: this.firstFormGroup.controls.emailCtrl.value,
      password: this.firstFormGroup.controls.passwordCtrl.value,
      city: this.secondFormGroup.controls.cityCtrl.value,
      street: this.secondFormGroup.controls.streetCtrl.value,
      identityNumber: this.firstFormGroup.controls.identityNumberCtrl.value
    }
    this.store.dispatch(new RegisterStart(userToRegister))
  }
  ngOnDestroy() {
    this.storeSub.unsubscribe();
  }

}
