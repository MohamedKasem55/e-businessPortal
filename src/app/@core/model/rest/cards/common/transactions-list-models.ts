import { TableHeaderType } from "arb-design-library";
import { TableHeaderModel } from "arb-design-library/model/table-header.model";

export interface TransactionList {
  items: TransactionItem[];
  size: number;
  total: number;
}

export interface TransactionItem {
  amount: number;
  currency: string;
  acquiredReferenceNumber: string;
  authorizationAmount: number;
  authorizationCurrency: string;
  authorizationId: string;
  authorizationSign: string;
  authorizationStatus: string;
  billingAmount: number;
  billingCurrency: string;
  channelId: string;
  date: Date;
  description: string;
  hijraDate: string;
  loadDate: string;
  merchantCity: string;
  merchantCountry: string;
  merchantId: string;
  merchantName: string;
  merchantType: string;
  postingDate: string;
  reasonCode: string;
  refNum: string;
  remarks: string;
  settlementAmount: number;
  settlementCurrency: string;
  status: string;
  statusDescription: string;
  stmtSeqNum: string;
  time: string;
  title: string;
  type: string;
  typeDescription: string;
}

export interface TransactionsListTableModel {
  description: string;
  amount: string;
  date: string;
}

export const lastTransctionsTabelHeader: TableHeaderModel[] = [
    {
      title: 'cards.last-transaction.description',
      fieldName: 'description',
      type: TableHeaderType.TEXT,
    },
    {
      title: 'cards.last-transaction.amount',
      fieldName: 'amount',
      type: TableHeaderType.AMOUNT_TEXT,
      controlOptions: {
        currency: 'currency',
      },
    },
    {
      title: 'cards.last-transaction.date',
      fieldName: 'date',
      type: TableHeaderType.TEXT,
    },
  ];
  
