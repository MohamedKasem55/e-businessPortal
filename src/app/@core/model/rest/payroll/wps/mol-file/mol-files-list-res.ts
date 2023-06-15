import {Account} from "../../../common/account";

export interface MolFilesListRes {
  accountList: Account[];
  payrollCompanyDetails: PayrollParametersDSO
  listFile: Items
}

export interface PayrollParametersDSO {
  companyName: string;
  tabadulCompanyCode: string;
  payrollDebitAccount: string;
  currencyDebitAccount: string;
  payrollPrivilege: string;
  monthlyFee: number;
  localBankFee: number;
  fileFee: number;
  penaltyFee: number;
  profileNumber: string;
  activeFlag: string;
  userFolder: string;
  requestType: string;
  updateOnlyAmounts: boolean
  errorMessageKey: string;
  feedbackType: string;
  molEstbid: string;
  layout: string;
  payrollChargeAccount: string;
  transactionFee: number;
  transactionFailFee: number;
  transactionCanFee: number;
  transactionFeeLocal: number;
  transactionFailFeeLocal: number;
  transactionCanFeeLocal: number;
  postingFlag: string;
  debitPreference: string;
  fileAuth: string;
  reject: string;
  confirmation: string;
  combined: string;
  generationDate: number;
  initial: string;
  rejected: string;
  combinedSum: string;
  companyCat: string;
  registered: boolean;
  vatMonthlyFee: number;
  vatTransactionFee: number;
  vatTransactionFeeLocal: number;
  vatFileFee: number;
  vatPenaltyFee: number;
}

export interface WPSSalaryFileDSO {
  paymentPurpose: string;
  molEstbid: string,
  allowCancellation: boolean
  wpsSalaryDetailsDTOList: WPSSalaryFileDetailsDTO[]
  type: string;
  // SalaryFileHeaderDTO salaryFileHeaderDTO;
  // private List<SalaryFileDetailsDTO> salaryDetailsDTOList;

  userFileName: string;
  path: string;
  batchName: string;
  rajhiRecordCount: number;
  rajhiRecordAmount: number;
  localRecordCount: number;
  localRecordAmount: number;
  paymentDate: Date;
  initiationDate: Date;
  totalAmount: number;
  accountFrom: string;
  customerReference: string;
  paid: number;
  unPaid: number;
  numPaid: number;
  numUnPaid: number;
  initiatedBy: string;
  approvedDate: Date;
  approvedBy: string;
  cancelled: boolean;
  batchPk: number;
  companyCode: string;
  fileHash: string;
  localRecordFees: number;
  rajhiRecordFees: number;
  fileName: string;
  dataReceived: Date;
  dirUploadArchive: boolean;
  fileSize: number;
}

export interface Items {
  items: WPSSalaryFileDSO[]
  size: number;
  total: number
}

export interface WPSSalaryFileDetailsDTO {
  messageCode: string;
  messageDescription: string;
  currencyCode: string;
  salaryBasic: number;
  allowanceHousing: number;
  allowanceOther: number;
  deductions: number;
  bankBranchCode: string;
  bankBranchName: string;
  payMode: string;
  checkDigit: string;
  paymentDetails: string;
  originalLine: string;
  remarks: string;
  department: string;
  systemHeaderRef: string;
  payrollDetailsPk: number;
  employeeNumber: string;
  bankCode: string;
  account: string;
  name: string;
  amount: number;
  employeeId: string;
  employeeType: string;
  processFlag: string;
  blockAmount: string;
}
