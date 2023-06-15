import {Injectable} from '@angular/core';
import {AbstractBaseService} from "../../base/abstract-base.service";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import { Constants } from './gov-payment-urls';
import { GovPaymentDeleteReq } from 'app/@core/model/rest/payments/gov-payment/gov-payment-delete-req';

@Injectable()
export class GovPaymentService extends AbstractBaseService {

  deleteGovPayment(govPaymentDeleteReq: GovPaymentDeleteReq): Observable<any> {
    return this.delete(Constants.GOVERNMENT_PAYMENT_DELETE, govPaymentDeleteReq)
  }

  /*validatePayBill(billPayValidateReq: BillPaymentValidateReq, inquiry?: boolean): Observable<BillPaymentValidateRes> {
    return this.post(Constants.BILL_PAY_VALIDATE, billPayValidateReq,
      {requestParams: inquiry ? new HttpParams().append('inquiry', inquiry) : undefined})
  }

  confirmPayBill(BillPayConfirmReq?: BillPayConfirmReq): Observable<any> {
    return this.post('billPaymentService/registerBillPay', BillPayConfirmReq);
  }*/


}
