import {ETradeFunction} from "./validate-e-trade-workflow-req";

export interface ValidateETradeWorkflowRes {
  batchList: BatchListsContainerWorkflowETradeBatch;
}

export interface BatchListsContainerWorkflowETradeBatch {
  toProcess: WorkflowETradeBatch[],
  toAuthorize?: WorkflowETradeBatch[],
  notAllowed: WorkflowETradeBatch[],
}

export interface WorkflowETradeBatch {
  etradeFunction: ETradeFunction;
  levels: WorkflowETradeLevel[];
}

export interface WorkflowETradeLevel {
  workflowETradeLevelPk: number;
  amount: number;
  level: number;
}
