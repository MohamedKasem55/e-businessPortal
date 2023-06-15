import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {LoginComponent} from "./login/login.component";
import {PreLoginLandingComponent} from "./pre-login-landing/pre-login-landing.component";
import {ForgetPasswordComponent} from "./forget-password/forget-password.component";
import {FirstTimeLoginComponent} from "./login/first-time-login/first-time-login.component";


const routes: Routes = [

    {
      path: '',
      component: PreLoginLandingComponent,
      children: [
        {
          path: '',
          pathMatch: 'full',
          redirectTo: "login"
        },
        {
          path: 'login',
          component: LoginComponent,
        },
        // {
        //   path: 'register',
        //   component: RegistrationComponent,
        // },
        {
          path: 'first-time-login',
          component: FirstTimeLoginComponent,
        },
        {
          path: 'forget-password',
          component: ForgetPasswordComponent,
        },
        {
          path: 'cash-management-products-ext',
          loadChildren: () =>
            import('../financial-products/financial-products.module').then(
              (m) => m.FinancialProductsModule
            ),
        }
      ]
    },


  ]
;

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PreLoginRoutingModule {
}
