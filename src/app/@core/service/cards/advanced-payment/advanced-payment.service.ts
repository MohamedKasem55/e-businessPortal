import { Injectable } from '@angular/core';
import { AbstractBaseService } from '../../base/abstract-base.service';
import { Observable } from 'rxjs';
import {
  CardsListResponseModel,
  OwnerCardsListModel,
} from 'app/@core/model/rest/cards/onwer-cards/list-res.model';
import { OwnerCardDetailsResponseModel } from 'app/@core/model/rest/cards/onwer-cards/details-res.model';
import { OwnerCardPaymentReq } from 'app/@core/model/rest/cards/advanced-payment/owner-card-payment-req.model';
import { OwnerCardCurrentCycleAmountRes } from 'app/@core/model/rest/cards/advanced-payment/owner-card-current-cycle-amount-res';
import { ADV_PAYMNT_CONST } from './advanced-payment-urls';
import {
  BusinessCardPaymentConfirmRes,
  BusinessCardPaymentValidateDetailAndListRequest,
  BusinessCardPaymentValidateRes,
  CardPaymentConfirmRequestModel,
} from 'app/@core/model/rest/cards/advanced-payment/cards-payment-models';

@Injectable()
export class AcvancedPaymentService extends AbstractBaseService {
  payOwnerCard(req: OwnerCardPaymentReq): Observable<any> {
    return this.post(ADV_PAYMNT_CONST.OWNER_CARDS_PAYMENT, req);
  }

  validateBusinessCardPayment(
    req: BusinessCardPaymentValidateDetailAndListRequest
  ): Observable<BusinessCardPaymentValidateRes> {
    return this.post(ADV_PAYMNT_CONST.BUSINESS_CARDS_PAYMENT_VALIDATE, req);
  }

  confirmBusinessCardPayment(
    req: CardPaymentConfirmRequestModel
  ): Observable<BusinessCardPaymentConfirmRes> {
    return this.post(ADV_PAYMNT_CONST.BUSINESS_CARDS_PAYMENT_CONFIRM, req);
  }

  payBusinessCard(req: OwnerCardPaymentReq): Observable<any> {
    return this.post(ADV_PAYMNT_CONST.OWNER_CARDS_PAYMENT, req);
  }

  getOwnerCardCurrentCycleAmount(
    card: OwnerCardsListModel
  ): Observable<OwnerCardCurrentCycleAmountRes> {
    return this.post(ADV_PAYMNT_CONST.OWNER_CARDS_CURR_CYCL_AMNT, {
      card: card,
    });
  }
}
