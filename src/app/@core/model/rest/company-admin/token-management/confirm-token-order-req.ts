import { Batch } from "../../common/batchResponse";
import { RequestValidate } from "../../common/otp.model";

export interface ConfirmTokenOrderReq {
  batch:Batch,
  requestValidate?: RequestValidate
}