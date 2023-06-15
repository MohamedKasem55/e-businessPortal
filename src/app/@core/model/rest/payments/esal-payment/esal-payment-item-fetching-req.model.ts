export interface FetchEsalBatchReq {
  page: number;
  rows: number;
  sadadInvoiceId?: string ;
  billerId?: string;
  payerID?: string;
  supplierName?: string;
  dueDateFrom?: string;
  dueDateTo?:  string;
  amountFrom?: string;
  amountTo?: string;
  accountNumber?: string;
}