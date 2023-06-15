import {BaseResponse} from "../common/base-response";
import {RequestValidate} from "../common/otp.model";
import {Batch} from "../common/batchResponse";

export interface ValidateCreateChequeReq {
  accountNumber: string,
  chequeType: string
}

export interface ValidateChequeRes extends BaseResponse {
  batch: ChequeBatch
}

export interface ChequeBatch extends Batch{
  typeCheck: string,

}

export interface ConfirmCreateChequeReq {
  batch: ChequeBatch,
  requestValidate?: RequestValidate|null
}
export interface ConfirmCreateChequeRes extends BaseResponse{
  hasNextApprovalLevel: boolean,
}
