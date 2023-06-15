import {BaseResponse} from '../../common/base-response';
import {HostItem, SecurityItem} from '../user-approval/aramco-payment-user-approval-res';

export interface EsalPaymentItemRes extends BaseResponse {
  listBatch: {
    items: BatchItem[]
    size: number;
    total: number;
  };
}

export interface BatchItem {
  batchPk: number;
  type: string;
  status: string;
  accountNumber: string;
  accountAlias: string;
  rejectedReason?: any;
  initiationDate: Date;
  hostRequest: HostItem;
  nextStatus: string;
  securityLevelsDTOList: SecurityItem[];
  futureSecurityLevelsDTOList: SecurityItem[];
  beStatus: string;
  sadadInvoiceBatchPk: string;
  invoiceId: string;
  invoiceCode: string;
  billCategory: string;
  billerId: string;
  billerName: string;
  buyerName: string;
  amountDue: string;
  amountPayment: string;
  currency: string;
  dateDue: string;
  billType: string;
  amountRangeFrom: string;
  amountRangeTo: string;
  additionalDetails: string;
  additionalDetailsAr: string;
  permission: string;
  returnCode: string;
  amount: string;
  pdfSecurityLevelsDTOList: SecurityItem[];
  futureStatus: string;
  min?: number | null,
  max?: number| null,
}

export interface EsalProcessedTransactionsRes {
  processedTransactionList: {
    items: BatchItem[]
    size: number;
    total: number;
  }
}
