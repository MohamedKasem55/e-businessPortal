import {Batch} from "../../common/batchResponse";

export interface WPSPayrollBatchDSO extends Batch {
  batchName: string;
  paymentDate: Date;
}
