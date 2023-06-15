import {Employee} from "./validate-open-account-req";
import {RequestValidate} from "../../../common/otp.model";

export interface ConfirmOpenAccountReq {
  batchList: BatchWPSPlusListsContainerDTO;
  requestValidate?: RequestValidate;
  batchName:string;
}

export interface BatchWPSPlusListsContainerDTO {
  toProcess: Employee[]
  toAuthorize?: Employee[]
  notAllowed: Employee[]
}
