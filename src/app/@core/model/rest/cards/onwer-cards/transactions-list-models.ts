import { Account } from '../../common/account';
import { OwnerCardsListModel } from './list-res.model';

export interface TransactionsListRequestModel {
  page?: number | null;
  rows?: number | null;
  order?: string;
  orderType?: string;
  card: OwnerCardsListModel;
}

export interface OwnerCardTransactionsListRes {
    creditCardTransactions: OwnerCardsTransactionsListAndDetails
}

export interface OwnerCardsTransactionsListAndDetails{
    creditCardNumber: string;
    creditCardNumberDisplay?: any;
    creditLimit: number;
    creditCardStatementAmount: number;
    creditCardBalance: number;
    creditCardAVCash: number;
    account: Account;
    list: OwnerCardTransactionsList[] | undefined;
}

export interface OwnerCardTransactionsList {
    amount: number;
    date: string;
    hijraDate: string;
    description: string;
}
