import { BaseResponse } from "../../common/base-response";
import { Batch } from "../../common/batchResponse";
import { GenerateChallengeAndOTP } from "../../common/otp.model";

export interface ValidateTokenOrderRes extends BaseResponse {
  batch:TokenBatch
  generateChallengeAndOTP: GenerateChallengeAndOTP;
}

export interface TokenBatch extends Batch{
  tokenNumber: number,
  totalAmount: number,
}

