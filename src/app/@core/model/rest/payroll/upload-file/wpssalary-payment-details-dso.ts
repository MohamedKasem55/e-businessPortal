import {FutureSecurityLevelsDtolist} from "../../common/batchResponse";
import {Account} from "../../common/account";

export interface WPSSalaryPaymentDetailsDSO {
  totalNumRajhi?: number;
  totalFeesRajhi?: number;
  numRajhiTransfers?: number;
  totalNumNonRajhi?: number;
  totalFeesNonRajhi?: number;
  numNonRajhiTransfers?: number;
  totalAmount?: number;
  numEmployees?: number;
  molId?: string
  futureSecurityLevelsDTOList?: FutureSecurityLevelsDtolist[]
  companyName?: string;
  tabadulCompanyCode?: string;
  payrollDebitAccount?: string;
  currencyDebitAccount?: string;
  payrollPrivilege?: string;
  monthlyFee?: number;
  localBankFee?: number;
  fileFee?: number;
  penaltyFee?: number;
  profileNumber?: string;
  activeFlag?: string;
  userFolder?: string;
  requestType?: string;
  updateOnlyAmounts?: boolean;
  errorMessageKey?: string;
  feedbackType?: string;
  molEstbid?: string;
  layout?: string;
  payrollChargeAccount?: string;
  transactionFee?: number;
  transactionFailFee?: number;
  transactionCanFee?: number;
  transactionFeeLocal?: number;
  transactionFailFeeLocal?: number;
  transactionCanFeeLocal?: number;
  postingFlag?: String;
  debitPreference?: String;
  fileAuth?: String;
  reject?: String;
  confirmation?: String;
  combined?: String;
  generationDate?: number;
  initial?: String;
  rejected?: String;
  combinedSum?: String;
  companyCat?: string;
  registered?: boolean;
  vatMonthlyFee?: number;
  vatTransactionFee?: number;
  vatTransactionFeeLocal?: number;
  vatFileFee?: number;
  vatPenaltyFee?: number;
  totalEstimated?: number;
  batchName?: string;
  paymentDate?: Date;
  initiationDate?: Date;
  approvedDate?: Date;
  batchStatus?: string;
  remarks?: string;
  paymentPurpose?: string;
  totalCancellationCharges?: number;
  customerReference?: string;
  account?: Account;
  fileReference?: string;
}
