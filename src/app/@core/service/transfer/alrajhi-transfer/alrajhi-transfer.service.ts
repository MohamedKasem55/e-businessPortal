import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AbstractBaseService} from '../../base/abstract-base.service';
import {Constants} from './alrajhi-transfer-service-urls';
import {ValidateReqModel} from "../../../model/rest/transfer/alrajhi-transfer/validate-req.model";
import {ConfirmReqModel} from "../../../model/rest/transfer/alrajhi-transfer/confirm-req.model";
import {ValidateResModel} from "../../../model/rest/transfer/alrajhi-transfer/validate-res.model";
import {InitiateResModel} from "../../../model/rest/transfer/alrajhi-transfer/initiate-res.model";

@Injectable()

export class AlrajhiTransferService extends AbstractBaseService {

  initiateAlrajhiTransfer(): Observable<InitiateResModel>{
    return this.get(Constants.ALRAJHI_INITIATE);
  }

  validateAlrajhiTransfer(transfer: ValidateReqModel): Observable<ValidateResModel>{
    return this.post(Constants.ALRAJHI_VALIDATE, transfer);
  }

  confirmAlrajhiTransfer(transfer: ConfirmReqModel): Observable<any>{
    return this.post(Constants.ALRAJHI_CONFIRM, transfer);
  }
}
