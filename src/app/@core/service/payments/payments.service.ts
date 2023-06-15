import {Injectable} from '@angular/core';
import {AbstractBaseService} from "../base/abstract-base.service";
import {Observable} from "rxjs";
import {Constants} from "./bill-payments/bill-payment-urls";
import {SearchBillReq} from "../../model/rest/payments/billPayment/search-bill-req";
import {ListBillRes} from "../../model/rest/payments/list-bill-res";

@Injectable()
export class PaymentsService extends AbstractBaseService {


  getBillList(data: SearchBillReq): Observable<ListBillRes> {
    return this.post(Constants.BILL_SEARCH, data, {hideLoader: true})
  }
}
