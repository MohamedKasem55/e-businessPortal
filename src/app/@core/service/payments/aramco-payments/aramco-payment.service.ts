import { Injectable } from '@angular/core';
import { AbstractBaseService } from "../../base/abstract-base.service";
import { Observable } from "rxjs";
import { Constants } from './aramco-payment-urls';
import { BeneficiariesResModel } from 'app/@core/model/rest/payments/aramco-payment/beneficiaries-res';
import { BeneficiariesReqModel } from 'app/@core/model/rest/payments/aramco-payment/beneficiaries-req';
import { ValidateReqModel } from 'app/@core/model/rest/payments/aramco-payment/validate-req.model';
import { ValidateResModel } from 'app/@core/model/rest/payments/aramco-payment/validate-res.model';
import { ConfirmReqModel } from 'app/@core/model/rest/payments/aramco-payment/confirm-req.model';
import { AramcoPaymentAccountsResModel } from 'app/@core/model/rest/payments/aramco-payment/account-res';

@Injectable()
export class AramcoPaymentService extends AbstractBaseService {

  getBeneficiaryList(beneficiaryReq: BeneficiariesReqModel): Observable<BeneficiariesResModel> {
    return this.post(Constants.ARAMCO_PAY_BENEFICIARIES, beneficiaryReq, {hideLoader: true});
  }

  validateAramcoPayment(aramcoPayment: ValidateReqModel): Observable<ValidateResModel> {
    return this.post(Constants.ARAMCO_PAY_VALIDATE, aramcoPayment);
  }

  confirmAramcoPayment(aramcoPayment: ConfirmReqModel): Observable<any> {
    return this.post(Constants.ARAMCO_PAY_CONFIRM, aramcoPayment);
  }
  
  getAccountList(): Observable<AramcoPaymentAccountsResModel> {
    return this.get(Constants.ARAMCO_PAY_ACCOUNT);
  }

}
