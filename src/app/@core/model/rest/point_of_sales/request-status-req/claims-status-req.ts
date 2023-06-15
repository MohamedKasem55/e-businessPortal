import { GenerateChallengeAndOTP } from "../../common/otp.model"

export interface RequestListClaimPosManagement {
   
  amountFrom?: number;
  amountTo?: number;
  dateFrom?: string;
  dateTo?: string;
  order?: string;
  orderType?: string;
  page?: number;
  rows?: number;
  terminalNumber?: string;
  ticketNumber?: string;
  }