import { ErrorResponse } from '../../common/base-response';
export interface RequiredDocs {
  errorCode: string
  errorDescription: string
  errorResponse: ErrorResponse
  generateChallengeAndOTP: any
  documentInfos: DocumentInfo[]
}



export interface DocumentInfo {
  documentCode: string
  description: string
  name: string
  fileType: any
}

