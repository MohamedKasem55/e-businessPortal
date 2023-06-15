import { RequestValidate } from "../../common/otp.model";
import { StandingOrderValidateRes } from "./standing-order-validate-res";

export interface StandingOrderConfirmReq extends StandingOrderValidateRes {
  requestValidate?: RequestValidate | null;
}
