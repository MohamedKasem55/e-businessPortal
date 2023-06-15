import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  COM_AD_ACTIVITY_LOGS,
  COM_AD_ALERT_MANAGEMENT,
  COM_AD_ALERT_MANAGEMENT_REPORT,
  COM_AD_ALERT_MANAGEMENT_SMS_DEACTIVATE,
  COM_AD_ALERT_MANAGEMENT_SMS_REGISTER,
  COM_AD_ALERT_MANAGEMENT_SMS_REGISTER_ADMIN,
  COM_AD_ALERT_MANAGEMENT_SMS_REGISTER_USER,
  COM_AD_ALERT_MANAGEMENT_SMS_RENEWAL,
  COM_AD_CHANGE_QTL,
  COM_AD_FEES,
  COM_AD_NATIONAL_ADDRESS,
  COM_AD_TOKEN_MANAGEMENT,
  COM_AD_TOKEN_MANAGEMENT_EDIT_TOKEN,
  COM_AD_TOKEN_MANAGEMENT_ORDER_TOKEN,
  COM_AD_UPDATE_CR,
  COM_AD_WORKFLOW,
  COM_AD_WORKFLOW_MAKER_CHECKER, COM_AD_WORKFLOW_MANAGEMENT, COM_AD_WORKFLOW_MANAGEMENT_E_TRADE, COM_AD_WORKFLOW_MANAGEMENT_NON_FINANCIAL
} from "app/@core/constants/pages-urls-constants";
import {AlertManagementComponent} from "./alert-management/alert-management.component";
import {AlertManagmentDeactivateComponent} from "./alert-management/deactivate/deactivate-sms-sub.component";
import {AlertManagmentRenewalComponent} from "./alert-management/renew/renew-sms-subscription.component";
import {AlertManagementReportComponent} from "./alert-management/reports/alert-management-report.component";
import {CompanyAdminLandingComponent} from "./company-admin-landing/company-admin-Landing.component";
import {CompanyConfigurationComponent } from "./company-configuration/company-configuration.component";
import { FeesManagementComponent } from "./fees-management/fees-management.component";
import { OrderSoftTokenComponent } from "./token-management/order-token/order-soft-token.component";
import { TokenManagementComponent } from "./token-management/token-management.component";
import { UserMainComponent} from "./user-management/user-details/user-main/user-main.component";
import {UsersListManagementComponent} from "./user-management/users-list/users-list.component";
import {ChangeWorkflowBaseComponent} from "./workflow/change-workflow/change-workflow-base/change-workflow-base.component";
import {UserDetailsResolver} from "app/@core/service/company-admin/user-management/user-details.resolver";
import {WorkflowMakerCheckerComponent} from "./workflow/change-workflow/workflow-maker-checker/workflow-maker-checker.component";
import {WorkflowManagementComponent} from "./workflow/workflow-management/workflow-management.component";
import {NonFinancialComponent} from "./workflow/workflow-management/non-financial/non-financial.component";
import {ETradeComponent} from "./workflow/workflow-management/e-trade/e-trade.component";
import { ActivityLogsComponent } from '../user-profile/activity-logs/activity-logs.component';
import { AlertManagmentRegisterationComponent } from './alert-management/register/register-sms.component';
import { AlertManagmentRegisterationMainComponent } from './alert-management/register-main/register-sms-main.component';
import { AlertManagmentAdminRegisterationComponent } from './alert-management/register-admin/register-sms-admin.component';
import { UpdateCrComponent } from './update-cr/update-cr.component';
import { EditTokenComponent } from './token-management/edit-token/edit-token.component';
import { ChangeQtlComponent } from './change-qtl/change-qtl.component';
import {PagesGuard} from "../pages.guard";
import { NationalAddressComponent } from './national-address/national-address.component';
const routes: Routes = [
  {
    path: '',
    component: CompanyAdminLandingComponent,
  },
  {
    path: 'alrajhi-user-management',
    component: UsersListManagementComponent,
    canActivate: [PagesGuard],
    data: {service: 'UsersMenu'},
  },
  {
    path: 'alrajhi-user-details/:userId',
    component: UserMainComponent,
    canActivate: [PagesGuard],
    data: {service: 'UsersList'},
    resolve: {
      userDetails: UserDetailsResolver,
    },
  },
  {
    path: 'alrajhi-user-details',
    component: UserMainComponent,
    canActivate: [PagesGuard],
    data: {service: 'UsersList'},
  },
  {
    path: COM_AD_FEES,
    component: FeesManagementComponent,
    canActivate: [PagesGuard],
    data: {service: 'FeesAdminMenu'},
  },
  {
    path: COM_AD_WORKFLOW,
    component: ChangeWorkflowBaseComponent,
    canActivate: [PagesGuard],
    data: {service: 'companyAdmin'},
  },
  {
    path: COM_AD_WORKFLOW_MAKER_CHECKER,
    component: WorkflowMakerCheckerComponent,
    canActivate: [PagesGuard],
    data: {service: 'companyAdmin'},
  },
  {
    path: COM_AD_ALERT_MANAGEMENT,
    component: AlertManagementComponent,
    canActivate: [PagesGuard],
    data: {service: 'AlertsAdminMenu'},
  },
  {
    path: COM_AD_ALERT_MANAGEMENT_REPORT,
    component: AlertManagementReportComponent,
    canActivate: [PagesGuard],
    data: {service: 'AlertsAdminSMSReport'},
  },
  {
    path: COM_AD_ALERT_MANAGEMENT_SMS_RENEWAL,
    component: AlertManagmentRenewalComponent,
    canActivate: [PagesGuard],
    data: {service: 'AlertsAdminSMSRenewal'},
  },
  {
    path: COM_AD_ALERT_MANAGEMENT_SMS_DEACTIVATE,
    component: AlertManagmentDeactivateComponent,
    canActivate: [PagesGuard],
    data: {service: 'AlertsAdminSMSDeactivate'},
  },
  {
    path: 'company-configuration',
    component: CompanyConfigurationComponent,
    canActivate: [PagesGuard],
    data: {service: 'CustomProperties'},
  },
  {
    path: COM_AD_TOKEN_MANAGEMENT,
    component: TokenManagementComponent,
    canActivate: [PagesGuard],
    data: {service: 'TokensManagementAdmin'},
  },
  {
    path: COM_AD_ACTIVITY_LOGS,
    component: ActivityLogsComponent,
    canActivate: [PagesGuard],
    data: {service: 'ActivityLogsAdmin'},
  },
  {
    path: COM_AD_TOKEN_MANAGEMENT_ORDER_TOKEN,
    component: OrderSoftTokenComponent,
    canActivate: [PagesGuard],
    data: {service: 'TokensManagementAdmin'},
  },
  {
    path: COM_AD_TOKEN_MANAGEMENT_EDIT_TOKEN,
    component: EditTokenComponent,
    canActivate: [PagesGuard],
    data: {service: 'TokensManagementAdmin'},
  },
  {
    path: COM_AD_WORKFLOW_MANAGEMENT,
    component: WorkflowManagementComponent,
    canActivate: [PagesGuard],
    data: {service: 'WorkflowMenu'},
  },
  {
    path: COM_AD_WORKFLOW_MANAGEMENT +'/' + COM_AD_WORKFLOW_MANAGEMENT_NON_FINANCIAL,
    component: NonFinancialComponent,
    canActivate: [PagesGuard],
    data: {service: 'WorkflowNonFinancial'},
  },
  {
    path: COM_AD_WORKFLOW_MANAGEMENT +'/' + COM_AD_WORKFLOW_MANAGEMENT_E_TRADE,
    component: ETradeComponent,
    canActivate: [PagesGuard],
    data: {service: 'WorkflowAccountsRules'},
  },
  {
    path: COM_AD_ALERT_MANAGEMENT_SMS_REGISTER,
    component: AlertManagmentRegisterationMainComponent,
    canActivate: [PagesGuard],
    data: {service: 'AlertsAdminSMSRegistration'},
  },
  {
    path: COM_AD_ALERT_MANAGEMENT_SMS_REGISTER_ADMIN,
    component: AlertManagmentAdminRegisterationComponent,
    canActivate: [PagesGuard],
    data: {service: 'AlertsAdminSMSRegistration'},
  },
  {
    path: COM_AD_ALERT_MANAGEMENT_SMS_REGISTER_USER,
    component: AlertManagmentRegisterationComponent,
    canActivate: [PagesGuard],
    data: {service: 'AlertsAdminSMSRegistration'},
  },
  {
    path: COM_AD_UPDATE_CR,
    component: UpdateCrComponent,
    canActivate: [PagesGuard],
    data: {service: 'UpdateCR'},
  },
  {
    path: COM_AD_CHANGE_QTL,
    component: ChangeQtlComponent,
    canActivate: [PagesGuard],
    data: {service: 'companyAdmin'},
  },
  {
    path: COM_AD_NATIONAL_ADDRESS,
    component: NationalAddressComponent,
    canActivate: [PagesGuard],
    data: {service: 'NationalAddress'},
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyAdminRoutingModule {}
