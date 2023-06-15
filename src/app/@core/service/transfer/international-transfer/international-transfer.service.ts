import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AbstractBaseService} from '../../base/abstract-base.service';
import {Constants} from "./international-transfer-service-urls";
import {ReasonsReqModel} from "../../../model/rest/transfer/international-transfer/reasons-req.model";
import {ReasonsResModel} from "../../../model/rest/transfer/international-transfer/reasons-res.model";
import {InitiateReqModel} from "../../../model/rest/transfer/international-transfer/initiate-req.model";
import {InitiateResModel} from "../../../model/rest/transfer/international-transfer/initiate-res.model";
import {ValidateReqModel} from "../../../model/rest/transfer/international-transfer/validate-req.model";
import {ValidateResModel} from "../../../model/rest/transfer/alrajhi-transfer/validate-res.model";
import {ConfirmReqModel} from "../../../model/rest/transfer/international-transfer/confirm-req.model";
import {CurrencyReqModel} from "../../../model/rest/transfer/international-transfer/currency-req.model";
import {CurrencyResModel} from "../../../model/rest/transfer/international-transfer/currency-res.model";

@Injectable()

export class InternationalTransferService extends AbstractBaseService {



  initiateInternationalTransfer(data: InitiateReqModel): Observable<InitiateResModel> {
    return this.post(Constants.INTERNATIONAL_INITIATE, data);
  }

  validateInternationalTransfer(transfer: ValidateReqModel): Observable<ValidateResModel> {
    return this.post(Constants.INTERNATIONAL_VALIDATE, transfer);
  }

  confirmInternationalTransfer(transfer: ConfirmReqModel): Observable<any> {
    return this.post(Constants.INTERNATIONAL_CONFIRM, transfer);
  }

  getReasonsInternationalTransfer(transfer: ReasonsReqModel): Observable<ReasonsResModel> {
    return this.post(Constants.INTERNATIONAL_REASONS, transfer);
  }

  getCurrencyInternationalTransfer(data: CurrencyReqModel): Observable<CurrencyResModel> {
    return this.post(Constants.INTERNATIONAL_CURRENCY, data);
  }
}
