import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {UserManagementService} from 'app/@core/service/company-admin/user-management/users-managment.service';
import {SharedModule} from 'app/shared/shared.module';
import {CompanyAdminLandingComponent} from './company-admin-landing/company-admin-Landing.component';
import {CompanyAdminRoutingModule} from './company-admin-routing.module';
import {UserAccountsComponent} from './user-management/user-details/user-accounts/user-accounts.component';
import {UserInfoComponent} from './user-management/user-details/user-info/user-info.component';
import {UserMainComponent} from './user-management/user-details/user-main/user-main.component';
import {UserPrivilegesComponent} from './user-management/user-details/user-privileges/user-privileges.component';
import {UsersListManagementComponent} from './user-management/users-list/users-list.component';
import {FeesManagementComponent} from './fees-management/fees-management.component';
import {FeesManagmentService} from 'app/@core/service/company-admin/fees-management/fees-management.service';
import {ChangeWorkflowService} from '../../@core/service/company-admin/workflow/change-workflow/change-workflow.service';
import {UserDetailsResolver} from '../../@core/service/company-admin/user-management/user-details.resolver';
import {SmsAlertService} from 'app/@core/service/company-admin/alert-mangement/sms-alert.service';
import {AlertManagementComponent} from './alert-management/alert-management.component';
import {AlertManagementReportComponent} from './alert-management/reports/alert-management-report.component';
import {AlertManagmentRenewalComponent} from './alert-management/renew/renew-sms-subscription.component';
import {AlertManagmentDeactivateComponent} from './alert-management/deactivate/deactivate-sms-sub.component';
import {ChangeWorkflowBaseComponent} from './workflow/change-workflow/change-workflow-base/change-workflow-base.component';
import {WorkflowMakerCheckerComponent} from './workflow/change-workflow/workflow-maker-checker/workflow-maker-checker.component';
import {CompanyAdminBaseComponent} from './company-admin-base/company-admin-base.component';
import {CompanyConfigurationComponent} from './company-configuration/company-configuration.component';
import {CompanyConfigurationService} from 'app/@core/service/company-admin/company-configuration/company-configuration.service';
import {TokenManagmentService} from 'app/@core/service/company-admin/token-management/token-management.service';
import {TokenManagementComponent} from './token-management/token-management.component';
import {OrderSoftTokenComponent} from './token-management/order-token/order-soft-token.component';
import {AlertManagmentRegisterationComponent} from './alert-management/register/register-sms.component';
import {AlertManagmentRegisterationMainComponent} from './alert-management/register-main/register-sms-main.component';
import {AlertManagmentAdminRegisterationComponent} from './alert-management/register-admin/register-sms-admin.component';
import {WorkflowManagementComponent} from "./workflow/workflow-management/workflow-management.component";
import {WorkflowManagementService} from "../../@core/service/company-admin/workflow/workflow-management/workflow-management.service";
import {NonFinancialComponent} from './workflow/workflow-management/non-financial/non-financial.component';
import {ETradeComponent} from './workflow/workflow-management/e-trade/e-trade.component';
import {UpdateCrComponent} from './update-cr/update-cr.component';
import {UpdateCrService} from "../../@core/service/company-admin/update-cr/update-cr.service";
import {EditTokenComponent} from './token-management/edit-token/edit-token.component';
import {ChangeQtlComponent} from './change-qtl/change-qtl.component';
import {ChangeQtlService} from 'app/@core/service/company-admin/change-qtl/change-qtl.service';
import { NationalAddressComponent } from './national-address/national-address.component';
import { NationalAddressService } from 'app/@core/service/company-admin/national-address/national-address.service';

@NgModule({
  imports: [
    CompanyAdminRoutingModule,
    SharedModule,
    CommonModule,
    TranslateModule,
  ],
  declarations: [
    CompanyAdminLandingComponent,
    UsersListManagementComponent,
    UserMainComponent,
    UserInfoComponent,
    UserPrivilegesComponent,
    UserAccountsComponent,
    FeesManagementComponent,
    ChangeWorkflowBaseComponent,
    WorkflowMakerCheckerComponent,
    CompanyAdminBaseComponent,
    AlertManagementComponent,
    AlertManagementReportComponent,
    AlertManagmentRenewalComponent,
    AlertManagmentDeactivateComponent,
    AlertManagmentRegisterationComponent,
    AlertManagmentRegisterationMainComponent,
    AlertManagmentAdminRegisterationComponent,
    CompanyConfigurationComponent,
    TokenManagementComponent,
    OrderSoftTokenComponent,
    EditTokenComponent,
    WorkflowManagementComponent,
    NonFinancialComponent,
    ETradeComponent,
    UpdateCrComponent,
    ChangeQtlComponent,
    NationalAddressComponent,
  ],
  providers: [
    UserManagementService,
    FeesManagmentService,
    ChangeWorkflowService,
    UserDetailsResolver,
    SmsAlertService,
    CompanyConfigurationService,
    TokenManagmentService,
    WorkflowManagementService,
    UpdateCrService,
    ChangeQtlService,
    NationalAddressService
  ],
})
export class CompanyAdminModule {}
