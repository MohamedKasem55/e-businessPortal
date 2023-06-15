
import {BillCodes} from "./billPayment/search-bill-res";
import {Account} from "../common/account";

export interface BillsList {
  billPaymentDetailsPk: number;
  hashCode: number;
  billCode: string;
  billRef: string;
  amountPaid: number;
  nickname: number;
  payLine: string;
  paysave: number;
  advanced: boolean;
  partial: boolean;
  applyVat: boolean;
  maxlength: boolean;
  addDescriptionEn: boolean;
  addDescriptionAr: boolean;
  detailsDescriptionEn: boolean;
  detailsDescriptionAr: boolean;
  rejectionReason: boolean;
  dueDate: boolean;
  paymentType: number;
  requestStatus: string;
  vatAmount: string;
  amountWithoutVat: string;
}

export interface SearchBillList {
  lastRefreshDate: Date;
  billsList: BillsList[]
}

export interface ListBillRes {
  accountsWithSaudiRials: Account[];
  searchBillList: SearchBillList;
  billCodeList: BillCodes[];
}
