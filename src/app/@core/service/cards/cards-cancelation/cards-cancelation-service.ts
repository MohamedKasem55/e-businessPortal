import { Injectable } from '@angular/core';
import { AbstractBaseService } from '../../base/abstract-base.service';
import { Observable } from 'rxjs';

import {
  BlockCardConfirmRequest,
  BlockCardConfirmRes,
  CardBlockValidateRes,
  CardBlockValidateReueust,
  CardClosureConfirmRequest,
  CardClosureConfirmRes,
  CardClosureValidateRequest,
  CardClosureValidateRes,
  PrepaidConfirmClosureRequest,
  PrepaidConfirmClosureRes,
  PrepaidConfirmReplaceRequest,
  PrepaidConfirmReplaceRes,
  PrepaidConfirmStolenRequest,
  PrepaidConfirmStolenRes,
  PrepaidValidateClosureRequest,
  PrepaidValidateClosureRes,
  PrepaidValidateReplaceRequest,
  PrepaidValidateReplaceRes,
  PrepaidValidateStolenRequest,
  PrepaidValidateStolenRes,
  SuspendDebitCardRequest,
  SuspendDebitCardRes,
} from 'app/@core/model/rest/cards/common/closure-models';
import { CancelationReasons } from '../cards-cancelation/cards-cancelation-reasons';
import { ModelAndListService } from '../../base/modelAndList.service';
import { CARD_TYPE } from 'app/@core/model/dto/cards-enums';
import { Constants } from '../prepaid-cards/prepaid-cards-urls';

@Injectable()
export class CardsCancelationService extends AbstractBaseService {
  /**
   *
   */
  constructor(private modelAndListService: ModelAndListService) {
    super();
  }
  getLostReasons(type: CARD_TYPE): Observable<any> {
    let reasonsConstanst = [];
    switch (type) {
      case CARD_TYPE.PREPAID:
        reasonsConstanst.push('prepaidCardsLostStolen');
        break;
      case CARD_TYPE.BUSINESS:
        reasonsConstanst.push('businessCardsBlockReason');
        break;

      default:
        break;
    }
    return this.modelAndListService.getList(reasonsConstanst);
  }

  validateBusinessCardCancelAndReplaceCard(
    request: CardClosureValidateRequest,
    url: string
  ): Observable<CardClosureValidateRes> {
    return this.post(url, request);
  }
  validateCancelCard(
    request: CardClosureValidateRequest,
    url: string
  ): Observable<CardClosureValidateRes> {
    return this.post(url, request);
  }
  confirmCancelAndReplaceCard(
    request: CardClosureConfirmRequest,
    url: string
  ): Observable<CardClosureConfirmRes> {
    return this.post(url, request);
  }
  confirmCancelCard(
    request: CardClosureConfirmRequest,
    url: string
  ): Observable<CardClosureConfirmRes> {
    return this.post(url, request);
  }

  validateBlockBusinessCard(
    request: CardBlockValidateReueust,
    url: string
  ): Observable<CardBlockValidateRes> {
    return this.post(url, request);
  }
  confirmBlockBusinessCard(
    request: BlockCardConfirmRequest,
    url: string
  ): Observable<BlockCardConfirmRes> {
    return this.post(url, request);
  }
  confirmSuspenseDebitCard(
    request: SuspendDebitCardRequest,
    url: string
  ): Observable<SuspendDebitCardRes> {
    return this.post(url, request);
  }

  validatePrepaidCardStolenOrLost(
    request: PrepaidValidateStolenRequest
  ): Observable<PrepaidValidateStolenRes> {
    request.operation = CancelationReasons.lostOrStolen
    return this.post(Constants.PREPAID_CARD_VALIDATE_LOST_STOLEN, request);
  }

  validatePrepaidCardClosure(
    request: PrepaidValidateClosureRequest
  ): Observable<PrepaidValidateClosureRes> {
    request.operation = CancelationReasons.close
    return this.post(Constants.PREPAID_CARD_VALIDATE_CANCEL, request)
  }

  validatePrepaidCardReplace(
    request: PrepaidValidateReplaceRequest
  ): Observable<PrepaidValidateReplaceRes> {
    request.typeOperation = CancelationReasons.replace
    return this.post(Constants.PREPAID_CARD_VALIDATE_REPLACE, request)
  }

  confirmPrepaidCardStolen(
    request: PrepaidConfirmStolenRequest
  ): Observable<PrepaidConfirmStolenRes> {
    request.operation = CancelationReasons.lostOrStolen
    return this.post(Constants.PREPAID_CARD_CONFIRM_LOST_STOLEN, request);
  }

  confirmPrepaidCardClosure(
    request: PrepaidConfirmClosureRequest
  ): Observable<PrepaidConfirmClosureRes> {
    request.operation = CancelationReasons.close
    return this.post(Constants.PREPAID_CARD_CONFIRM_CANCEL, request)
  }

  confirmPrepaidCardReplace(
    request: PrepaidConfirmReplaceRequest
  ): Observable<PrepaidConfirmReplaceRes> {
    request.typeOperation = CancelationReasons.replace
    return this.post(Constants.PREPAID_CARD_CONFIRM_REPLACE, request)
  }
  
}
