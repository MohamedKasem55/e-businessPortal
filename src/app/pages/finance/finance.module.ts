import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {FinanceRoutingModule} from './finance-routing.module';
import {POSService} from "../../@core/service/pos/pos.service";
import {RequestService} from "../../@core/service/finance/request/request.service";
import { DataService } from '../../@core/service/finance/data.service';
import { FinanceBaseComponent } from './finance-base/finance-base.component';
import { SharedModule } from '../../shared/shared.module';
import { PosService } from '../../@core/service/finance/pos/pos.service';


@NgModule({
  declarations: [FinanceBaseComponent],
  imports: [
    CommonModule,
    FinanceRoutingModule,
    SharedModule


  ], providers: [
    POSService,
    RequestService,
    DataService,
    PosService

  ]
})
export class FinanceModule {
}
