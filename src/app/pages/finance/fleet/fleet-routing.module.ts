import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BusinessDetailsComponent} from './steps/new-request-steps/business-details/business-details.component';
import {LinkedAccountComponent} from './steps/new-request-steps/linked-account/linked-account.component';
import {VehicleDetailsComponent} from './steps/new-request-steps/vehicle-details/vehicle-details.component';
import {
  UploadExQuotationComponent
} from './upload-external-quotation/upload-ex-quotation/upload-ex-quotation.component';
import {SummaryComponent} from './steps/new-request-steps/summary/summary.component';
import {InitialOfferComponent} from "./steps/new-request-steps/initial-offer/initial-offer.component"
import {
  DocumentationUploadComponent
} from './steps/new-request-steps/documentation-upload/documentation-upload.component';
import {ResultComponent} from './steps/new-request-steps/result/result.component';


const routes: Routes = [
  {path: '', component: BusinessDetailsComponent},
  {path: 'business-details', component: BusinessDetailsComponent},
  {path: 'linked-account', component: LinkedAccountComponent},
  {
    path: 'vehicle-details',
    component: VehicleDetailsComponent,
  },
  {
    path: 'summary',
    component: SummaryComponent,
  },
  {path: 'upload-external-quotation', component: UploadExQuotationComponent},
  {path: 'upload-docs', component: DocumentationUploadComponent},
  {path: 'init-offer', component: InitialOfferComponent},
  {path: 'result', component: ResultComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FleetRoutingModule {
}
