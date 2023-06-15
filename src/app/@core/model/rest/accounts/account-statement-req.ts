export interface AccountStatementReq {
  accountNumber: string;
  amountFrom?: string | null,
  amountTo?: string | null,
  billType: string | null;
  dateFrom: string;
  dateTo: string;
  filterBy: string;
  govPay: string | null;
  govPayType: string | null;
  page: number | null;
  rows: number | null;
  statementsOrder: number;
  typeTransaction: string;
}
