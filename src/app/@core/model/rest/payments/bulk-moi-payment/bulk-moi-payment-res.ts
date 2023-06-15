import { BatchItem } from '../user-approval/government-user-approval-res';
import { BatchMoiItem } from './bulk-moi-payment-req';

export interface BulkMoiPaymentAlienControlRes {
  requiredSFA?: boolean;
  batch: BatchItem[];
}

export interface BulkMoiPaymentValidationRes {
  requiredSFA?: boolean;
  batchList: BatchMoiItem;
}

export interface BulkMoiPaymentConfirmRes {
  hasNextApprovalLevel: boolean;
  fileReference: string;
}

export interface BulkMoiPaymentTableData {
  applicationsType: string;
  account: string;
  iqamaId: number;
  iqamaDuration: string;
  sponsorId: string;
  jobCategory: string;
  amount: number;
}
