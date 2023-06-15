import { ErrorResponse } from '../../ask/ask-alrajhi/ask-alrajhi-res.model';

export interface FinalAgreementAcceptance{
  dosierID:string,
  body?:FinalAgreementBody
}
export interface FinalAgreementBody{
    accepted?: boolean,
    initialOffer?:boolean,
    productCode?: string,
    action?:string
}

export interface FinalAgreementResponse{
  errorCode: string
  errorDescription: string
  errorResponse: ErrorResponse
  generateChallengeAndOTP: any
}




