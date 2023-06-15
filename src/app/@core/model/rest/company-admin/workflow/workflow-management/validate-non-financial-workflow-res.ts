import {WorkflowNonFinancialBatch} from "./validate-non-financial-workflow-req";

export interface ValidateNonFinancialWorkflowRes {
  batchList: BatchListsContainerWorkflowNonFinancialBatch;
}

export interface BatchListsContainerWorkflowNonFinancialBatch {
  toProcess: WorkflowNonFinancialBatch[],
  toAuthorize?: WorkflowNonFinancialBatch[],
  notAllowed: WorkflowNonFinancialBatch[],
}
