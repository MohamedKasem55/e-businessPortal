import {Injectable} from '@angular/core';
import {
  DebitCardsListResponseModel,
  DebitCardPOSLimitsRequest,
  DebitCardPOSLimitsRes,
  DebitCardsPOSLimitListRequest,
  DebitCardsPOSLimitListRes,
  DebitCardChangeInternetRequest,
  DebitCardChangeInternetRes,
  DebitCardChangePOSLimitRes,
  DebitCardChangePOSLimitRequest,
  DebitCardApplyNewCardInitRes,
  DebitCardValidateApplyNewCardRes,
  DebitCardConfirmApplyNewCardRequest,
  BranchesOfCityReqeust
} from 'app/@core/model/rest/cards/debit-cards/list-res.model';
import {
  DebitResetPinCofnrimRequest,
  DebitResetPinValidateRes
} from 'app/@core/model/rest/cards/debit-cards/reset-pint-models';
import {Observable} from 'rxjs';
import {AbstractBaseService, ContextPath, RequestOption} from '../../base/abstract-base.service';
import {Constants} from './debit-cards-urls';

@Injectable()
export class DebitCardsService extends AbstractBaseService {

  getDebitCardsList(maxRecs: number, offset: number, isSilentError: boolean = false): Observable<DebitCardsListResponseModel> {
    return this.post(Constants.DEBIT_CARDS_LIST, {recPgCtrlIn: {maxRecs, offset}}, {
      hideLoader: true,
      silentError: isSilentError
    });
  }

  validateResetPinRequest(): Observable<DebitResetPinValidateRes> {
    return this.post(Constants.DEBIT_CARDS_RESET_PIN_VALIDATE, {});
  }

  confirmResetPinRequest(request: DebitResetPinCofnrimRequest): Observable<any> {
    return this.post(Constants.DEBIT_CARDS_RESET_PIN_CONFIRM, request);
  }

  getDebitCardPOSLimits(request: DebitCardPOSLimitsRequest): Observable<DebitCardPOSLimitsRes> {
    return this.post(Constants.DEBIT_CARD_POS_LIMITS, request);
  }

  getDebitCardsPOSLimitLookups(request: DebitCardsPOSLimitListRequest): Observable<DebitCardsPOSLimitListRes> {
    return this.post(Constants.DEBIT_CARDS_POS_LIMITS_LOOKUP_LIST, request);
  }

  changeDebitCardInternet(request: DebitCardChangeInternetRequest): Observable<DebitCardChangeInternetRes> {
    return this.post(Constants.DEBIT_CARDS_CHANGE_INTERNET, request);
  }

  changeDebitCardPOSLimit(request: DebitCardChangePOSLimitRequest): Observable<DebitCardChangePOSLimitRes> {
    return this.post(Constants.DEBIT_CARDS_CHANGE_POS_LIMIT, request);
  }

  initDebitApplyNewCard(): Observable<DebitCardApplyNewCardInitRes> {
    return this.post(Constants.DEBIT_CARDS_APPLY_NEW_CARD, {});
  }

  validateDebitApplyNewCard(): Observable<DebitCardValidateApplyNewCardRes> {
    return this.post(Constants.DEBIT_CARDS_VALIDATE_APPLY_NEW_CARD, {});
  }

  confirmDebitApplyNewCard(req: DebitCardConfirmApplyNewCardRequest): Observable<DebitCardConfirmApplyNewCardRequest> {
    return this.post(Constants.DEBIT_CARDS_CONFIRM_APPLY_NEW_CARD, req);
  }

  getAllBranchesOfCity(req: BranchesOfCityReqeust): Observable<any> {
    req.name = 'allCititesOfBranches'
    return this.post(Constants.BRANCHES_OF_CITY, req);
  }

  getDocument(fileName: string) {
    const options: RequestOption = {contextPath: ContextPath.DOCUMENT_CONTEXT}
    this.getFile(fileName, fileName, true, options)
  }
}
