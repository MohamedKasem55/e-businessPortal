export interface BaseResponse extends ErrorBaseResponse {
  generateChallengeAndOTP?: ResponseGenerateChallenge
}

export interface ResponseGenerateChallenge {
  isNoQr?: boolean
  challengeCode?: string
  serial?: string
  typeAuthentication: any
  mobileNumber?: string;
  owner?: boolean;
}

export interface ErrorBaseResponse {
  errorCode?: string
  errorDescription: string
  errorResponse: ErrorResponse
}

export interface ErrorResponse {
  englishMessage: string
  arabicMessage: string
  code: string
  description: string
  reference?: string
}

