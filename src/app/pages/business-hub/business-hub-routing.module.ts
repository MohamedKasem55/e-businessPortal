import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusinessDetailsComponent } from './business-details/business-details.component';
import { BusinessHubLandingComponent } from './business-hub-landing/business-hub-landing.component';
import { SubscriptionFlowComponent } from './subscription-flow/subscription-flow.component';
import {PagesGuard} from "../pages.guard";

const routes: Routes = [
  {
    path: '',
    component: BusinessHubLandingComponent,
  },
  {
    path: "details",
    component: BusinessDetailsComponent,
  },
  {
    path: "subscription-flow",
    component: SubscriptionFlowComponent,
    canActivate: [PagesGuard],
    data: {service: 'BusinessHub'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessHubRoutingModule { }
