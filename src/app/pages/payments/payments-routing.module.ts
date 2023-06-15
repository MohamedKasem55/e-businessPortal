import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AramcoPaymentComponent} from './aramco-payment/aramco-payment.component';
import {AddBillComponent} from './bill-payment/add-bill/add-bill.component';
import {BillPaymentComponent} from './bill-payment/bill-payment.component';
import {PayBillComponent} from './bill-payment/pay-bill/pay-bill.component';
import {BulkMoiPaymentComponent} from './bulk-moi-payment/bulk-moi-payment.component';
import {EsalPaymentComponent} from './esal-payment/esal-payment.component';
import {EsalMultiPaymentComponent} from './esal-payment/multi-payment/esal-multi-payment.component';
import {EsalSinglePaymentComponent} from './esal-payment/single-payment/esal-single-payment.component';
import {FeedbackFileDetailsComponent} from './feedback-files/feedback-file-details/feedback-file-details.component';
import {FeedbackFilesComponent} from './feedback-files/feedback-files.component';
import {GovPaymentStatusComponent} from './government-payment/gov-payment-status/gov-payment-status.component';
import {GovernmentPaymentComponent} from './government-payment/government-payment.component';
import {HajjUmrahCardsComponent} from './hajj-umrah-cards/hajj-umrah-cards.component';
import {OneTimePaymentComponent} from './one-time-payment/one-time-payment.component';
import {PaymentLandingComponent} from './payment-landing/payment-landing.component';
import {
  PaymentProcessedTransactionsComponent
} from './payment-processed-transactions/payment-processed-transactions.component';
import {PaymentUserApprovalComponent} from './payment-user-approval/payment-user-approval.component';
import {EsalAnalyticsComponent} from './esal-payment/analytics/esal-analytics.component';
import {EsalInvoiceHistoryComponent} from './esal-payment/esal-invoice-history/esal-invoice-history.component';
import {
  PaymentProcessedTransactionsDetailsComponent
} from './payment-processed-transactions/payment-processed-transactions-details/payment-processed-transactions-details.component';
import {BulkPaymentComponent} from "./bulk-payment/bulk-payment.component";
import {PagesGuard} from "../pages.guard";

const routes: Routes = [
  {
    path: '',
    component: PaymentLandingComponent,
  },
  {
    path: 'bill-payment',
    component: BillPaymentComponent,
    canActivate: [PagesGuard],
    data: {service: 'BillPaymentsMenu'}
  },
  {
    path: 'bulk-bill-payment',
    component: BulkPaymentComponent,
    canActivate: [PagesGuard],
    data: {service: 'OneTimePayment'}
  },
  {
    path: 'government-payment',
    component: GovernmentPaymentComponent,
    canActivate: [PagesGuard],
    data: {service: 'MOIPaymentMenu'}
  },
  {
    path: 'payment-status/details',
    component: GovPaymentStatusComponent,
    canActivate: [PagesGuard],
    data: {service: 'MOIRequestStatus'}
  },
  {
    path: 'esal-payment',
    component: EsalPaymentComponent,
    canActivate: [PagesGuard],
    data: {service: 'EsalMenu'}
  },
  {
    path: 'esal-payment/single-payment',
    component: EsalSinglePaymentComponent,
    canActivate: [PagesGuard],
    data: {service: 'EsalPayInvoice'}
  },
  {
    path: 'esal-payment/multi-payment',
    component: EsalMultiPaymentComponent,
    canActivate: [PagesGuard],
    data: {service: 'EsalPayMultiple'}
  },
  {
    path: 'esal-payment/analytics',
    component: EsalAnalyticsComponent,
    canActivate: [PagesGuard],
    data: {service: 'EsalDashboard'}
  },
  {
    path: 'aramco-payment',
    component: AramcoPaymentComponent,
    canActivate: [PagesGuard],
    data: {service: 'AramcoPaymentMenu'}
  },
  {
    path: 'hajj-umrah-cards',
    component: HajjUmrahCardsComponent,
    canActivate: [PagesGuard],
    data: {service: 'HajjUmrahMenu'}
  },
  {
    path: 'one-time-payment',
    component: OneTimePaymentComponent,
    canActivate: [PagesGuard],
    data: {service: 'OneTimePayment'}
  },
  {
    path: 'bulk-moi-payment',
    component: BulkMoiPaymentComponent,
    canActivate: [PagesGuard],
    data: {service: 'MOIBulkPayment'}
  },
  {
    path: 'add-bill',
    component: AddBillComponent,
    canActivate: [PagesGuard],
    data: {service: 'BillAdd'}
  },
  {
    path: 'approval',
    component: PaymentUserApprovalComponent,
    canActivate: [PagesGuard],
    data: {service: 'PaymentsRequestStatus'}
  },
  {
    path: 'processed',
    component: PaymentProcessedTransactionsComponent,
    canActivate: [PagesGuard],
    data: {service: 'PaymentsProcessedTransactions'}
  },
  {
    path: 'pay-bill',
    component: PayBillComponent,
    canActivate: [PagesGuard],
    data: {service: 'BillManagement'}
  },
  {
    path: 'feedback-files',
    component: FeedbackFilesComponent,
    canActivate: [PagesGuard],
    data: {service: 'PaymentsFeedbackFiles'}
  },
  {
    path: 'feedback-files/feedback-file-details',
    component: FeedbackFileDetailsComponent,
    canActivate: [PagesGuard],
    data: {service: 'PaymentsFeedbackFiles'}
  },
  {
    path: 'esal-payment/invoice-history',
    component: EsalInvoiceHistoryComponent,
    canActivate: [PagesGuard],
    data: {service: 'EsalInvoiceHistory'}
  },
  {
    path: 'processed-details',
    component: PaymentProcessedTransactionsDetailsComponent,
    canActivate: [PagesGuard],
    data: {service: 'PaymentsProcessedTransactions'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentsRoutingModule {
}
