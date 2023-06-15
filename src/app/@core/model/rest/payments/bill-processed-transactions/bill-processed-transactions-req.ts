export interface BillProcessedTransactionsReq {
  page: number;
  rows: number;
  amountFrom?: number;
  amountTo?: number;
  initiatedDateFrom?: Date;
  initiatedDateTo?: Date;
  executedDateFrom?: Date;
  executedDateTo?: Date;
  initiatedBy?: string;
  approvedBy?: string;
  status?: string;
  biller?: string;
  billReference?: string;
  accountNumber?: string;
  billNickname?: string;
}
