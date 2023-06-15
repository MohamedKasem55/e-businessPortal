import { BaseResponse } from "../../common/base-response"
import { SmsAlertUser } from "./sms-alert-list-res"

export interface SmsAlertSoloPropertyRes extends BaseResponse {
  soleProperty: boolean
  user: SmsAlertUser
}