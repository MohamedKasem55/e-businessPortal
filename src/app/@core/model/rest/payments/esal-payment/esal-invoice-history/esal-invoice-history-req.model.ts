export interface EsalInvoiceHistoryReq {
  invoiceNumber?: string;
  billerName?: string;
  payDateFrom?: string;
  payDateTo?: string;
  amountFrom?: number | null;
  amountTo?: number | null;
  page?: number;
  rows?: number;
}
