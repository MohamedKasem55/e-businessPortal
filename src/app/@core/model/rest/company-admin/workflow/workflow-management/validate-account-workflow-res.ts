import {WorkflowAccountBatch} from "./get-account-levels-res";

export interface ValidateAccountWorkflowRes {
  batchList: {
    toProcess: WorkflowAccountBatch[];
    toAuthorize?: WorkflowAccountBatch[];
    notAllowed: WorkflowAccountBatch[];
  }
}
