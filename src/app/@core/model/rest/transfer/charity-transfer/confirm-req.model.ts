import { RequestValidate } from "../../common/otp.model";

export interface ConfirmReqModel {
  accountFrom: string,
  transferAmount: string,
  remarks: string,
  accountTo: string,
  requestValidate: RequestValidate
}
