import {Injectable} from '@angular/core';
import {AbstractBaseService} from "../base/abstract-base.service";
import {Constants} from "./transfer-service-urls";
import {TransferReasonReqModel} from "../../model/rest/common/transfer-reason-req.model";

@Injectable()
export class TransferService extends AbstractBaseService {
  constructor() {
    super();
  }


  getTransferPurpose(transferReasonRequest: TransferReasonReqModel) {
    return this.post(Constants.TRANSFER_REASON,
      transferReasonRequest);
  }
}
