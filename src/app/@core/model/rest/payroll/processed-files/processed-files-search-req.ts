import {Pagination} from "./pagination";

export class ProcessedFilesSearchReq extends Pagination {
  batchName?: string;
  amountFrom?: number;
  amountTo?: number;
  paymentDatefrom?: Date;
  paymentDateto?: Date;
  initiationDateFrom?: Date;
  initiationDateTo?: Date;
  customerReference?: string;
  systemFileName?: string;
  fileType?: string;
  debitAccount?: string;
  paymentPurpose?: string;

}
