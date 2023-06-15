import { CommonModule, Location } from '@angular/common';
import { NgModule } from '@angular/core';

import { AramcoPaymentService } from 'app/@core/service/payments/aramco-payments/aramco-payment.service';
import { BillProcessedTransactionsService } from 'app/@core/service/payments/bill-processed-transactions/bill-processed-transactions.service';
import { EsalPaymentService } from 'app/@core/service/payments/esal-payment/esal-payment.service';
import { EsalProcessedTransactionsService } from 'app/@core/service/payments/esal-payment/esal-processed-transactions/esal-processed-transactions.service';
import { FeedbackFilesService } from 'app/@core/service/payments/feedback-files/feedback-files.service';
import { GovPaymentService } from 'app/@core/service/payments/gov-payments/gov-payment.service';
import { GovProcessedTransactionsService } from 'app/@core/service/payments/government/gov-processed-transactions/gov-processed-transactions.service';
import { UserApprovalService } from 'app/@core/service/payments/user-approval/user-approval.service';
import { ProcessedTransactionsService } from 'app/@core/service/transfer/processed-transactions/processed-transactions.service';
import { AddBillService } from '../../@core/service/payments/add-bill/add-bill.service';
import { BillPaymentService } from '../../@core/service/payments/bill-payments/bill-payment.service';

import { GovermentPaymentService } from '../../@core/service/payments/government/government-payment.service';
import { PaymentsService } from '../../@core/service/payments/payments.service';
import { SharedModule } from '../../shared/shared.module';
import { AramcoPaymentComponent } from './aramco-payment/aramco-payment.component';
import { AddBillComponent } from './bill-payment/add-bill/add-bill.component';
import { BillPaymentComponent } from './bill-payment/bill-payment.component';
import { PayBillComponent } from './bill-payment/pay-bill/pay-bill.component';
import { BulkMoiPaymentComponent } from './bulk-moi-payment/bulk-moi-payment.component';
import { EsalPaymentComponent } from './esal-payment/esal-payment.component';
import { EsalMultiPaymentComponent } from './esal-payment/multi-payment/esal-multi-payment.component';
import { EsalSinglePaymentComponent } from './esal-payment/single-payment/esal-single-payment.component';
import { EsalAnalyticsComponent } from './esal-payment/analytics/esal-analytics.component';
import { FeedbackFileDetailsComponent } from './feedback-files/feedback-file-details/feedback-file-details.component';
import { FeedbackFilesComponent } from './feedback-files/feedback-files.component';
import { GovPaymentStatusComponent } from './government-payment/gov-payment-status/gov-payment-status.component';
import { GovernmentPaymentComponent } from './government-payment/government-payment.component';
import { HajjUmrahCardsComponent } from './hajj-umrah-cards/hajj-umrah-cards.component';
import { OneTimePaymentComponent } from './one-time-payment/one-time-payment.component';
import { PaymentBaseComponent } from './payment-base/payment-base.component';
import { PaymentLandingComponent } from './payment-landing/payment-landing.component';
import { PaymentProcessedTransactionsComponent } from './payment-processed-transactions/payment-processed-transactions.component';
import { PaymentUserApprovalComponent } from './payment-user-approval/payment-user-approval.component';
import { PaymentsRoutingModule } from './payments-routing.module';
import { EsalInvoiceHistoryComponent } from './esal-payment/esal-invoice-history/esal-invoice-history.component';
import { EsalInvoiceHistoryService } from 'app/@core/service/payments/esal-payment/esal-invoice-history/esal-invoice-history.service';
import { OneTimeBillPaymentService } from 'app/@core/service/payments/bill-payments/one-time-bill-payment/one-time-bill-payment.service';
import { PaymentProcessedTransactionsDetailsComponent } from './payment-processed-transactions/payment-processed-transactions-details/payment-processed-transactions-details.component';
import { BulkMoiPaymentService } from 'app/@core/service/payments/bulk-moi-payments/bulk-moi-payment.service';
import {BulkPaymentComponent} from "./bulk-payment/bulk-payment.component";
import {BulkPaymentService} from "../../@core/service/payments/bulk-payment/bulk-payment.service";

@NgModule({
  declarations: [
    PaymentBaseComponent,
    PaymentLandingComponent,
    AddBillComponent,
    BillPaymentComponent,
    GovernmentPaymentComponent,
    EsalPaymentComponent,
    EsalSinglePaymentComponent,
    EsalMultiPaymentComponent,
    EsalAnalyticsComponent,
    AramcoPaymentComponent,
    HajjUmrahCardsComponent,
    OneTimePaymentComponent,
    BulkMoiPaymentComponent,
    PaymentUserApprovalComponent,
    PayBillComponent,
    GovPaymentStatusComponent,
    FeedbackFilesComponent,
    FeedbackFileDetailsComponent,
    EsalInvoiceHistoryComponent,
    PaymentProcessedTransactionsComponent,
    PaymentProcessedTransactionsDetailsComponent,
    PaymentProcessedTransactionsDetailsComponent,
    BulkPaymentComponent,
  ],
  imports: [CommonModule, PaymentsRoutingModule, SharedModule],
  providers: [
    AddBillService,
    PaymentsService,
    UserApprovalService,
    BillPaymentService,
    GovPaymentService,
    BillProcessedTransactionsService,
    ProcessedTransactionsService,
    AramcoPaymentService,
    GovermentPaymentService,
    Location,
    EsalPaymentService,
    GovProcessedTransactionsService,
    FeedbackFilesService,
    EsalInvoiceHistoryService,
    EsalProcessedTransactionsService,
    OneTimeBillPaymentService,
    BulkMoiPaymentService,
    BulkPaymentService,
  ],
})
export class PaymentsModule {}
