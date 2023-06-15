import { GenerateChallengeAndOTP } from "../../common/otp.model";
import { PagedResultsPosClaimBatchDSO } from "../claims/response-details-claim";
import { ErrorServiceResponse } from "../../pos/pos-analytics-req/analytics-res";


export interface ResponseListClaimPosManagement {
  
  errorCode?: string,
  errorDescription?: string,
  errorResponse?: ErrorServiceResponse;
  generateChallengeAndOTP?: GenerateChallengeAndOTP;
  posClaimBatchList: PagedResultsPosClaimBatchDSO;
  }