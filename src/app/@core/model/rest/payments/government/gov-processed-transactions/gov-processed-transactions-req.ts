export interface GovProcessedTransactionsReq {
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
  serviceType?: string;
  transactionType?: string;
  applicationType?: string;
  accountNumber?: string;
  idNumber?: string;
}
