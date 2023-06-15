import {BatchList} from "../../common/batchResponse";
import {GenerateChallengeAndOTP} from "../../common/otp.model";

export interface ValidateResModel {
  inqRates: any;
  fromCurrency: any;
  toCurrency: any;
  currencyDealt: any;
  totalAmountAuthorize: any;
  totalAmountProcess: any;
  totalAmountNotAllowed: any;
  checkAndSeparateInitiationPermission: BatchList;
  generateChallengeAndOTP:GenerateChallengeAndOTP;
}
