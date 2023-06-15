import {BatchList} from "../../common/batchResponse";
import {GenerateChallengeAndOTP} from "../../common/otp.model";

export interface ValidateResModel {
  checkAndSeparateInitiatitionPermission: BatchList;
  generateChallengeAndOTP: GenerateChallengeAndOTP;
  totalFeeAuthorize: number;
  totalAmountProcess: number;
  totalAmountNotAllowed: number;
  totalAmountAuthorize: number;
  totalFeeNotAllowed: number;
  totalFeeProcess: number;
  transferLimit: number;
  urPayFeesDtls: number;
}

