import { Batch } from "../../common/batchResponse"
import { GenerateChallengeAndOTP } from "../../common/otp.model"

export interface PosMaintananceValidateRes {
    generateChallengeAndOTP: GenerateChallengeAndOTP
    batchList: PosMaintananceBatchList
}

export interface PosMaintananceBatchList {
    toProcess: PosMaintananceBatch[]
    toAuthorize?: PosMaintananceBatch[]
    notAllowed: any[]
  }

  export interface PosMaintananceBatch extends Batch {
    city: string
    terminalNumber: string
    typeRequest: string
  }
