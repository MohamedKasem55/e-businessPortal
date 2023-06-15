import { Account } from "../../common/account"
import { GenerateChallengeAndOTP, RequestValidate } from "../../common/otp.model"
import { TransactionList } from "../common/transactions-list-models"

export interface BusinessCardsDetailsModel {
  cardNum: string
  dateG: string
  dateH: string
  cardSeqNum: string
  crLimit: number
  stmtAmt: number
  availableBal: number
  availableCash: number
  playableAmt: number
  pmtDueDate: string
  unbilledAmt: number
  totalAmt: number
  cardStatus: string
  accountsItemList: AccountsItem[]
  authStatus: string
}

export interface AccountsItem {
  currency: string;
  limit: number;
  availableBalance: number;
  availableCash: number;
  cardAccountNumber: string;
  cardAccountSeqNumber: string;
  authStatus: string;
}

export interface BusinessCardsDetailsRequest {
  amountFrom?: number
  amountTo?: number
  authDateFrom?: Date
  authDateTo?: Date
  cardSeqNumber: string
  cardNumber?: string
  details: boolean
  page: number
  rows: number
  trxnCode?: string
  trxnType?: string
  category?: string
}

export interface BusinessCardsDetailsResponse {
  businessCardsDetails: BusinessCardsDetailsModel 
  transactionList: TransactionList
}

