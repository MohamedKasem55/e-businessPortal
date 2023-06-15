import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ChequesRoutingModule} from './cheques-routing.module';
import {ChequesComponent} from "./landing/cheques.component";
import {ChequesService} from "../../@core/service/cheques/cheques.service";
import {SharedModule} from "../../shared/shared.module";
import { CreateNewChequeComponent } from './create-new-cheque/create-new-cheque.component';
import { StopChequeComponent } from './stop-cheque/stop-cheque.component';
import {ChequesUserApprovalComponent} from "./cheques-user-approval/cheques-user-approval.component";


@NgModule({
  declarations: [
    ChequesComponent,
    CreateNewChequeComponent,
    StopChequeComponent,
    ChequesUserApprovalComponent
  ],
  imports: [
    CommonModule,
    ChequesRoutingModule,
    SharedModule
  ],
  providers: [
    ChequesService
  ]
})
export class ChequesModule {
}
