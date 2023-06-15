import { RequestValidate } from "../../common/otp.model"

export interface  CardCredentialOtpVerificationReqModel {
  cardNumber?: string
  cardSeqNumber?: string
  details?: boolean
  requestValidate?: RequestValidate
}