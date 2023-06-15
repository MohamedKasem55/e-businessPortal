/* Main Types Responses */
export interface GeneralFeesRes {
  generalFees: GeneralFees;
}
export interface BulkFeesRes {
  generalFees: GeneralFees;
  bulkPaymentsParametersDTO: BulkPaymentsParametersDto;
}

export interface PayrollCardFeesRes {
  listFees: PayrollCardFeesItem[];
  institutionId: string
}

/* General Fees Responses */
export interface GeneralFees {
  size: number;
  total: number;
  items: GeneralFeesItem[];
}

export interface GeneralFeesItem {
  dataType: string;
  code: string;
  amount: number;
  localizedDataType?: string
}

/* PayrollCard Fees Responses */
export interface PayrollCardFeesItem {
  functionCode: string;
  englishDescription: string;
  arabicDescription: string;
  localizedDescription: string;
  feesAmount: number;
}

/* BulkPayments Fees Responses */
export interface BulkPaymentsParametersDto {
  companyName?: string;
  bulkPaymentsDebitAccount?: string;
  currencyDebitAccount?: string;
  bulkPaymentsPrivilege?: string;
  monthlyFee?: number;
  fileFee?: number;
  penaltyFee?: number;
  profileNumber?: string;
  activeFlag?: string;
  userFolder?: string;
  requestType?: string;
  updateOnlyAmounts?: boolean;
  errorMessageKey?: boolean;
  feedbackType?: string;
  chargeAccountNumber?: string;
  chargeAccountFixed?: string;
  transactionFee?: number;
  transactionFailFee?: number;
  transactionCanFee?: number;
  transactionFeeLocal?: number;
  transactionFailFeeLocal?: number;
  transactionCanFeeLocal?: number;
  transactionFeeCurrentLocal?: number;
  postingFlag?: string;
  debitPreference?: string;
  confirmationFeedbackFlag?: string;
  rejectionFeedbackFlag?: string;
  combinedFeedbackFlag?: string;
  combinedDaysFeedbackFlag?: number;
  summaryReportRejectionFeedback?: string;
  summaryReportCombinedFeedback?: string;
  userIdCreatorCompany?: string;
  companyUpdateDateAndTime?: string;
  userIdUpdatedatorCompany?: string;
  forceDebitOrFundFlag?: string;
  reject?: string;
  confirmation?: string;
  combined?: string;
  generationDate?: number;
  initial?: string;
  rejected?: string;
  combinedSum?: string;
  companyCat?: string;
  registered?: boolean;
  organizationType?: string;
  companyCode?: string;
  productCode?: string;
  functionToBePerformed?: string;
  currencyCode?: string;
  monthlyFeesFlag?: string;
  systemDate?: string;
  windowCodePageFiles?: string;
  statusFlag?: string;
  initialFeedbackFlag?: string;
  productChannelCode?: string;
}
