import { GenerateChallengeAndOTP, RequestValidate } from "../../common/otp.model"

export interface CardValidateActivateRequest {
    cardNumber: string
    cardSeqNumber: string
  }
  
  export interface CardValidateActivateRes {
    cardNumber: string
    cardSeqNumber: string
    generateChallengeAndOTP: GenerateChallengeAndOTP
  }
  
  export interface CardConfirmActivationReqeust {
    cardNumber: string
    cardSeqNumber: string
    requestValidate: RequestValidate
  }
  
  export interface CardConfirmActivationRes {
    
  }