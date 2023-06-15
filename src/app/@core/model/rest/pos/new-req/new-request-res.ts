import { GenerateChallengeAndOTP, RequestValidate } from "../../common/otp.model";
import {Batch} from "../../common/batchResponse";

export interface POSNewRequestValidateRes {
  generateChallengeAndOTP: GenerateChallengeAndOTP
  batch: Batch
}

export interface POSNewRequestConfirmReq {
  requestValidate?: RequestValidate
  batch: Batch
}


export interface POSNewRequestConfirmRes {

}
