import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {PreLoginRoutingModule} from "./pre-login-routing.module";
import {LoginComponent} from "./login/login.component";
import {NormalLoginComponent} from './login/normal-login/normal-login.component';
import {LoginWithIDComponent} from './login/login-with-id/login-with-id.component';

import {PreLoginLandingComponent} from "./pre-login-landing/pre-login-landing.component";
import {StoreModule} from "@ngrx/store";
import {userReducer} from "./state/user.reducer";
import {QRCodeModule} from "angularx-qrcode";
import {RegistrationComponent} from './registration/registration.component';
import {ForgetPasswordComponent} from './forget-password/forget-password.component';
import {FirstTimeLoginComponent} from './login/first-time-login/first-time-login.component';
import {SharedModule} from "../../shared/shared.module";
import {PreLoginService} from "../../@core/service/conatct-us/pre-login.service";
import {FooterComponent} from './footer/footer.component';

@NgModule({
  imports: [
    PreLoginRoutingModule,
    CommonModule,
    StoreModule.forFeature('pre-login', userReducer),
    QRCodeModule,
    SharedModule
  ],
  declarations: [
    LoginComponent,
    PreLoginLandingComponent,
    NormalLoginComponent,
    LoginWithIDComponent,
    RegistrationComponent,
    ForgetPasswordComponent,
    FirstTimeLoginComponent,
    FooterComponent,
  ],
  providers: [
    PreLoginService
  ]
})
export class PreLoginModule {
}
