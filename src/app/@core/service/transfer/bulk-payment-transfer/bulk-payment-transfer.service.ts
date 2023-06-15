import {Injectable} from '@angular/core';
import {AbstractBaseService} from "../../base/abstract-base.service";
import {Observable} from "rxjs";
import {HttpHeaders} from "@angular/common/http";
import {BulkPaymentTransferConstants} from "./bulk-payemnt-transfer-service-urls";
import {
  BulkPaymentTransferFileUploadRes
} from "../../../model/rest/transfer/bulk-payment-transfer/bulk-payment-transfer-file-upload-res";
import {
  BulkPaymentsConfirmUploadFileReq
} from "../../../model/rest/transfer/bulk-payment-transfer/bulk-payments-confirm-upload-file-req";
import {
  BulkPaymentsProcessUploadFileReq
} from "../../../model/rest/transfer/bulk-payment-transfer/bulk-payments-process-upload-file-req";
import {
  EligibilityCheckValidityRes
} from "../../../model/rest/transfer/bulk-payment-transfer/eligibility-check-validity-res";
import {
  ValidateNewRegistrationReq
} from "../../../model/rest/transfer/bulk-payment-transfer/validate-new-registration-req";
import {
  ConfirmNewRegistrationReq
} from "../../../model/rest/transfer/bulk-payment-transfer/confirm-new-registration-req";

@Injectable()
export class BulkPaymentTransferService extends AbstractBaseService {

  downloadTemplate() {
    this.getFile("BulkPayment.xlsm")
  }

  public validateUpload(file: File, batchName: any): Observable<BulkPaymentTransferFileUploadRes> {
    const data = {batchName: batchName}
    const formData = new FormData()

    formData.append('json', JSON.stringify(data))
    formData.append('file', file)

    return this.post(
      BulkPaymentTransferConstants.FILE_UPLOAD,
      formData,
      {
        customHeaders: new HttpHeaders().set('Content-Type', 'multipart/form-data')
      });
  }

  public confirmUploadAndMoveToNextLevel(request: BulkPaymentsConfirmUploadFileReq): Observable<BulkPaymentTransferFileUploadRes> {
    return this.post(BulkPaymentTransferConstants.CONFIRM_FILE_UPLOAD, request);
  }

  public processUpload(request: BulkPaymentsProcessUploadFileReq): Observable<BulkPaymentTransferFileUploadRes> {
    return this.post(BulkPaymentTransferConstants.PROCESS_FILE_UPLOAD, request);
  }

  public initiateRequest(): Observable<EligibilityCheckValidityRes> {
    return this.get(BulkPaymentTransferConstants.ELIGIBILITY_CHECK)
  }

  public validateNewRegistration(request: ValidateNewRegistrationReq): Observable<any> {
    return this.post(BulkPaymentTransferConstants.VALIDATE_BULK_PAYMENT_REGISTRATION, request)
  }

  public confirmNewRegistration(request: ConfirmNewRegistrationReq): Observable<any> {
    return this.post(BulkPaymentTransferConstants.CONFIRM_BULK_PAYMENT_REGISTRATION, request)
  }

}
