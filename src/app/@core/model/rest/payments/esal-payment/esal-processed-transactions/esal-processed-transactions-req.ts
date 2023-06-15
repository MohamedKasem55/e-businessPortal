export interface EsalProcessedTransactionsReq {
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
  invoiceNumber?: string;
  supplierId?: string;
  supplierName?: string;
  accountNumber?: string;
  buyerName?: string;
}
