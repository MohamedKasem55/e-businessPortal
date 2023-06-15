export interface MandatoryDocuments {
  errorCode: string
  errorDescription: string
  generateChallengeAndOTP: any
  documentInfos: DocumentInfo[]
}

export interface DocumentInfo {
  documentCode: string
  description: string
  name: string
  fileType: any
}
export interface AttachementInfo {
  doessierId: string;
  documentCode: string;
  fileName: string;
  fileType: string;
  fileContent: string;
}

export interface RequireDocument{
  dosierId: string;
  reportName: string;
  productCode: string;
}
