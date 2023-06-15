import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { CardDetailsResolver } from './resolvers/card-details.resolver';
import {CardsLandingComponent} from "./cards-landing/cards-landing.component";
import {CardsUserApprovalComponent} from "./cards-user-approval/cards-user-approval.component";
import {CardRejectComponent} from "./cards-user-approval/card-reject/card-reject.component";
import { ApplyNewCardComponent } from './apply-new-card/apply-new-card.component';
import { RequestPrepaidCardComponent } from './prepaid-cards/request-prepaid-card/request-prepaid-card.component';
import { PrepaidCardTopupComponent } from './prepaid-cards/card-topup/card-topup.component';
import { CARDS_BUSINESS_BLOCK, CARDS_BUSINESS_CANCEL, CARDS_BUSINESS_DETAILS, CARDS_BUSINESS_PAYMENT, CARDS_BUSINESS_RESET_PIN, CARDS_DEBIT_SUSPEND, CARDS_DEBIT_DETAILS, CARDS_OWNER_CANCEL, CARDS_OWNER_DETAILS, CARDS_OWNER_PAYMENT, CARDS_PREPAID_CANCEL, CARDS_PREPAID_CANCEL_AND_REPLACE, CARDS_PREPAID_DETAILS, CARDS_PREPAID_RESET_PIN, CARDS_DEBIT_RESET_PIN, CARDS_DEBIT_CONFIG, CARDS_DEBIT_APPLY_NEW, CARDS_PREPAID_TOPUP, CARDS_PREPAID_REFUND, APPLY_NEW_CARD } from 'app/@core/constants/pages-urls-constants';
import { OwnerCardsPaymentComponent } from './owner-cards/card-payment/owner-cards-payment.component';
import { BusinessCardResetPinComponent } from './business-cards/reset-pin/card-reset-pin.component';
import { BusinessCardDetailsComponent } from './business-cards/card-details/card-details.component';
import { PrepaidCardResetPinComponent } from './prepaid-cards/reset-pin/card-reset-pin.component';
import { OwnerCardsCancelComponent } from './owner-cards/card-cancel/owner-cards-cancel.component';
import { OwnerCardDetailsComponent } from './owner-cards/card-details/card-details.component';
import { PrepaidCardDetailsComponent } from './prepaid-cards/card-details/card-details.component';
import { PrepaidCardsCancelReplaceComponent } from './prepaid-cards/card-replace/card-replace.component';
import { BusinessCardsPaymentComponent } from './business-cards/card-payment/business-cards-payment.component';
import { BusinessCardsBlockComponent } from './business-cards/card-block/card-block.component';
import { DebitCardDetailsComponent } from './mada-cards/card-details/card-details.component';
import { DebitCardsSuspendComponent } from './mada-cards/card-suspend/card-suspend.component';
import { DebitCardResetPinComponent } from './mada-cards/reset-pin/card-reset-pin.component';
import { DebitCardsConfigurationComponent } from './mada-cards/card-configuration/card-configuration.component';
import { CardConfigurationResolver } from './resolvers/card-configuration.resolver';
import { RequestDebitCardComponent } from './mada-cards/new-card-apply/request-debit-card.component';
import { DebitCardApplyNewResolver } from './resolvers/debit-card-apply-new.resolver';
import { PrepaidCardsCancelComponent } from './prepaid-cards/card-cancel/card-cancel.component';
import { PrepaidCardRefundComponent } from './prepaid-cards/card-refund/card-refund.component';
import {PagesGuard} from "../pages.guard";

const routes: Routes = [
  {
    path: '',
    component: CardsLandingComponent,
  },
  {
    path: 'approval',
    component: CardsUserApprovalComponent,
    canActivate: [PagesGuard],
    data: {service: 'CardsRequestStatus'}
  },
  {
    path: 'card-approval-reject',
    component: CardRejectComponent,
    canActivate: [PagesGuard],
    data: {service: 'CardsRequestStatus'}
  },
  {
    path: CARDS_BUSINESS_DETAILS,
    component: BusinessCardDetailsComponent,
    resolve: { details: CardDetailsResolver },
    canActivate: [PagesGuard],
    data: {service: 'BusinessCardsMenu'}
  },
  {
    path: CARDS_OWNER_DETAILS,
    component: OwnerCardDetailsComponent,
    resolve: { details: CardDetailsResolver },
    canActivate: [PagesGuard],
    data: {service: 'CreditCardsMenu'}
  },
  {
    path: CARDS_DEBIT_DETAILS,
    component: DebitCardDetailsComponent,
    resolve: { details: CardDetailsResolver },
    canActivate: [PagesGuard],
    data: {service: 'DebitCardsMenu'}
  },
  {
    path: CARDS_DEBIT_SUSPEND,
    component: DebitCardsSuspendComponent,
    resolve: { details: CardDetailsResolver },
    canActivate: [PagesGuard],
    data: {service: 'DebitCardsMenu'}
  },
  {
    path: CARDS_DEBIT_RESET_PIN,
    component: DebitCardResetPinComponent,
    resolve: { details: CardDetailsResolver },
    canActivate: [PagesGuard],
    data: {service: 'DebitCardsMenu'}
  },
  {
    path: CARDS_DEBIT_CONFIG,
    component: DebitCardsConfigurationComponent,
    resolve: { configState: CardConfigurationResolver },
    canActivate: [PagesGuard],
    data: {service: 'DebitCardsMenu'}
  },
  {
    path: CARDS_DEBIT_APPLY_NEW,
    component: RequestDebitCardComponent,
    resolve: { debitState: DebitCardApplyNewResolver },
    canActivate: [PagesGuard],
    data: {service: 'RequestNewDebitCard'}
  },
  {
    path: APPLY_NEW_CARD,
    component: ApplyNewCardComponent,
    canActivate: [PagesGuard],
    data: {service: 'applyForCards'}
  },
  {
    path: CARDS_BUSINESS_RESET_PIN,
    component: BusinessCardResetPinComponent,
    canActivate: [PagesGuard],
    data: {service: 'ManagePINBusinessCards'}
  },
  {
    path: CARDS_BUSINESS_PAYMENT,
    component: BusinessCardsPaymentComponent,
    canActivate: [PagesGuard],
    data: {service: 'PayBusinessCards'}
  },
  {
    path: CARDS_BUSINESS_BLOCK,
    component: BusinessCardsBlockComponent,
    canActivate: [PagesGuard],
    data: {service: 'BlockBusinessCards'}
  },
  {
    path: CARDS_OWNER_CANCEL,
    component: OwnerCardsCancelComponent,
    canActivate: [PagesGuard],
    data: {service: 'CreditCardsMenu'},
  },
  {
    path: 'request-prepaid',
    component: RequestPrepaidCardComponent,
    canActivate: [PagesGuard],
    data: {service: 'RequestNewPrepaidCard'},
  },
  {
    path: CARDS_PREPAID_TOPUP,
    component: PrepaidCardTopupComponent,
    canActivate: [PagesGuard],
    data: {service: 'PayPrepaidCard'},
  },
  {
    path: CARDS_PREPAID_REFUND,
    component: PrepaidCardRefundComponent,
    canActivate: [PagesGuard],
    data: {service: 'PayPrepaidCard'},
  },
  {
    path: CARDS_PREPAID_RESET_PIN,
    component: PrepaidCardResetPinComponent,
    canActivate: [PagesGuard],
    data: {service: 'ManagePINPrepaidCard'},
  },
  {
    path: CARDS_PREPAID_DETAILS,
    component: PrepaidCardDetailsComponent,
    resolve: { details: CardDetailsResolver },
    canActivate: [PagesGuard],
    data: {service: 'PrepaidCardsMenu'},
  },
  {
    path: CARDS_PREPAID_CANCEL_AND_REPLACE,
    component: PrepaidCardsCancelReplaceComponent,
    canActivate: [PagesGuard],
    data: {service: 'PrepaidCardsClosureRequestReplacement'},
  },
  {
    path: CARDS_PREPAID_CANCEL,
    component: PrepaidCardsCancelComponent,
    canActivate: [PagesGuard],
    data: {service: 'PrepaidCardsClosureRequestReplacement'},
  },
  {
    path: CARDS_OWNER_PAYMENT,
    component: OwnerCardsPaymentComponent,
    canActivate: [PagesGuard],
    data: {service: 'CreditCardsMenu'},
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers:[
    CardDetailsResolver
  ]
})
export class CardsRoutingModule {
}
