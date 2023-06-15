import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PosRoutingModule} from './pos-routing.module';
import {PosLandingComponent} from './pos-landing/pos-landing.component';
import {SharedModule} from 'app/shared/shared.module';
import {TranslateModule} from '@ngx-translate/core';
import {PosNewReqComponent} from './pos-new-req/pos-new-req.component';
import {POSService} from 'app/@core/service/pos/pos.service';
import {PosBaseComponent} from './pos-base/pos-base.component';
import {PosAnalyticsComponent} from './pos-analytics/pos-analytics.component';

import {PosManagementComponent} from './pos-management/pos-management.component';
import {PosEcommerceComponent} from './pos-ecommerce/pos-ecommerce.component';
import {TerminalStatementComponent} from './pos-ecommerce/terminal-statement/terminal-statement.component';
import {POSTerminalsService} from 'app/@core/service/pos/e-commerce/pos-terminals.service';
import {PosTerminalDetailsComponent} from './pos-ecommerce/pos-terminal-details/pos-terminal-details.component';
import {TerminalsListComponent} from './pos-ecommerce/terminals-list/terminals-list.component';
import {
  TerminalsCombinedFilesComponent
} from './pos-ecommerce/terminals-combined-files/terminals-combined-files.component';
import {ClaimsComponent} from './claims/claims.component';
import {AddClaimComponent} from './claims/add-claim/add-claim.component';
import {ClaimsService} from 'app/@core/service/point-of-sales/claims/claims.service';
import {RequestStatusComponent} from './request-status/request-status.component';
import {RequestStatusService} from 'app/@core/service/pos/request-status/request-status.service';
import {PosMaintenanceComponent} from './pos-maintenance/pos-maintenance.component';
import {
  PosMaintenanceDetailsComponent
} from './pos-maintenance/pos-maintenance-details/pos-maintenance-details.component';
import {PosRequestDetailsComponent} from './pos-requests/pos-request-details/pos-request-details.component';
import {PosRequestComponent} from './pos-requests/pos-request.component';
import {CrmStatusComponent} from "./pos-crm-status/crm-status.component";
import {PosCRMStatusService} from "../../@core/service/pos/crm-status/crm-status.service";
import { CRMStatusDetailsComponent } from './pos-crm-status/details/crm-status-details.component';

@NgModule({
  declarations: [
    PosLandingComponent,
    PosNewReqComponent,
    PosBaseComponent,
    PosMaintenanceDetailsComponent,
    PosMaintenanceComponent,
    PosRequestDetailsComponent,
    PosRequestComponent,
    PosAnalyticsComponent,
    PosManagementComponent,
    PosEcommerceComponent,
    TerminalStatementComponent,
    PosTerminalDetailsComponent,
    TerminalsListComponent,
    TerminalsCombinedFilesComponent,
    ClaimsComponent,
    AddClaimComponent,
    RequestStatusComponent,
    CrmStatusComponent,
    CRMStatusDetailsComponent,
  ],
  providers: [
    POSService,
    POSTerminalsService,
    ClaimsService,
    RequestStatusService,
    PosCRMStatusService],
  imports: [CommonModule, SharedModule, TranslateModule, PosRoutingModule],
})
export class PosModule {
}
