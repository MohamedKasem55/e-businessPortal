import { BaseResponse } from "../../common/base-response";
import { BatchList } from "../../common/batchResponse";
import { GenerateChallengeAndOTP } from "../../common/otp.model";

export interface EsalPaymentValidateRes extends BaseResponse {
  errors: string[];
  batchList: BatchList;
  generateChallengeAndOTP: GenerateChallengeAndOTP;
}

