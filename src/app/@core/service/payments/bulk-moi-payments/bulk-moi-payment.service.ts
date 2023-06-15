import { Injectable } from '@angular/core';
import {
  AlienControlReq,
  BulkMoiPaymentConfirmReq,
  BulkMoiPaymentTemplateDownloadReq,
  BulkMoiPaymentValidationReq,
} from 'app/@core/model/rest/payments/bulk-moi-payment/bulk-moi-payment-req';
import {
  BulkMoiPaymentAlienControlRes,
  BulkMoiPaymentConfirmRes,
  BulkMoiPaymentValidationRes,
} from 'app/@core/model/rest/payments/bulk-moi-payment/bulk-moi-payment-res';
import { Observable } from 'rxjs';
import { AbstractBaseService } from '../../base/abstract-base.service';
import { Constants } from './bulk-moi-payment-urls';

@Injectable()
export class BulkMoiPaymentService extends AbstractBaseService {
  downloadTemplate(params: BulkMoiPaymentTemplateDownloadReq) {
    this.getFile(params.name, Constants.BULK_MOI_PAYMENT_TEMPLATE_DOWNLOAD);
  }

  bulkMoiPaymentSummary(
    batch: AlienControlReq[]
  ): Observable<BulkMoiPaymentAlienControlRes> {
    return this.post(Constants.BULK_MOI_PAYMENT_LIST, { batch });
  }

  bulkMoiPaymentValidate(
    params: BulkMoiPaymentValidationReq
  ): Observable<BulkMoiPaymentValidationRes> {
    return this.post(Constants.BULK_MOI_PAYMENT_VALIDATE, {
      batchList: params,
    });
  }

  bulkMoiPaymentConfirm(
    params: BulkMoiPaymentConfirmReq
  ): Observable<BulkMoiPaymentConfirmRes> {
    return this.post(Constants.BULK_MOI_PAYMENT_CONFIRM, {
      batchList: params.batchList,
      requestValidate: params.requestValidate,
    });
  }
}
