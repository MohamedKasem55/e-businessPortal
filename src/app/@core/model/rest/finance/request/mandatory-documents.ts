import { ErrorResponse } from '../../ask/ask-alrajhi/ask-alrajhi-res.model';
import { GenerateChallengeAndOTP } from '../../common/otp.model';
export interface MandatoryDocuments {
  documentInfos : DocumentInfo[]
}
export interface DocumentInfo {
  documentCode: string
  description: string
  name: string
  fileType: any
}
export interface MandatoryDocumentsResponse {
  errorCode: string
  errorDescription: string
  errorResponse: ErrorResponse
  generateChallengeAndOTP: GenerateChallengeAndOTP
  documentInfos: DocumentInfo[]
}


