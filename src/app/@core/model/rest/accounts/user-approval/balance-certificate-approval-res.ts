import {Batch} from "../../common/batchResponse";

export interface BalanceCertificateApprovalRes {
  batchList: {
    items: BatchItem[]
    size: number;
    total: number;
  }
}


export interface BatchItem extends Batch{
  company: string;
  city: string;
  postalCode: string;
  requestDate: Date;
  processDate: Date;
}


