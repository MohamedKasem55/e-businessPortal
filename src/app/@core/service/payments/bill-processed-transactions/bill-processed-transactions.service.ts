import { Injectable } from '@angular/core';
import { BillProcessedTransactionsReq } from 'app/@core/model/rest/payments/bill-processed-transactions/bill-processed-transactions-req';
import { BillProcessedTransactionsRes } from 'app/@core/model/rest/payments/billPayment/bill-payment-validate-res';
import { Observable } from "rxjs";
import { AbstractBaseService } from "../../base/abstract-base.service";
import { BillProcessedTransactionsConstants } from './bill-processed-transactions-urls';

@Injectable()
export class BillProcessedTransactionsService extends AbstractBaseService {

  getBillProcessedTransactions(billProcessedTransactionsReq: BillProcessedTransactionsReq): Observable<BillProcessedTransactionsRes> {
    return this.post(BillProcessedTransactionsConstants.BILL_PROCESSED_TRANSACTIONS,
      billProcessedTransactionsReq, {hideLoader: true});
  }
}
