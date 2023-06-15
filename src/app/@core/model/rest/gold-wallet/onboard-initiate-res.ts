import { BaseResponse } from "../common/base-response";

export interface OnBoardInitiateRes extends BaseResponse{
  hasExistingWallet: boolean;
  eligible: boolean;
}

