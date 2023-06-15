import { BatchItem } from "./esal-payment-item-res.model";

export interface EsalPaymentValidateReq {
  batchList: BatchItem[];
  pending: boolean;
}