import {Account} from "../common/account"

export interface ProcessedTransactionsRes {
  size: number
  total: number
  items: ProcessedTransaction[]
}

export interface ProcessedTransaction {
  transferBatchPk: number
  profileNumber: string
  accountFrom: Account
  transferType: string
  status: string
  initiationDate: string
  beneficiaryAccount?: string
  beneficiaryName: string
  beneficiaryBank: string
  country: string
  amount: string
  currency?: string
  sarAmount: string
  exchangeRate: number
  feesAmount: string
  erCurrency: string
  feesCurrency: string
  beStatus?: string
  initiatedBy: string
  approvedBy: string
  approvedDate: string
  proxyValue: string
  sarCurrency: string
}

export interface AccountsComboDataReq {
  order: string;
  orderType: string;
  page: number;
  rows: number;
  txType: string;
}

export interface BankNamesReq {
  amountFrom: number;
  amountTo: number;
  approvedBy: any;
  beneficiaryBank: any;
  country: string;
  currency: any;
  debitAccount: any;
  initiatedBy: any;
  lastApprovalDateFrom: any;
  lastApprovalDateTo: any;
  page: number;
  paymentType: any;
  rows: number;
  status: any;
}

export interface ProcessedTransactionsRequest {

  batchList: ProcessedTransactionReqWithDTLs[]
}

export interface ProcessedTransactionReqWithDTLs extends ProcessedTransaction {
  _currency: string
  _pais: string
  _status: string
  _transferType: string
}
