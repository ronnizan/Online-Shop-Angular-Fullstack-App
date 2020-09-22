import { AuthAdminGuard } from './helpers/auth-admin.guard';
import { AdminShopComponent } from './components/admin-shop/admin-shop.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ShopComponent } from './components/shop/shop.component';
import { RegisterComponent } from './components/register/register.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { AuthGuard } from './helpers/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: 'home', component: HomePageComponent, pathMatch: "full" },
  { path: 'register', component: RegisterComponent, pathMatch: "full" },
  { path: 'shop', component: ShopComponent, pathMatch: "full", canActivate: [AuthGuard], },
  { path: 'checkout', component: CheckoutComponent, pathMatch: "full", canActivate: [AuthGuard], },
  { path: 'admin-shop', component: AdminShopComponent, pathMatch: "full", canActivate: [AuthAdminGuard], },
  { path: "", pathMatch: "full", redirectTo: "/home" }, 
  { path: "**", redirectTo: "/home" } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {
}
