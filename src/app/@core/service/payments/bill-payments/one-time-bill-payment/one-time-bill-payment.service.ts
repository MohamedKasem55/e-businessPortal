import {Injectable} from '@angular/core';
import {AbstractBaseService} from "../../../base/abstract-base.service";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Constants} from "./one-time-bill-payment-urls"
import {BillPaymentValidateReq} from 'app/@core/model/rest/payments/billPayment/bill-payment-validate-req';
import {BillPaymentValidateRes} from 'app/@core/model/rest/payments/billPayment/bill-payment-validate-res';
import {BillPayConfirmReq} from 'app/@core/model/rest/payments/billPayment/bill-pay-confirm-req';


@Injectable()
export class OneTimeBillPaymentService extends AbstractBaseService {

  getBillCodes(): Observable<any> {
    return this.get(Constants.GET_BILL_CODES)
  }

  confirmPayBill(BillPayConfirmReq?: BillPayConfirmReq): Observable<any> {
    return this.post(Constants.CONFIRM_BILL_PAYMENT, BillPayConfirmReq);
  }

  validatePayBill(billPayValidateReq: BillPaymentValidateReq, inquiry?: boolean): Observable<BillPaymentValidateRes> {
    return this.post(Constants.VALIDATE_BILL_PAYMENT, billPayValidateReq,
      inquiry ? {requestParams: new HttpParams().append('inquiry', inquiry)} : undefined)
  }
}
