import {RequestValidate} from "../common/otp.model";
import {ChequeBatch} from "./create-cheque";

export interface ValidateDeleteChequeReq {
  accountNumber: string,
  chequeNumber: string,
  stopMode: number
}
export interface ConfirmDeleteChequeReq{
  batch: ChequeBatch,
  requestValidate?: RequestValidate|null
}
