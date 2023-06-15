import {RequestValidate} from "../../common/otp.model";
import {StandingOrder, StandingOrderBatch} from "./standing-order-list-res";
import {BaseResponse} from "../../common/base-response";

export interface StandingOrderDeleteValidateRequest {
  standingOrderDetail: StandingOrder

}

export interface StandingOrderDeleteEditValidateResponse extends BaseResponse{
  standingOrderBatch: StandingOrderBatch
}

export interface StandingOrderValidationConfirmRequest {

  requestValidate?: RequestValidate
  standingOrderBatch?: StandingOrder
}
