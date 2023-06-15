import {CharityTransferComponent} from './charity-transfer/charity-transfer.component';
import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {TransferLandingComponent} from "./transfer-landing/transfer-landing.component";
import {AlrajhiTransferComponent} from "./alrajhi-transfer/alrajhi-transfer.component";
import {OwnTransferComponent} from "./own-transfer/own-transfer.component";
import {InternationalTransferComponent} from "./international-transfer/international-transfer.component";
import {UrpayTransferComponent} from "./urpay-transfer/urpay-transfer.component";
import {QuickTransferComponent} from "./quick-transfer/quick-transfer.component";
import {LocalTransferComponent} from "./local-transfer/local-transfer.component";
import {ProcessedTrxComponent} from './processed-trx/processed-trx.component';
import {ProcessedTrxDetailsComponent} from './processed-trx/processed-trx-details/processed-trx-details.component';
import {StandingOrderComponent} from "./standing-order/standing-order.component";
import {StandingOrderLandingComponent} from "./standing-order/standing-order-landing/standing-order-landing.component";
import {AddBeneficiaryComponent} from './beneficiaries/add-beneficiary/add-beneficiary.component';
import {BeneficiariesComponent} from "./beneficiaries/beneficiaries.component";
import {EditBeneficiaryComponent} from './beneficiaries/edit-beneficiary/edit-beneficiary.component';
import {BulkPaymentTransferComponent} from "./bulk-payment-transfer/bulk-payment-transfer.component";
import {TransferUserApprovalComponent} from "./transfer-user-approval/transfer-user-approval.component";
import {
  SingleCharityTransferComponent
} from './charity-transfer/single-charity-transfer/single-charity-transfer.component';
import {StandingOrderDeleteComponent} from "./standing-order/standing-order-delete/standing-order-delete.component";
import {StandingOrderEditComponent} from "./standing-order/standing-order-edit/standing-order-edit.component";
import {AliasManagementComponent} from './alias-management/alias-management.component';
import {PagesGuard} from "../pages.guard";


const routes: Routes = [
  {
    path: '',
    component: TransferLandingComponent,
  },
  {
    path: 'alrajhi-transfer',
    component: AlrajhiTransferComponent,
    canActivate: [PagesGuard],
    data: {service: 'AlRajhiTransfer'}
  },
  {
    path: 'between-accounts',
    component: OwnTransferComponent,
    canActivate: [PagesGuard],
    data: {service: 'BetweenAccounts'}
  },
  {
    path: 'international-transfer',
    component: InternationalTransferComponent,
    canActivate: [PagesGuard],
    data: {service: 'InternationalTransfer'}
  },
  {
    path: 'urpay-transfer',
    component: UrpayTransferComponent,
    canActivate: [PagesGuard],
    data: {service: 'UrpayTransfer'}
  },
  {
    path: 'quick-transfer',
    component: QuickTransferComponent,
    canActivate: [PagesGuard],
    data: {service: 'QuickTransfer'}
  },
  {
    path: 'local-transfer',
    component: LocalTransferComponent,
    canActivate: [PagesGuard],
    data: {service: 'LocalTransfer'}
  },
  {
    path: 'processed-trx',
    component: ProcessedTrxComponent,
    canActivate: [PagesGuard],
    data: {service: 'TransferProcessedTransaction'}
  },
  {
    path: 'processed-trx-details',
    component: ProcessedTrxDetailsComponent,
    canActivate: [PagesGuard],
    data: {service: 'TransferProcessedTransaction'}
  },
  {
    path: 'standing-orders',
    component: StandingOrderLandingComponent,
    canActivate: [PagesGuard],
    data: {service: 'StandingOrders'}
  },
  {
    path: 'standing-orders/add',
    component: StandingOrderComponent,
    canActivate: [PagesGuard],
    data: {service: 'StandingOrderList'}
  },
  {
    path: 'standing-orders/delete',
    component: StandingOrderDeleteComponent,
    canActivate: [PagesGuard],
    data: {service: 'StandingOrderList'}
  },
  {
    path: 'standing-orders/edit',
    component: StandingOrderEditComponent,
    canActivate: [PagesGuard],
    data: {service: 'StandingOrderList'}
  },
  {
    path: "approval",
    component: TransferUserApprovalComponent,
    canActivate: [PagesGuard],
    data: {service: 'TransferRequestStatus'}
  },
  {
    path: 'beneficiaries',
    component: BeneficiariesComponent,
    canActivate: [PagesGuard],
    data: {service: 'Beneficiaries'}
  },
  {
    path: 'add-beneficiaries',
    component: AddBeneficiaryComponent,
    canActivate: [PagesGuard],
    data: {service: 'BeneficiaryAdd'}
  },
  {
    path: 'edit-beneficiaries',
    component: EditBeneficiaryComponent,
    canActivate: [PagesGuard],
    data: {service: 'BeneficiaryList'}
  },
  {
    path: 'bulk-payment',
    component: BulkPaymentTransferComponent,
    canActivate: [PagesGuard],
    data: {service: 'BulkPaymentsMenu'}
  },
  {
    path: 'charity-transfer',
    component: CharityTransferComponent,
    canActivate: [PagesGuard],
    data: {service: 'CharityTransfer'}
  },
  {
    path: 'single-charity-transfer',
    component: SingleCharityTransferComponent,
    canActivate: [PagesGuard],
    data: {service: 'CharityTransfer'}
  },
  {
    path: 'alias-management',
    component: AliasManagementComponent,
    canActivate: [PagesGuard],
    data: {service: 'AdminManagement'}
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransferRoutingModule {
}
