import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';

import {FleetRoutingModule} from './fleet-routing.module';
import {SharedModule} from '../../../shared/shared.module';
import {TranslateModule} from '@ngx-translate/core';
import {NgChartsModule} from 'ng2-charts';
import {BusinessDetailsComponent} from './steps/new-request-steps/business-details/business-details.component';
import {LinkedAccountComponent} from './steps/new-request-steps/linked-account/linked-account.component';
import {VehicleDetailsComponent} from './steps/new-request-steps/vehicle-details/vehicle-details.component';

import {
  UploadExQuotationComponent
} from './upload-external-quotation/upload-ex-quotation/upload-ex-quotation.component';
import {SummaryComponent} from './steps/new-request-steps/summary/summary.component';
import {InitialOfferComponent} from './steps/new-request-steps/initial-offer/initial-offer.component';
import {
  DocumentationUploadComponent
} from './steps/new-request-steps/documentation-upload/documentation-upload.component';
import {FinalOfferComponent} from "./final-request/final-offer/final-offer.component";
import {ResultComponent} from './steps/new-request-steps/result/result.component';

import {ContractConfirmationComponent} from './final-request/contract-confirmation/contract-confirmation.component';
import {Sanad} from "./final-request/sanad/initiate-sanad.component";
import {IvrCallComponent} from './final-request/ivr-call/ivr-call.component';
import { FleetGuard } from './fleet.guard';


@NgModule({
  declarations: [
    BusinessDetailsComponent,
    LinkedAccountComponent,
    VehicleDetailsComponent,
    UploadExQuotationComponent,
    SummaryComponent,
    InitialOfferComponent,
    DocumentationUploadComponent,
    FinalOfferComponent,
    ResultComponent,
    ContractConfirmationComponent,
    Sanad,
    IvrCallComponent,
  ],
  imports: [
    CommonModule,
    FleetRoutingModule,
    SharedModule,
    TranslateModule,
    NgChartsModule,
  ],
  providers:[
    FleetGuard
  ]
})
export class FleetModule {
}
