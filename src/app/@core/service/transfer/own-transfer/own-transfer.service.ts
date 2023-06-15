import {Injectable} from '@angular/core';
import {AbstractBaseService} from "../../base/abstract-base.service";
import {Constants} from "./own-transfer-service-urls";
import {Observable} from 'rxjs';
import {ValidateReqModel} from "../../../model/rest/transfer/ownTransfer/validate-req.model";
import {ConfirmReqModel} from "../../../model/rest/transfer/ownTransfer/confirm-req.model";
import {InitiateResModel} from "../../../model/rest/transfer/ownTransfer/initiate-res.model";
import {ValidateResModel} from "../../../model/rest/transfer/ownTransfer/validate-res.model";


@Injectable()
export class OwnTransferService extends AbstractBaseService {

  initiateOwnTransfer(): Observable<InitiateResModel> {
    return this.get(Constants.OWN_INITIATE);
  }

  validateOwnTransfer(transfer: ValidateReqModel): Observable<ValidateResModel> {
    return this.post(Constants.OWN_VALIDATE, transfer);
  }

  confirmOwnTransfer(transfer: ConfirmReqModel): Observable<any> {
    return this.post(Constants.OWN_CONFIRM, transfer);
  }
}
