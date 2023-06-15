import {GenerateChallengeAndOTP} from "../../common/otp.model";
import {BatchList} from "../../common/batchResponse";

export interface ValidateResModel {
  checkAndSeparateInitiatitionPermission: BatchList;
  dailyLimitReached: boolean;
  generateChallengeAndOTP: GenerateChallengeAndOTP;
  totalAmountAuth: number;
  totalAmountProcess: number;
  totalNotAllowedAmount: number;
}

