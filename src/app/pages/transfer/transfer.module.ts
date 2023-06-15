import {CommonModule, Location} from "@angular/common";
import {NgModule} from "@angular/core";
import {TranslateModule} from "@ngx-translate/core";
import {AliasManagementService} from "app/@core/service/transfer/alias-management/alias-management.service";
import {ProcessedTransactionsService} from "app/@core/service/transfer/processed-transactions/processed-transactions.service";
import {AlrajhiTransferService} from "../../@core/service/transfer/alrajhi-transfer/alrajhi-transfer.service";
import {BeneficiariesService} from "../../@core/service/transfer/beneficiaries/beneficiaries.service";
import {BulkPaymentTransferService} from "../../@core/service/transfer/bulk-payment-transfer/bulk-payment-transfer.service";
import {InternationalTransferService} from "../../@core/service/transfer/international-transfer/international-transfer.service";
import {IPSTransferService} from "../../@core/service/transfer/ips/ips.service";
import {LocalTransferService} from "../../@core/service/transfer/local_transfer/local-transfer.service";
import {OwnTransferService} from "../../@core/service/transfer/own-transfer/own-transfer.service";
import {StandingOrderService} from "../../@core/service/transfer/standing-order/standing-order.service";
import {TransferService} from "../../@core/service/transfer/transfer.service";
import {UrPayTransferService} from "../../@core/service/transfer/urpay-transfer/urpay-transfer.service";
import {UserApprovalService} from "../../@core/service/transfer/user-approval/user-approval.service";
import {SharedModule} from "../../shared/shared.module";
import {CharityTransferService} from './../../@core/service/transfer/charity-transfer/charity-transfer.service';
import {AliasManagementComponent} from './alias-management/alias-management.component';
import {AlrajhiTransferComponent} from './alrajhi-transfer/alrajhi-transfer.component';
import {AddBeneficiaryComponent} from "./beneficiaries/add-beneficiary/add-beneficiary.component";
import {BeneficiariesComponent} from "./beneficiaries/beneficiaries.component";
import {EditBeneficiaryComponent} from "./beneficiaries/edit-beneficiary/edit-beneficiary.component";
import {BulkPaymentTransferComponent} from './bulk-payment-transfer/bulk-payment-transfer.component';
import {CharityTransferComponent} from "./charity-transfer/charity-transfer.component";
import {SingleCharityTransferComponent} from './charity-transfer/single-charity-transfer/single-charity-transfer.component';
import {InternationalTransferComponent} from "./international-transfer/international-transfer.component";
import {LocalTransferComponent} from "./local-transfer/local-transfer.component";
import {OwnTransferComponent} from "./own-transfer/own-transfer.component";
import {ProcessedTrxDetailsComponent} from "./processed-trx/processed-trx-details/processed-trx-details.component";
import {ProcessedTrxComponent} from './processed-trx/processed-trx.component';
import {QuickTransferComponent} from "./quick-transfer/quick-transfer.component";
import {StandingOrderDeleteComponent} from "./standing-order/standing-order-delete/standing-order-delete.component";
import {StandingOrderEditComponent} from './standing-order/standing-order-edit/standing-order-edit.component';
import {StandingOrderLandingComponent} from './standing-order/standing-order-landing/standing-order-landing.component';
import {StandingOrderComponent} from './standing-order/standing-order.component';
import {TransferBaseComponent} from './transfer-base/transfer-base.component';
import {TransferLandingComponent} from './transfer-landing/transfer-landing.component';
import {TransferRoutingModule} from "./transfer-routing.module";
import {TransferUserApprovalComponent} from "./transfer-user-approval/transfer-user-approval.component";
import {UrpayTransferComponent} from "./urpay-transfer/urpay-transfer.component";

@NgModule({
  imports: [
    TransferRoutingModule,
    SharedModule,
    CommonModule,
    TranslateModule,
  ],
  declarations: [
    TransferLandingComponent,
    TransferBaseComponent,
    AlrajhiTransferComponent,
    OwnTransferComponent,
    InternationalTransferComponent,
    UrpayTransferComponent,
    QuickTransferComponent,
    LocalTransferComponent,
    ProcessedTrxComponent,
    ProcessedTrxDetailsComponent,
    StandingOrderComponent,
    StandingOrderLandingComponent,
    TransferUserApprovalComponent,
    AddBeneficiaryComponent,
    EditBeneficiaryComponent,
    BeneficiariesComponent,
    StandingOrderLandingComponent,
    BulkPaymentTransferComponent,
    CharityTransferComponent,
    SingleCharityTransferComponent,
    StandingOrderDeleteComponent,
    BulkPaymentTransferComponent,
    StandingOrderEditComponent,
    AliasManagementComponent
  ],
  providers: [
    TransferService,
    OwnTransferService,
    AlrajhiTransferService,
    BeneficiariesService,
    InternationalTransferService,
    LocalTransferService,
    IPSTransferService,
    StandingOrderService,
    UrPayTransferService,
    ProcessedTransactionsService,
    UserApprovalService,
    BulkPaymentTransferService,
    CharityTransferService,
    Location,
    AliasManagementService
  ]
})
export class TransferModule {
}
