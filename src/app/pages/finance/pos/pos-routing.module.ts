import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommodityDetails } from './execution/steps/commodity-details/commodity-details.component';
import { CommodityPurchase } from './execution/steps/commodity-purchase/commodity-purchase.component';
import { ContractCommodity } from './execution/steps/contract-commodity/contract-commodity.component';
import { ExecutionResults } from './execution/steps/execution-results/results.component';
import { FinalOffer } from './execution/steps/final-offer/final-offer.component';
import { InitiateSanad } from './execution/steps/initiate-sanad/initiate-sanad.component';
import { SellCommodity } from './execution/steps/sell-commodity/sell-commodity.component';
import { AccountBusinessDetails } from './los/steps/account-business-details/account-business-details.component';
import { DocumentationUpload } from './los/steps/documentation-upload/documentation-upload.component';
import { FinancialDetails } from './los/steps/financial-details/financial-details.component';
import { InitialOffer } from './los/steps/initial-offer/initial-offer.component';
import { LosResults } from './los/steps/los-results/results.component';
import { LosSummary } from './los/steps/los-summary/summary.component';
import { IvrCallComponent } from './execution/steps/ivr-call/ivr-call.component';

const routes: Routes = [
  { path: '', component: AccountBusinessDetails },
  { path: 'financial-details', component: FinancialDetails },
  { path: 'initial-offer', component: InitialOffer },
  { path: 'doc-upload', component: DocumentationUpload },
  { path: 'los-summary', component: LosSummary },
  { path: 'los-results', component: LosResults },
  { path: 'commodity-details', component: CommodityDetails },
  { path: 'commodity-purchase', component: CommodityPurchase },
  { path: 'contract-commodity', component: ContractCommodity },
  { path: 'execution-results', component: ExecutionResults },
  { path: 'sell-commodity', component: SellCommodity },
  { path: 'final-offer', component: FinalOffer },
  { path: 'initiate-sanad', component: InitiateSanad },
  { path: 'ivr-call-pos', component: IvrCallComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PosRoutingModule {
}
