import { RequestValidate } from "../../common/otp.model";
import { BatchListSadad } from "./batch-sadad";

export interface ConfirmRequest {
    batchList: BatchListSadad;
    requestValidate?: RequestValidate;
}


