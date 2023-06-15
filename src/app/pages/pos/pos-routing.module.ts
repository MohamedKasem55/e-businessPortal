import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {
  POS_ANLYTIC,
  POS_CLM,
  POS_ECOM,
  POS_ECOM_TERMINAL_DTLS,
  POS_ECOM_TERMINAL_STATEMENT,
  POS_ECOM_TERMINALS_COMBINED,
  POS_ECOM_TERMINALS_LIST,
  POS_MAINTENANCE,
  POS_MAINTENANCE_DETAILS,
  POS_MNG,
  POS_NEW_REQUEST_STATUS,
  POS_NW_REQ_STATUS,
  POS_NW_REQQ,
  POS_SERVICES,
  POS_SERVICES_DETAILS,
  POS_CRM_STATUS,
  POS_CRM_STATUS_DETAILS,
} from 'app/@core/constants/pages-urls-constants';
import {PosAnalyticsComponent} from './pos-analytics/pos-analytics.component';
import {PosEcommerceComponent} from './pos-ecommerce/pos-ecommerce.component';
import {TerminalStatementComponent} from './pos-ecommerce/terminal-statement/terminal-statement.component';
import {PosTerminalDetailsComponent} from './pos-ecommerce/pos-terminal-details/pos-terminal-details.component';
import {PosLandingComponent} from './pos-landing/pos-landing.component';
import {PosManagementComponent} from './pos-management/pos-management.component';
import {PosNewReqComponent} from './pos-new-req/pos-new-req.component';
import {TerminalsListComponent} from './pos-ecommerce/terminals-list/terminals-list.component';
import {TerminalsCombinedFilesComponent} from './pos-ecommerce/terminals-combined-files/terminals-combined-files.component';
import {ClaimsComponent} from './claims/claims.component';
import {RequestStatusComponent} from './request-status/request-status.component';
import {PosMaintenanceComponent} from './pos-maintenance/pos-maintenance.component';
import {PosMaintenanceDetailsComponent} from './pos-maintenance/pos-maintenance-details/pos-maintenance-details.component';
import {PosRequestDetailsComponent} from './pos-requests/pos-request-details/pos-request-details.component';
import {PosRequestComponent} from './pos-requests/pos-request.component';
import {PagesGuard} from "../pages.guard";
import {CrmStatusComponent} from "./pos-crm-status/crm-status.component";
import { CRMStatusDetailsComponent } from './pos-crm-status/details/crm-status-details.component';

const routes: Routes = [
  {
    path: '',
    component: PosLandingComponent,
  },
  {
    path: POS_NW_REQQ,
    component: PosNewReqComponent,
    canActivate: [PagesGuard],
    data: {service: 'PosRequestMenu'},
  },
  {
    path: POS_MAINTENANCE_DETAILS,
    component: PosMaintenanceDetailsComponent,
    canActivate: [PagesGuard],
    data: {service: 'PosMaintenances'},
  },
  {
    path: POS_MAINTENANCE,
    component: PosMaintenanceComponent,
    canActivate: [PagesGuard],
    data: {service: 'PosMaintenances'},
  },
  {
    path: POS_SERVICES_DETAILS,
    component: PosRequestDetailsComponent,
    canActivate: [PagesGuard],
    data: {service: 'PosMaintenances'},
  },
  {
    path: POS_SERVICES,
    component: PosRequestComponent,
    canActivate: [PagesGuard],
    data: {service: 'PosMaintenances'},
  },
  {
    path: POS_MNG,
    component: PosManagementComponent,
    canActivate: [PagesGuard],
    data: {service: 'MerchantPortal'},
  },
  {
    path: POS_CLM,
    component: ClaimsComponent,
    canActivate: [PagesGuard],
    data: {service: 'ClaimsMenu'},
  },
  // {
  //   path: POS_CLM,
  //   component: ClaimsComponent,
  //   canActivate: [PagesGuard],
  //   data: {service: 'ClaimsMenu'},
  // },
  // {
  //   path: POS_A_CLM,
  //   component: AddClaimComponent,
  //   canActivate: [PagesGuard],
  //   data: {service: 'ClaimsMenu'},
  // },
  {
    path: POS_ANLYTIC,
    component: PosAnalyticsComponent,
    canActivate: [PagesGuard],
    data: {service: 'POSDashboard'},
  },
  {
    path: POS_ECOM,
    component: PosEcommerceComponent,
    canActivate: [PagesGuard],
    data: {service: 'PosReports'},
  },
  {
    path: POS_ECOM_TERMINALS_LIST,
    component: TerminalsListComponent,
    canActivate: [PagesGuard],
    data: {service: 'PosStatementList'},
  },
  {
    path: POS_ECOM_TERMINAL_DTLS,
    component: PosTerminalDetailsComponent,
    canActivate: [PagesGuard],
    data: {service: 'PosStatementList'},
  },
  {
    path: POS_ECOM_TERMINAL_STATEMENT,
    component: TerminalStatementComponent,
    canActivate: [PagesGuard],
    data: {service: 'PosStatementTerminalStatement'},
  },
  {
    path: POS_ECOM_TERMINALS_COMBINED,
    component: TerminalsCombinedFilesComponent,
    canActivate: [PagesGuard],
    data: {service: 'PosStatementTerminalStatement'},
  },
  {
    path: POS_NW_REQ_STATUS,
    component: RequestStatusComponent,
    canActivate: [PagesGuard],
    data: {service: 'PosRequestMenu'},
  },
  {
    path: POS_NEW_REQUEST_STATUS,
    component: RequestStatusComponent,
    canActivate: [PagesGuard],
    data: {service: 'PosRequestMenu'},
  },
  {
    path: POS_CRM_STATUS,
    component: CrmStatusComponent,
    canActivate: [PagesGuard],
    data: {service: 'CRMStatusRequest'},
  },
  {
    path: POS_CRM_STATUS_DETAILS,
    component: CRMStatusDetailsComponent,
    canActivate: [PagesGuard],
    data: {service: 'CRMStatusRequest'},
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PosRoutingModule {
}
