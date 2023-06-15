import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {RequestRoutingModule} from './request-routing.module';
import {FinanceProductsComponent} from './finance-products/finance-products.component';
import {SharedModule} from '../../../shared/shared.module';
import {TranslateModule} from '@ngx-translate/core';
import {AllBranchesComponent} from './all-branches/all-branches.component';
import {CurrentFinanceComponent} from './current-finance/current-finance.component';
import {RequestedFinanceComponent} from './requested-finance/requested-finance.component';
import {FinanceLandingComponent} from './finance-landing/finance-landing.component';
import {NgChartsModule} from 'ng2-charts';
import {RequestRequiredDocComponent} from './request-required-doc/request-required-doc.component';
import {BreakdownComponent} from './breakdown/breakdown.component';
import {ProductSelectComponent} from "./internal-quotation/product-select/product-select.component";
import {FleetChildDossierComponent} from './fleet-child-dossier/fleet-child-dossier.component';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    FinanceProductsComponent,
    AllBranchesComponent,
    CurrentFinanceComponent,
    RequestedFinanceComponent,
    FleetChildDossierComponent,
    FinanceLandingComponent,
    RequestRequiredDocComponent,
    BreakdownComponent,
    ProductSelectComponent,
    FleetChildDossierComponent,
  ],
  imports: [
    CommonModule,
    RequestRoutingModule,
    SharedModule,
    TranslateModule,
    NgChartsModule,
    NgbAccordionModule,

  ],

})
export class RequestModule {
}
