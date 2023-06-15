import { RequestValidate } from '../../common/otp.model';
import { BatchItem } from '../user-approval/government-user-approval-res';

export interface BulkMoiPaymentTemplateDownloadReq {
  name: string;
}

export interface BulkMoiPaymentAlienControlReq {
  batch: AlienControlReq[];
}

export interface AlienControlReq {
  accountNumber: string;
  serviceType?: string;
  applicationType?: string;
  transactionType?: string;
  iqamaId: number | string;
  visaDuration?: number;
  amount: number;
  sponsorId?: number;
  jobCategory?: number;
  iqamaDuration?: string;
}

export interface BulkMoiPaymentValidationReq {
  batchList: BatchItem[];
}

export interface BulkMoiPaymentConfirmReq {
  batchList: BatchMoiItem[];
  requestValidate?: RequestValidate;
}

export interface BatchMoiItem {
  toProcess: BatchItem[];
  toAuthorize?: BatchItem[];
  notAllowed: BatchItem[];
}
