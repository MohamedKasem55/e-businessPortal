import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../../shared/shared.module';
import { PosRoutingModule } from './pos-routing.module';
import { AccountBusinessDetails } from './los/steps/account-business-details/account-business-details.component';
import { FinancialDetails } from './los/steps/financial-details/financial-details.component';
import { InitialOffer } from './los/steps/initial-offer/initial-offer.component';
import { DocumentationUpload } from './los/steps/documentation-upload/documentation-upload.component';
import { LosSummary } from './los/steps/los-summary/summary.component';
import { LosResults } from './los/steps/los-results/results.component';
import { CommodityDetails } from './execution/steps/commodity-details/commodity-details.component';
import { CommodityPurchase } from './execution/steps/commodity-purchase/commodity-purchase.component';
import { ContractCommodity } from './execution/steps/contract-commodity/contract-commodity.component';
import { ExecutionResults } from './execution/steps/execution-results/results.component';
import { SellCommodity } from './execution/steps/sell-commodity/sell-commodity.component';
import { FinalOffer } from './execution/steps/final-offer/final-offer.component';
import { InitiateSanad } from './execution/steps/initiate-sanad/initiate-sanad.component';
import { IvrCallComponent } from './execution/steps/ivr-call/ivr-call.component';

@NgModule({
  declarations: [
    AccountBusinessDetails,
    FinancialDetails,
    InitialOffer,
    DocumentationUpload,
    LosSummary,
    LosResults,
    CommodityDetails,
    CommodityPurchase,
    ContractCommodity,
    ExecutionResults,
    SellCommodity,
    FinalOffer,
    InitiateSanad,
    IvrCallComponent,
  ],
  imports: [CommonModule, PosRoutingModule, SharedModule]
})
export class PosModule {
}
