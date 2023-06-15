import { Injectable } from '@angular/core';
import { CardCredentialOtpVerificationReqModel } from 'app/@core/model/rest/cards/card-details/card-details-credential-validate-req.model';
import { CardCredentialOtpVerificationResModel } from 'app/@core/model/rest/cards/card-details/card-details-credential-validate-res.model';
import { CardsDetailsOtpResponseModel } from 'app/@core/model/rest/cards/card-details/card-details-otp-res.model';
import { Observable } from 'rxjs';
import { AbstractBaseService } from '../../base/abstract-base.service';
import { Constants } from './card-details-credentials-urls';

@Injectable()
export class CardDetailsCredentialsService extends AbstractBaseService {

  sendCardCredentialsOtp():Observable<CardsDetailsOtpResponseModel> {
    return this.get(Constants.CARD_DETAILS_CREDENTIALS_OTP);
  }

  validateCardCredentialOtp(prepaidCardsDetailsReqModel:CardCredentialOtpVerificationReqModel ): Observable<CardCredentialOtpVerificationResModel> {
    return this.post(Constants.CARD_DETAILS_CREDENTIALS_VALIDATE, prepaidCardsDetailsReqModel);
  }
}
