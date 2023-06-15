import {Batch} from "../../../common/batchResponse";

export interface GetAccountLevelRes {
  workflowTypePaymentList: WorkflowAccountBatch[];
}

export interface WorkflowAccountBatch extends Batch{
  paymentId: string;
  privilege: string;
  details: WorkflowAccountDetail[];
}

export interface WorkflowAccountDetail {
  workflowAccountDetailPk: number;
  amountMin: number;
  amountMax: number;
  levels: boolean[];
}
