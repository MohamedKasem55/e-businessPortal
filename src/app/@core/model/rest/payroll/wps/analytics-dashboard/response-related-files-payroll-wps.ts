export interface ResponseRelatedFilesPayrollWPS {
  errorCode: string
  errorDescription: string
  errorResponse: ErrorServiceResponse
  files: WpsFile[]
  months: string[]
}
export interface ErrorServiceResponse {
  arabicMessage: string
  code: string
  description: string
  englishMessage: string
}
export interface WpsFile {
  accountFrom: string
  approvedBy: string
  approvedDate: string
  batchName: string
  batchPk: number
  cancelled: boolean
  companyCode: string
  customerReference: string
  dataReceived: string
  dirUploadArchive: boolean
  fileHash: string
  fileName: string
  fileSize: number
  initiatedBy: string
  initiationDate: string
  localRecordAmount: number
  localRecordCount: number
  molEstbid: string
  numPaid: number
  numUnPaid: number
  paid: number
  path: string
  paymentDate: string
  paymentPurpose: string
  rajhiRecordAmount: number
  rajhiRecordCount: number
  salaryDetailsDTOList: SalaryDetailsDTOList[]
  salaryFileHeaderDTO: SalaryFileHeaderDTO
  totalAmount: number
  type: string
  unPaid: number
  userFileName: string
  wpsSalaryDetailsDTOList: WpsSalaryDetailsDTOList[]
}
export interface SalaryDetailsDTOList {
  account: string
  accountFrom21length: string
  amount: string
  bankCode: string
  blockAmount: string
  employeeId: string
  employeeNumber: string
  employeeType: string
  messageCode: string
  name: string
  payrollDetailsPk: number
  processFlag: string
}
export interface SalaryFileHeaderDTO {
  accountFrom: string
  all: string
  billHeader: string
  channelId: string
  companyRemarks: string
  customerReference: string
  dateSend: string
  dateValue: string
  emptyInfo: string
  keyHeader: string
  messageCode: string
  paymentPurpose: string
  sequence: string
  systemHeaderRef: string
  totalAmount: string
  totalCnt: string
  type: string
}
export interface WpsSalaryDetailsDTOList {
  account: string
  accountFrom21length: string
  allowanceHousing: number
  allowanceOther: number
  amount: number
  bankBranchCode: string
  bankBranchName: string
  bankCode: string
  blockAmount: string
  checkDigit: string
  currencyCode: string
  deductions: number
  department: string
  employeeId: string
  employeeNumber: string
  employeeType: string
  messageCode: string
  messageDescription: string
  name: string
  originalLine: string
  payMode: string
  paymentDetails: string
  payrollDetailsPk: number
  processFlag: string
  remarks: string
  salaryBasic: number
  systemHeaderRef: string
}

