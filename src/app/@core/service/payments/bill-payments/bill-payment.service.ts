import {Injectable} from '@angular/core';
import {AbstractBaseService} from "../../base/abstract-base.service";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Constants} from "./bill-payment-urls";
import {BillDeleteReq} from "../../../model/rest/payments/billPayment/bill-delete-req";
import {BillPaymentValidateRes} from "../../../model/rest/payments/billPayment/bill-payment-validate-res";
import {BillPayConfirmReq} from "../../../model/rest/payments/billPayment/bill-pay-confirm-req";
import {BillPaymentValidateReq} from "../../../model/rest/payments/billPayment/bill-payment-validate-req";

@Injectable()
export class BillPaymentService extends AbstractBaseService {

  deleteBills(billDeleteReqs: BillDeleteReq): Observable<any> {
    return this.post(Constants.BILL_DELETE, billDeleteReqs)
  }

  validatePayBill(billPayValidateReq: BillPaymentValidateReq, inquiry?: boolean): Observable<BillPaymentValidateRes> {
    return this.post(Constants.BILL_PAY_VALIDATE, billPayValidateReq,
      {requestParams: inquiry ? new HttpParams().append('inquiry', inquiry) : undefined})
  }

  confirmPayBill(BillPayConfirmReq?: BillPayConfirmReq): Observable<any> {
    return this.post('billPaymentService/registerBillPay', BillPayConfirmReq);
  }


}
