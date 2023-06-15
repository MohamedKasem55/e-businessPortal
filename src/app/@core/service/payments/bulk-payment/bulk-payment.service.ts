import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {Constants} from "./bulk-payment-urls"
import {AbstractBaseService} from "../../base/abstract-base.service";
import {BulkBillReq} from "../../../model/rest/payments/bulk-payment/bulk-bill-req";
import {HttpParams} from "@angular/common/http";
import {BillPaymentValidateRes} from "../../../model/rest/payments/billPayment/bill-payment-validate-res";
import {BillPayConfirmReq} from "../../../model/rest/payments/billPayment/bill-pay-confirm-req";

@Injectable()
export class BulkPaymentService extends AbstractBaseService {

  downloadTemplate() {
    return this.get(Constants.GET_BULK_TEMPLATE, {responseType: 'blob'});
  }

  validateAddBulkBill(bulkBillReq: BulkBillReq, inquiry: boolean): Observable<BillPaymentValidateRes> {
    return this.post(Constants.VALIDATE_BILL_PAY, bulkBillReq,
      inquiry ? {requestParams: new HttpParams().append('inquiry', inquiry)}
        : undefined);
  }

  confirmPayBill(BillPayConfirmReq: BillPayConfirmReq): Observable<any> {
    return this.post(Constants.CONFIRM_BILL_PAYMENT, BillPayConfirmReq);
  }
}
