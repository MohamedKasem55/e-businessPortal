import {BaseResponse} from "../../common/base-response";

export interface BulkPaymentTransferFileUploadRes extends BaseResponse {
  size: number,
  total: number,
  lineValidationDTOList: LineValidation[],
  fileName: string,
  numberLinesWithErrors: number,
  status: string,
  suspiciousPendingDuplicatedFiles: any,
  suspiciousSentUploadDuplicatedFiles: any,
  cutOffTimeStatus: any,
  exceedBalance: boolean,
  bulkPaymentsBatchDTO: any,
  pageListBulk: any,
  fundAccount: boolean,
  accountWithBalanceError: any,
  bulkPaymentsDetailsDTO: any,
  validationFileException: any
}

export interface LineValidation {
  errorCode: string,
  lineNumber: number,
  fieldName: string,
  fieldData: string
}
