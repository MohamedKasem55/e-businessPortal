import { GenerateChallengeAndOTP } from "../../common/otp.model";
import {StandingOrderBatch} from "./standing-order-list-res";

export interface StandingOrderValidateRes {
  orderType: string,
  standingOrderPreview: {
    mandateNumber: string,
    dateFrom: string,
    dateTo: string,
    paymentNum: string,
    nextPaymentDate: string,
    registrationFee: number,
    orderFee: number,
    remitterFee: number,
    beneficiaryFee: number
  },
  standingOrderBatch:StandingOrderBatch
  generateChallengeAndOTP:GenerateChallengeAndOTP;
}

