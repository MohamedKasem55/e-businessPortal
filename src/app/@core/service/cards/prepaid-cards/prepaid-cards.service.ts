import {Injectable} from '@angular/core';
import {AbstractBaseService, ContextPath, RequestOption} from '../../base/abstract-base.service';
import {Constants} from './prepaid-cards-urls';
import {Observable} from 'rxjs';
import {PrepaidCardsListResponseModel} from 'app/@core/model/rest/cards/prepaid-cards/list-res.model';
import {PrepaidCardDetailsRequestModel} from 'app/@core/model/rest/cards/prepaid-cards/details-req.model';
import {PrepaidCardsDetailsResponseModel} from 'app/@core/model/rest/cards/prepaid-cards/details-res.model';
import {
  PrepaidRequestNewValidateReqModel
} from 'app/@core/model/rest/cards/prepaid-cards/request-new-validate-req.model';
import {
  PrepaidRequestNewValidateResModel
} from 'app/@core/model/rest/cards/prepaid-cards/request-new-validate-res.model';
import {PrepaidRequestNewConfirmReqModel} from 'app/@core/model/rest/cards/prepaid-cards/request-new-confirm-req.model';
import {PrepaidCardAttachmentReqModel} from 'app/@core/model/rest/cards/prepaid-cards/attachment.model';
import {PrepaidRequestNewConfirmResModel} from 'app/@core/model/rest/cards/prepaid-cards/request-new-confirm-res.model';
import {
  PrepaidRequestCardOwnerDataResModel
} from 'app/@core/model/rest/cards/prepaid-cards/request-new-owner-data-res.model';
import {CardsResetPinValidateResModel} from 'app/@core/model/rest/cards/common/reset-pin-validate-res.model';
import {PrepaidLoadFundsValidateReqModel} from '../../../model/rest/cards/prepaid-cards/loadfunds-validate-req.model';
import {PrepaidLoadFundsConfirmReqModel} from '../../../model/rest/cards/prepaid-cards/loadfunds-confirm-req.model';
import {PrepaidLoadFundsValidateResModel} from '../../../model/rest/cards/prepaid-cards/loadfunds-validate-res.model';
import {CardsResetPinValidateReqModel} from 'app/@core/model/rest/cards/common/reset-pin-validate-req.model';
import {CardsResetPinConfirmReqModel} from 'app/@core/model/rest/cards/common/reset-pin-confirm-req.model';
import {
  PrepaidCardsResetPinConfirmResModel as CardsResetPinConfirmResModel
} from 'app/@core/model/rest/cards/common/reset-pin-confirm-res.model';

@Injectable()
export class PrepaidCardsService extends AbstractBaseService {
  getPrepaidCardsList(isSilentError: boolean = false): Observable<PrepaidCardsListResponseModel> {
    return this.get(Constants.PREPAID_CARDS_LIST, {hideLoader: true, silentError: isSilentError});
  }

  getPrepaidCardsDetails(
    request: PrepaidCardDetailsRequestModel
  ): Observable<PrepaidCardsDetailsResponseModel> {
    return this.post(Constants.PREPAID_CARDS_DETAILS, request);
  }

  checkRequestNewPrepaidEligibality(): Observable<any> {
    return this.get(Constants.PREPAID_CARDS_REQ_NEW_ELIGIBILITY);
  }

  getNewPrepaidOwnerData(): Observable<PrepaidRequestCardOwnerDataResModel> {
    return this.get(Constants.PREPAID_CARDS_REQ_NEW_OWNER_DATA);
  }

  validatePrepaidCardNewRequest(
    request: PrepaidRequestNewValidateReqModel
  ): Observable<PrepaidRequestNewValidateResModel> {
    return this.post(Constants.PREPAID_CARDS_REQ_NEW_VALIDATE, request);
  }

  confirmPrepaidCardNewRequest(
    request: PrepaidRequestNewConfirmReqModel
  ): Observable<PrepaidRequestNewConfirmResModel> {
    return this.post(Constants.PREPAID_CARDS_REQ_NEW_CONFIRM, request);
  }

  submitPrepaidCardDocuments(
    request: PrepaidCardAttachmentReqModel
  ): Observable<any> {
    return this.post(Constants.PREPAID_CARDS_REQ_NEW_ATTACH_DOC, request);
  }

  validatePrepaidLoadFundsRequest(
    request: PrepaidLoadFundsValidateReqModel
  ): Observable<PrepaidLoadFundsValidateResModel> {
    return this.post(Constants.PREPAID_CARD_LOAD_FUNDS_VALIDATE, request);
  }

  validateRefundFundsRequest(
    request: PrepaidLoadFundsValidateReqModel
  ): Observable<PrepaidLoadFundsValidateResModel> {
    return this.post(Constants.PREPAID_CARD_REFUND_VALIDATE, request);
  }

  confirmPrepaidLoadFundsRequest(
    request: PrepaidLoadFundsConfirmReqModel
  ): Observable<any> {
    return this.post(Constants.PREPAID_CARD_LOAD_FUNDS_CONFIRM, request);
  }

  confirmPrepaidRefundRequest(
    request: PrepaidLoadFundsConfirmReqModel
  ): Observable<any> {
    return this.post(Constants.PREPAID_CARD_REFUND_CONFIRM, request);
  }

  validateResetPinRequest(
    request: CardsResetPinValidateReqModel
  ): Observable<CardsResetPinValidateResModel> {
    return this.post(Constants.PREPAID_CARD_RESET_PIN_VALIDATE, request);
  }

  confirmResetPinRequest(
    request: CardsResetPinConfirmReqModel
  ): Observable<CardsResetPinConfirmResModel> {
    return this.post(Constants.PREPAID_CARD_RESET_PIN_CONFIRM, request);
  }

  getDocument(fileName: string) {
    const options: RequestOption = {contextPath: ContextPath.DOCUMENT_CONTEXT}
    this.getFile(fileName, fileName, true, options)
  }
}
