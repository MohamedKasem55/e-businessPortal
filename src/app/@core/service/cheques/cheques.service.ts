import {Injectable} from '@angular/core';
import {AbstractBaseService} from "../base/abstract-base.service";
import {Observable} from "rxjs";
import {ChequesListReq, ChequesListRes} from "../../model/rest/cheques/cheques-list";
import {ChequesConstants} from "./cheques-constants";
import {
  ConfirmCreateChequeReq,
  ConfirmCreateChequeRes,
  ValidateChequeRes,
  ValidateCreateChequeReq
} from "../../model/rest/cheques/create-cheque";
import {ConfirmDeleteChequeReq, ValidateDeleteChequeReq} from "../../model/rest/cheques/delete-cheque";
import {BaseResponse} from "../../model/rest/common/base-response";
import {PaginationBatchModel} from "../../model/rest/common/pagination-batch.model";
import {CreateChequesListRes} from "../../model/rest/cheques/user-approval/create-cheques-list-res";
import {StopChequesListRes} from "../../model/rest/cheques/user-approval/stop-cheques-list-res";

@Injectable()
export class ChequesService extends AbstractBaseService {

  getChequesList(chequesListReq: ChequesListReq): Observable<ChequesListRes> {
    return this.post(ChequesConstants.CHEQUES_LIST, chequesListReq, {hideLoader: true})
  }

  validateCreateCheque(validateCreateChequeReq: ValidateCreateChequeReq): Observable<ValidateChequeRes> {
    return this.post(ChequesConstants.VALIDATE_CREATE_CHEQUE, validateCreateChequeReq)
  }

  confirmCreateCheque(confirmCreateChequeReq: ConfirmCreateChequeReq): Observable<ConfirmCreateChequeRes> {
    return this.post(ChequesConstants.CONFIRM_CREATE_CHEQUE, confirmCreateChequeReq)
  }

  validateDeleteCheque(validateDeleteCheque: ValidateDeleteChequeReq): Observable<ValidateChequeRes> {
    return this.post(ChequesConstants.VALIDATE_DELETE_CHEQUE, validateDeleteCheque)
  }

  confirmDeleteCheque(confirmDeleteChequeReq: ConfirmDeleteChequeReq): Observable<BaseResponse> {
    return this.post(ChequesConstants.CONFIRM_DELETE_CHEQUE, confirmDeleteChequeReq)
  }

  getCreateChequesList(chequesUserApprovalReq: PaginationBatchModel): Observable<CreateChequesListRes> {
    return this.post(ChequesConstants.CREATE_CHEQUES_LIST, chequesUserApprovalReq, {hideLoader: true})
  }
  getStopChequesList(chequesUserApprovalReq: PaginationBatchModel): Observable<StopChequesListRes> {
    return this.post(ChequesConstants.STOP_CHEQUES_LIST, chequesUserApprovalReq)
  }
}
