import { Injectable } from '@angular/core';
import { EsalProcessedTransactionsRes } from 'app/@core/model/rest/payments/esal-payment/esal-payment-item-res.model';
import { EsalProcessedTransactionsReq } from 'app/@core/model/rest/payments/esal-payment/esal-processed-transactions/esal-processed-transactions-req';
import { AbstractBaseService } from 'app/@core/service/base/abstract-base.service';
import { Observable } from "rxjs";
import { EsalProcessedTransactionsConstants } from './esal-processed-transactions-urls';

@Injectable()
export class EsalProcessedTransactionsService extends AbstractBaseService {

  getEsalProcessedTransactions(esalProcessedTransactionsReq: EsalProcessedTransactionsReq): Observable<EsalProcessedTransactionsRes> {
    return this.post(EsalProcessedTransactionsConstants.ESAL_PROCESSED_TRANSACTIONS,
      esalProcessedTransactionsReq, {hideLoader: true});
  }
}
