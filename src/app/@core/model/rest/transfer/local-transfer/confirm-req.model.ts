import {BatchList} from "../../common/batchResponse";
import {RequestValidate} from "../../common/otp.model";

export interface ConfirmReqModel {
  batchList: BatchList,
  requestValidate?:RequestValidate
}

