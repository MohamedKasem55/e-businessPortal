import { CardsSharedModule } from './../cards-shared/cards-shared.module';
import { CardDetailsFactoryService } from './cards-shared/card-details-factory.service';

import { Injector, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardsRoutingModule } from './cards-routing.module';
import { CardsBaseComponent } from './cards-base/cards-base.component';
import { SharedModule } from '../../shared/shared.module';
import { CardsLandingComponent } from './cards-landing/cards-landing.component';
import { TranslateModule } from '@ngx-translate/core';
import { OwnerCardsService } from 'app/@core/service/cards/owner-cards/owner-cards.service';
import { CardsUserApprovalComponent } from './cards-user-approval/cards-user-approval.component';
import { CardsApprovalService } from 'app/@core/service/cards/business-cards/cards-approval.service';
import { CardRejectComponent } from './cards-user-approval/card-reject/card-reject.component';
import { BusinessCardsService } from 'app/@core/service/cards/business-cards/business-cards.service';
import { PrepaidCardsService } from 'app/@core/service/cards/prepaid-cards/prepaid-cards.service';
import { RequestPrepaidCardComponent } from './prepaid-cards/request-prepaid-card/request-prepaid-card.component';
import { CardDetailsCredentialsService } from 'app/@core/service/cards/card-details-credentials/card-details-credentials.service';
import { ApplyNewCardComponent } from './apply-new-card/apply-new-card.component';
import { PrepaidCardTopupComponent } from './prepaid-cards/card-topup/card-topup.component';
import { DebitCardsService } from '../../@core/service/cards/debit-cards/debit-cards.service';
import { CardDetailsResolver } from './resolvers/card-details.resolver';
import { CardCredentialComponent } from './view-card-credentials/view-card-credentials.component';
import { OwnerCardsPaymentComponent } from './owner-cards/card-payment/owner-cards-payment.component';
import { AcvancedPaymentService } from 'app/@core/service/cards/advanced-payment/advanced-payment.service';
import { BusinessCardResetPinComponent } from './business-cards/reset-pin/card-reset-pin.component';
import { BusinessCardDetailsComponent } from './business-cards/card-details/card-details.component';
import { PrepaidCardResetPinComponent } from './prepaid-cards/reset-pin/card-reset-pin.component';
import { OwnerCardsCancelComponent } from './owner-cards/card-cancel/owner-cards-cancel.component';
import { CardsActivationService } from 'app/@core/service/cards/cards-activation/cards-activation-service';
import { PrepaidCardDetailsComponent } from './prepaid-cards/card-details/card-details.component';
import { OwnerCardDetailsComponent } from './owner-cards/card-details/card-details.component';
import { PrepaidCardsCancelReplaceComponent } from './prepaid-cards/card-replace/card-replace.component';
import { BusinessCardsPaymentComponent } from './business-cards/card-payment/business-cards-payment.component';
import { BusinessCardsBlockComponent } from './business-cards/card-block/card-block.component';
import { CardsCancelationService } from 'app/@core/service/cards/cards-cancelation/cards-cancelation-service';
import { DebitCardDetailsComponent } from './mada-cards/card-details/card-details.component';
import { DebitCardsSuspendComponent } from './mada-cards/card-suspend/card-suspend.component';
import { DebitCardResetPinComponent } from './mada-cards/reset-pin/card-reset-pin.component';
import { DebitCardsConfigurationComponent } from './mada-cards/card-configuration/card-configuration.component';
import { CardConfigurationResolver } from './resolvers/card-configuration.resolver';
import { RequestDebitCardComponent } from './mada-cards/new-card-apply/request-debit-card.component';
import { DebitCardApplyNewResolver } from './resolvers/debit-card-apply-new.resolver';
import { PrepaidCardsCancelComponent } from './prepaid-cards/card-cancel/card-cancel.component';
import { PrepaidCardRefundComponent } from './prepaid-cards/card-refund/card-refund.component';
import { CardsStatementsComponent } from './cards-shared/components/cards-statements/cards-statements.component';
import { CardsStatementsService } from 'app/@core/service/cards/cards-statements/cards-statements.service';

@NgModule({
  declarations: [
    CardsBaseComponent,
    CardsLandingComponent,
    BusinessCardDetailsComponent,
    PrepaidCardDetailsComponent,
    OwnerCardDetailsComponent,
    DebitCardDetailsComponent,
    DebitCardsSuspendComponent,
    DebitCardResetPinComponent,
    RequestDebitCardComponent,
    DebitCardsConfigurationComponent,
    RequestPrepaidCardComponent,
    CardsUserApprovalComponent,
    CardRejectComponent,
    ApplyNewCardComponent,
    PrepaidCardTopupComponent,
    PrepaidCardRefundComponent,
    PrepaidCardResetPinComponent,
    BusinessCardResetPinComponent,
    BusinessCardsBlockComponent,
    OwnerCardsCancelComponent,
    PrepaidCardsCancelReplaceComponent,
    PrepaidCardsCancelComponent,
    OwnerCardsPaymentComponent,
    BusinessCardsPaymentComponent,
    CardsStatementsComponent,
  ],
  imports: [
    SharedModule,
    CardsSharedModule,
    CommonModule,
    CardsRoutingModule,
    TranslateModule,
  ],
  providers: [
    OwnerCardsService,
    CardsCancelationService,
    CardCredentialComponent,
    PrepaidCardsService,
    BusinessCardsService,
    CardsActivationService,
    CardsApprovalService,
    CardDetailsCredentialsService,
    CardDetailsFactoryService,
    CardCredentialComponent,
    DebitCardsService,
    CardDetailsResolver,
    CardConfigurationResolver,
    DebitCardApplyNewResolver,
    CardCredentialComponent,
    AcvancedPaymentService,
    CardsStatementsService
  ],
})
export class CardsModule {
}
