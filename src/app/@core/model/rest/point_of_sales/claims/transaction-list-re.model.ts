export interface TransactionListsReqModel {
  page?: number | null;
  rows?: number | null;
  merchantNum?: string | null;
  terminalID?: string | null;
  fromDate?: Date | null;
  toDate?: Date | null;

}
