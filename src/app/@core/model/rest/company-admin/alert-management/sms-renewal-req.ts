import { Account } from "../../common/account"
import { SmsAlertUser } from "./sms-alert-list-res"

export interface SmsRenewalReq {
    acc?: Account
    listReports: SmsAlertUser[]
  }