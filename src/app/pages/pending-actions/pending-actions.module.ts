import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {SharedModule} from "../../shared/shared.module";
import {TranslateModule} from "@ngx-translate/core";
import {PendingActionsRoutingModule} from "./pending-actions-routing.module";
import {PendingActionsTableComponent} from "./generic-table/pending-actions-table.component";
import {WorkflowDetailsComponent} from "./workflow-details/workflow-details.component";
import {PendingActionsService} from "../../@core/service/pending-actions/pending-actions-service";
import {PendingActionsComponent} from "./pending-actions.component";
import { AddBillService } from "app/@core/service/payments/add-bill/add-bill.service";


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    TranslateModule,
    PendingActionsRoutingModule
  ],
  declarations: [
    PendingActionsTableComponent,
    WorkflowDetailsComponent,
    PendingActionsComponent
  ],
  providers:[
    PendingActionsService,
    AddBillService
  ]
})
export class PendingActionsModule { }
