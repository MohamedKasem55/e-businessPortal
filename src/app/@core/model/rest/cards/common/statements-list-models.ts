import { TableHeaderType } from 'arb-design-library';
import { TableHeaderModel } from 'arb-design-library/model/table-header.model';

export interface CardStatementsRequest {
  order?: string;
  orderType?: string;
  page?: number;
  rows?: number;
  stmtDate?: string;
  cardSeqNumber: string;
}

export interface TransactionsListTableModel {
  description: string;
  amount: string;
  date: string;
}


export const statementsHeaders: TableHeaderModel[] = [
  {
    title: 'cards-statement.posting-date',
    fieldName: 'description',
    type: TableHeaderType.TEXT,
  },
  {
    title: 'cards-statement.posting-amount',
    fieldName: 'amount',
    type: TableHeaderType.AMOUNT_TEXT,
    controlOptions: {
      currency: 'currency',
    },
  },
  {
    title: 'cards-statement.merchant-description',
    fieldName: 'date',
    type: TableHeaderType.TEXT,
  },
];
