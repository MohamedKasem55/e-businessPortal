import { GenerateChallengeAndOTP } from "../../common/otp.model";
import { TransactionList } from "../common/transactions-list-models";

export interface AccountsItemList {
    currency: string;
    limit: number;
    availableBalance: number;
    availableCash: number;
    cardAccountNumber: string;
    cardAccountSeqNumber: string;
    authStatus: string;
}

export interface PrepaidCardDetailsModel {
    cardNum: string;
    dateG: string;
    dateH: string;
    cardSeqNum: string;
    crLimit: any;
    stmtAmt: number;
    availableBal: any;
    availableCash: any;
    playableAmt: number;
    pmtDueDate: string;
    unbilledAmt: number;
    totalAmt: number;
    cardStatus: string;
    authStatus: string;
    expiryDate: any;
    creationDate: any;
    accountsItemList: AccountsItemList[];
    cardLimitAmount: string;
}

export interface PrepaidCardsDetailsResponseModel {
    prepaidCardDetails: PrepaidCardDetailsModel;
    transactionsList: TransactionList;
    errorCode?: string;
    errorDescription?: string;
    errorResponse?: any;
    generateChallengeAndOTP?: GenerateChallengeAndOTP;
}