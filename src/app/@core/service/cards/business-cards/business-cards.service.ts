import {Injectable} from '@angular/core';
import {AbstractBaseService} from "../../base/abstract-base.service";
import {Constants} from "./business-cards-urls";
import {Observable} from "rxjs";
import {BusinessCardsListResponseModel} from 'app/@core/model/rest/cards/business-cards/list-res.model';
import {
  BusinessCardsDetailsRequest,
  BusinessCardsDetailsResponse
} from 'app/@core/model/rest/cards/business-cards/business-cards-models';
import {CardsResetPinValidateResModel} from 'app/@core/model/rest/cards/common/reset-pin-validate-res.model';
import {CardsResetPinConfirmReqModel} from 'app/@core/model/rest/cards/common/reset-pin-confirm-req.model';


@Injectable()
export class BusinessCardsService extends AbstractBaseService {

  getBusinessCardsList(isSilentError: boolean = false): Observable<BusinessCardsListResponseModel> {
    return this.post(Constants.BUSINESS_CARDS_LIST, {}, {hideLoader: true, silentError: isSilentError});
  }

  getBusinessCardDetails(card: BusinessCardsDetailsRequest): Observable<BusinessCardsDetailsResponse> {
    return this.post(Constants.BUSINESS_CARDS_DETAILS, card);
  }

  validateResetPinRequest(): Observable<CardsResetPinValidateResModel> {
    return this.get(Constants.CARD_RESET_PIN_VALIDATE);
  }

  confirmResetPinRequest(request: CardsResetPinConfirmReqModel): Observable<CardsResetPinConfirmReqModel> {
    return this.post(Constants.CARD_RESET_PIN_CONFIRM, request);
  }

}
