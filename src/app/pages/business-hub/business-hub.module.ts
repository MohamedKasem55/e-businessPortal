import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessHubRoutingModule } from './business-hub-routing.module';
import { BusinessHubLandingComponent } from './business-hub-landing/business-hub-landing.component';
import { BusinessDetailsComponent } from './business-details/business-details.component';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'app/shared/shared.module';
import { SubscriptionFlowComponent } from './subscription-flow/subscription-flow.component';
import { BusinessHubService } from "../../@core/service/business-hub/business-hub.service";


@NgModule({
  declarations: [
    BusinessHubLandingComponent,
    BusinessDetailsComponent,
    SubscriptionFlowComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    TranslateModule,
    BusinessHubRoutingModule
  ],
  providers: [
    BusinessHubService
  ]
})
export class BusinessHubModule { }
