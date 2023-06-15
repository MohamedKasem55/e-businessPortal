import {NgModule} from '@angular/core';

import {AccountsRoutingModule} from './accounts-routing.module';
import {AccountsLandingComponent} from "./accounts-landing/accounts-landing.component";
import {SharedModule} from "../../shared/shared.module";
import {AccountStatementComponent} from './account-statement/account-statement.component';
import {CommonModule} from "@angular/common";
import {NgChartsModule} from "ng2-charts";
import {DocumentsComponent} from './documents/documents.component';
import {RequestNewDocumentComponent} from './documents/request-new-document/request-new-document.component';
import {VatInvoiceComponent} from './vat-invoice/vat-invoice.component';
import {BFMDashboardComponent} from './BFM/bfm-dashboard/bfm-dashboard.component';
import {BalanceCertificateUserApprovalComponent} from './balance-certificate/balance-certifcate-user-approval/balance-certifcate-user-approval/balance-certificate-user-approval.component';
import {AccountsService} from "../../@core/service/accounts/accounts.service";
import { NickNameComponent } from './nickname/edit-nickname.component';
import { AddAccountComponent } from './add-account/add-account.component';
import { CompanyConfigurationService } from 'app/@core/service/company-admin/company-configuration/company-configuration.service';


@NgModule({
  declarations: [
    AccountsLandingComponent,
    AccountStatementComponent,
    DocumentsComponent,
    RequestNewDocumentComponent,
    VatInvoiceComponent,
    BFMDashboardComponent,
    BalanceCertificateUserApprovalComponent,
    NickNameComponent,
    AddAccountComponent
  ],
  imports: [
    CommonModule,
    AccountsRoutingModule,
    SharedModule,
    NgChartsModule
  ],
  providers: [
    AccountsService,
    CompanyConfigurationService
  ]
})
export class AccountsModule {
}
