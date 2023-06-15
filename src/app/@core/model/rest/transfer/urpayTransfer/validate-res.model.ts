import {AmountModel} from "../../common/amount.model";
import {BatchList} from "../../common/batchResponse";
import {GenerateChallengeAndOTP} from "../../common/otp.model";

export interface ValidateResModel {
  checkAndSeparateInitiatitionPermission: BatchList,
  totalAmountProcess: number,
  transferLimit: number,
  urPayFeesDtls: UrPayFeesDtls,
  generateChallengeAndOTP: GenerateChallengeAndOTP
  totalFeeAuthorize: string,
  totalFeeNotAllowed: string,
  totalFeeProcess: string
}


export interface UrPayFeesDtls {
  catogory: string;
  feeAmount: AmountModel;
  mode: string;
  percentage: number;
  feeType: string;
  vatAmount: AmountModel;
  visible: boolean;
}

