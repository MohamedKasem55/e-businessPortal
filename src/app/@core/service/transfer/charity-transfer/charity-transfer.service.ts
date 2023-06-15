import { Injectable } from '@angular/core';
import { charityListResModel } from 'app/@core/model/rest/transfer/charity-transfer/charity-list-res.model';
import { ConfirmReqModel } from 'app/@core/model/rest/transfer/charity-transfer/confirm-req.model';
import { ConfirmResModel } from 'app/@core/model/rest/transfer/charity-transfer/confirm-res.model';
import { ValidateReqModel } from 'app/@core/model/rest/transfer/charity-transfer/validate-req.model';
import { ValidateResModel } from 'app/@core/model/rest/transfer/charity-transfer/validate-res.model';
import { Observable } from 'rxjs';
import { AbstractBaseService, RequestOption } from '../../base/abstract-base.service';
import { Constants } from './charity-transfer-service-urls';

@Injectable()

export class CharityTransferService extends AbstractBaseService {

  charityTransferList(params: any): Observable<charityListResModel> {
    let reqParams: RequestOption = {requestParams: params, hideLoader: true}
    return this.get(Constants.CHARITY_LIST, reqParams);
  }

  validateCharityTransfer(transfer: ValidateReqModel): Observable<ValidateResModel> {
    return this.post(Constants.CHARITY_VALIDATE, transfer);
  }

  confirmCharityTransfer(transfer: ConfirmReqModel): Observable<ConfirmResModel> {
    return this.post(Constants.CHARITY_CONFIRM, transfer);
  }
}
