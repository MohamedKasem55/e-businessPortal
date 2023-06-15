import {Batch} from "../../../common/batchResponse";

export interface ValidateNonFinancialWorkflowReq {
  workflowList: WorkflowNonFinancialBatch[];
}

export interface WorkflowNonFinancialBatch extends Batch{
  paymentId: string,
  privilege: string,
  levels: boolean[],
}
