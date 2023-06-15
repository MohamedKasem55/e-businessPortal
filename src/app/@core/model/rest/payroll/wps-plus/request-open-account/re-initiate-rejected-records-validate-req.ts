import {WPSPlusEmployeeBatchDTO} from "./re-initiate-rejected-records-init-res";

export interface ReInitiateRejectedRecordsValidateReq {
  batchName: string;
  listEmployees: WPSPlusEmployeeBatchDTO[]
}
