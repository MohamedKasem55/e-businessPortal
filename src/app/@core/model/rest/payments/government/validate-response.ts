import { GenerateChallengeAndOTP } from "../../common/otp.model";
import { BatchListSadad, BatchSadad } from "./batch-sadad";

export interface ValidateResponse {
  generateChallengeAndOTP: GenerateChallengeAndOTP
  batchList: BatchListSadad;
}

export interface GovProcessedTransactionsRes {
  requestStatusEgovSPList: {
    items: BatchSadad[]
    size: number;
    total: number;
  }
}

