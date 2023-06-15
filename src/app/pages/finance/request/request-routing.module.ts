import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AllBranchesComponent} from './all-branches/all-branches.component';
import {FinanceProductsComponent} from './finance-products/finance-products.component';
import {RequestRequiredDocComponent} from "./request-required-doc/request-required-doc.component";
import {BreakdownComponent} from "./breakdown/breakdown.component";
import {ProductSelectComponent} from "./internal-quotation/product-select/product-select.component";
import {FinalOfferComponent} from "../fleet/final-request/final-offer/final-offer.component";
import {
  ContractConfirmationComponent
} from "../fleet/final-request/contract-confirmation/contract-confirmation.component";
import {Sanad} from "../fleet/final-request/sanad/initiate-sanad.component";
import {IvrCallComponent} from "../fleet/final-request/ivr-call/ivr-call.component";
import {FleetChildDossierComponent} from "./fleet-child-dossier/fleet-child-dossier.component";

const routes: Routes = [
  {
    path: 'select-product',
    component: FinanceProductsComponent
  },
  {
    path: 'child-dossiers',
    component: FleetChildDossierComponent
  },
  {
    path: 'all-branches',
    component: AllBranchesComponent
  },
  {
    path: 'required-Docs',
    component: RequestRequiredDocComponent
  },
  {
    path: 'breakdown',
    component: BreakdownComponent
  },
  {
    path: 'internal-quot',
    component: ProductSelectComponent
  }, {
    path: 'final-offer',
    component: FinalOfferComponent
  }, {
    path: 'contract',
    component: ContractConfirmationComponent
  }, {
    path: 'sanad',
    component: Sanad
  }, {
    path: 'ivr-call',
    component: IvrCallComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestRoutingModule {
}
