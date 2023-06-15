import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { AskAlRajhiService } from 'app/@core/service/ask/ask-alrajhi.service'
import { PreLoginService } from 'app/@core/service/conatct-us/pre-login.service'
import { SharedModule } from 'app/shared/shared.module'
import { AskAlRajhiComponent } from './ask/ask-alrajhi.component'
import { HelpLandingComponent } from './help-landing/help-landing.component'
import { HelpRoutingModule } from './help-routing.module'


@NgModule({
  declarations: [
    HelpLandingComponent,
    AskAlRajhiComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    HelpRoutingModule
  ],
  providers: [
    PreLoginService,
    AskAlRajhiService
  ],
  exports: [],
})
export class HelpModule {
  
}
