import { Injectable } from '@angular/core';
import { AbstractBaseService } from '../../base/abstract-base.service';
import { Observable } from "rxjs";
import { Constants } from './business-cards-urls';
import { CardsUserApprovalRes } from 'app/@core/model/rest/cards/user-approval/list-res.model';
import { ValidateReqModel } from 'app/@core/model/rest/cards/user-approval/validate-req.model';
import { ValidateResModel } from 'app/@core/model/rest/cards/user-approval/validate-res.model';
import { DeleteReqModel } from 'app/@core/model/rest/cards/user-approval/delete-req.model';

@Injectable()
export class CardsApprovalService extends AbstractBaseService {

  getCardsApprovalList(page: number, rows: number): Observable<CardsUserApprovalRes> {
    return this.post(Constants.BUSINESS_CARDS_USER_APPROVAL, { page, rows }, {hideLoader: true});
  }

  validateCardsApproval(requestObj: ValidateReqModel): Observable<ValidateResModel> {
    return this.post(Constants.VALIDATE_CARD_APPROVAL, requestObj);
  }

  deleteCardsApproval(requestObj: DeleteReqModel): Observable<any> {
    return this.post(Constants.DELETE_REJECTED_CARD, requestObj);
  }

}
