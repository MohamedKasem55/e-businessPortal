import {RequestValidate} from "../../common/otp.model";

export interface ConfirmNewRegistrationReq {
  ibanNumber: string
  requestValidate: RequestValidate
}
