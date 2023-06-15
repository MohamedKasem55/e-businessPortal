import { GenerateChallengeAndOTP } from '../../../common/otp.model';
import { ErrorResponse } from '../../../common/base-response';
import {Batch} from "../../../common/batchResponse";

export interface EsalInvoiceHistoryRes {
  errorCode: string;
  errorDescription: string;
  errorResponse: ErrorResponse;
  generateChallengeAndOTP: GenerateChallengeAndOTP;
  sadadInvoicePagedResults: SadadInvoicePagedResults;
}

export interface SadadInvoicePagedResults {
  size: number;
  total: number;
  items: InvoiceItem[];
}

export interface InvoiceItem extends Batch {
  sadadInvoiceBatchPk: number;
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
  amount: number;
}
