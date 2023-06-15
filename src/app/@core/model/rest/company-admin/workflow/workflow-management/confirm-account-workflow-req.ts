import {WorkflowAccountBatch} from "./get-account-levels-res";

export interface ConfirmAccountWorkflowReq {
  batchList: {
    toProcess: WorkflowAccountBatch[];
    toAuthorize?: WorkflowAccountBatch[];
    notAllowed: WorkflowAccountBatch[];
  }
}
