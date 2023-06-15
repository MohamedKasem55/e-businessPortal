import {BatchList} from "../../common/batchResponse";
import {GenerateChallengeAndOTP} from "../../common/otp.model";

export interface ValidateResModel {
  checkAndSeparateInitiatitionPermission: BatchList;
  dailyLimitReached: boolean;
  generateChallengeAndOTP: GenerateChallengeAndOTP;
  totalAmountAuth: number;
  totalAmountProcess: number;
  totalNotAllowedAmount: number;
}

