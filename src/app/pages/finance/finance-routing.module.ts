import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FinanceLandingComponent} from './request/finance-landing/finance-landing.component';
import {PagesGuard} from "../pages.guard";

const routes: Routes = [
  {
    path: '',
    component: FinanceLandingComponent,
  },
  {
    path: 'request',
    loadChildren: () =>
      import('./request/request.module').then((m) => m.RequestModule),
    canActivate: [PagesGuard],
    data: {service: 'POSFinanceProduct'},
  },
  {
    path: 'fleet',
    loadChildren: () =>
      import('./fleet/fleet.module').then((m) => m.FleetModule),
    canActivate: [PagesGuard],
    data: {service: 'POSFinanceProduct'},
  },
  {
    path: 'pos',
    loadChildren: () =>
      import('./pos/pos.module').then((m) => m.PosModule),
    canActivate: [PagesGuard],
    data: {service: 'POSFinanceProduct'},
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinanceRoutingModule {
}
