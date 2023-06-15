export interface ProcessedTransactionsReq {
    amountFrom?: number;
    amountTo?: number;
    approvedBy?: any;
    beneficiaryBank?: any;
    country?: string;
    currency?: any;
    debitAccount?: any;
    initiatedBy?: any;
    lastApprovalDateFrom?: any;
    lastApprovalDateTo?: any;
    page: number;
    paymentType?: any;
    rows: number;
    status?: any;
}