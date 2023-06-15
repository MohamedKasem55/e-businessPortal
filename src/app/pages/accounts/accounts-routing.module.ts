import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AccountsLandingComponent} from "./accounts-landing/accounts-landing.component";
import {AccountStatementComponent} from "./account-statement/account-statement.component";
import {DocumentsComponent} from "./documents/documents.component";
import {RequestNewDocumentComponent} from "./documents/request-new-document/request-new-document.component";
import {VatInvoiceComponent} from "./vat-invoice/vat-invoice.component";
import {BFMDashboardComponent} from './BFM/bfm-dashboard/bfm-dashboard.component';
import {ManageConsents} from'./BFM/manage-consents/manage-consents.component';
import {BalanceCertificateUserApprovalComponent} from "./balance-certificate/balance-certifcate-user-approval/balance-certifcate-user-approval/balance-certificate-user-approval.component";
import {NickNameComponent} from './nickname/edit-nickname.component';
import {AddAccountComponent} from './add-account/add-account.component';
import {PagesGuard} from "../pages.guard";

const routes: Routes = [
  {
    path: "",
    component: AccountsLandingComponent
  },
  {
    path: "statement",
    component: AccountStatementComponent,
    canActivate: [PagesGuard],
    data: {service: 'AccountsStatement'}
  },
  {
    path: "vat",
    component: VatInvoiceComponent,
    canActivate: [PagesGuard],
    data: {service: 'TaxInvoice'}
  },
  {
    path: "documents",
    component: DocumentsComponent,
    canActivate: [PagesGuard],
    data: {service: 'documents'}
  },
  {
    path: "documents/request-new",
    component: RequestNewDocumentComponent,
    canActivate: [PagesGuard],
    data: {service: 'request-documents'}
  },
  {
    path: "bfm",
    component: BFMDashboardComponent
  },
  {
    path:"bfm/manage-consents",
    component: ManageConsents

  },
  {
    path: "nickname",
    component: NickNameComponent,
    canActivate: [PagesGuard],
    data: {service: 'AccountsNickName'}
  },
  {
    path: "documents/balanceCertificate/request-status",
    component: BalanceCertificateUserApprovalComponent,
    canActivate: [PagesGuard],
    data: {service: 'BalanceCertificateRequestStatus'}
  },
  {
    path: 'add-account',
    component: AddAccountComponent,
    canActivate: [PagesGuard],
    data: {service: 'AddAccount'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],

})
export class AccountsRoutingModule {
}
