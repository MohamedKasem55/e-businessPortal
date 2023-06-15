import {Injectable} from '@angular/core';
import {AbstractBaseService} from "../../base/abstract-base.service";
import {Observable} from "rxjs";
import {Constants} from "./esal-payment-urls";
import {FetchEsalBatchReq} from 'app/@core/model/rest/payments/esal-payment/esal-payment-item-fetching-req.model';
import {EsalPaymentItemRes} from 'app/@core/model/rest/payments/esal-payment/esal-payment-item-res.model';
import {EsalPaymentConfirmReq} from 'app/@core/model/rest/payments/esal-payment/esal-payment-confirm-req.model';
import {EsalPaymentValidateReq} from 'app/@core/model/rest/payments/esal-payment/esal-payment-validate-req.model';
import {EsalPaymentValidateRes} from 'app/@core/model/rest/payments/esal-payment/esal-payment-validate-res.model';
import {EsalStatisticDetails} from 'app/@core/model/rest/payments/esal-payment/esal-statistic-details-res.model';
import {EsalStatisticMonthlyList} from 'app/@core/model/rest/payments/esal-payment/esal-statistic-month-res.model';

@Injectable()
export class EsalPaymentService extends AbstractBaseService {

  fetchEsalPayment(singlePaymentInitiateReq: FetchEsalBatchReq): Observable<EsalPaymentItemRes> {
    return this.post(Constants.ESAL_LIST, singlePaymentInitiateReq)
  }

  validateEsalPayment(singlePaymentValidateReq?: EsalPaymentValidateReq): Observable<EsalPaymentValidateRes> {
    return this.post(Constants.ESAL_VALIDATE, singlePaymentValidateReq)
  }

  confirmEsalPayment(singlePaymentConfirmReq?: EsalPaymentConfirmReq): Observable<any> {
    return this.post(Constants.ESAL_CONFIRM, singlePaymentConfirmReq);
  }

  fetchEsalStatisticList(): Observable<EsalStatisticMonthlyList> {
    return this.get(Constants.ESAL_MONTHLY_STATICS);
  }

  fetchEsalMonthlyStatisticDetails(date: string): Observable<EsalStatisticDetails> {
    return this.get(Constants.ESAL_MONTHLY_STATICS_DETAILS + date, {hideLoader: true});
  }

}
