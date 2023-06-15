import {Injectable} from '@angular/core';
import {AbstractBaseService} from "../../base/abstract-base.service";
import {Constants} from "./local-transfer-service-urls";
import {Observable} from "rxjs";
import {InitiateResModel} from "../../../model/rest/transfer/local-transfer/initiate-res.model";
import {ValidateReqModel} from "../../../model/rest/transfer/local-transfer/validate-req.model";
import {ValidateResModel} from "../../../model/rest/transfer/local-transfer/validate-res.model";
import {ConfirmReqModel} from "../../../model/rest/transfer/local-transfer/confirm-req.model";

@Injectable()
export class LocalTransferService extends AbstractBaseService {

  getInitiate():Observable<InitiateResModel> {
    return this.get(Constants.INITIATE);
  }

  validateLocalTransfer(validateReqModel:ValidateReqModel):Observable<ValidateResModel> {
    return this.post(Constants.VALIDATE, validateReqModel);
  }

  confirmLocalTransfer(confirmReqModel: ConfirmReqModel) {
    return this.post(Constants.CONFIRM, confirmReqModel);
  }
}
