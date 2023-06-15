import { Injectable } from '@angular/core';
import { GovProcessedTransactionsReq } from 'app/@core/model/rest/payments/government/gov-processed-transactions/gov-processed-transactions-req';
import { GovProcessedTransactionsRes } from 'app/@core/model/rest/payments/government/validate-response';
import { AbstractBaseService } from 'app/@core/service/base/abstract-base.service';
import { Observable } from "rxjs";
import { GovProcessedTransactionsConstants } from './gov-processed-transactions-urls';

@Injectable()
export class GovProcessedTransactionsService extends AbstractBaseService {

  getGovProcessedTransactions(govProcessedTransactionsReq: GovProcessedTransactionsReq): Observable<GovProcessedTransactionsRes> {
    return this.post(GovProcessedTransactionsConstants.GOV_PROCESSED_TRANSACTIONS,
      govProcessedTransactionsReq, {hideLoader: true});
  }
}
