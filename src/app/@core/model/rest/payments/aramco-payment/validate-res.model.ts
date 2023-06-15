import {Batch, ToAuthorizeAmounts, ToProcessAmounts} from "../../common/batchResponse";
import {GenerateChallengeAndOTP} from "../../common/otp.model";


export interface ValidateResModel {
  aramcoBatchList: AramcoBatchList
  generateChallengeAndOTP: GenerateChallengeAndOTP;
}

export interface AramcoBatchList {
  toProcess: AramcoBatchToAuthorize[]
  toAuthorize?: AramcoBatchToAuthorize[]
  notAllowed: any[]
  toProcessAmounts: ToProcessAmounts
  toAuthorizeAmounts: ToAuthorizeAmounts
}

export interface AramcoBatchToAuthorize extends Batch {
  passNumber: string
}

