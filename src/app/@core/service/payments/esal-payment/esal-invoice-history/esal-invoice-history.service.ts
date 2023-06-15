import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EsalInvoiceHistoryRes } from 'app/@core/model/rest/payments/esal-payment/esal-invoice-history/esal-invoice-history-res.model';
import { AbstractBaseService } from '../../../base/abstract-base.service';
import { Constants } from './esal-invoice-history-urls';
import { EsalParamsReq } from 'app/pages/payments/esal-payment/esal-invoice-history/esal-invoice-history-controls';
import { HttpParams } from '@angular/common/http';

@Injectable()
export class EsalInvoiceHistoryService extends AbstractBaseService {
  getEsalInvoiceHistoryList(
    params: EsalParamsReq
  ): Observable<EsalInvoiceHistoryRes> {
    return this.post(Constants.ESAL_INVOICE_HISTORY_LIST, {
      invoiceNumber: params.invoiceNumber,
      billerName: params.billerName,
      payDateFrom: params.payDateFrom,
      payDateTo: params.payDateTo,
      amountFrom: params.amountFrom,
      amountTo: params.amountTo,
      page: params.page,
      rows: params.rows,
    }, {hideLoader: true});
  }
}
