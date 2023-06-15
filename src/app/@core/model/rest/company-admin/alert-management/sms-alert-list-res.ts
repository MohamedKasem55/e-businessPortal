import { Account } from "../../common/account"
import { BaseResponse } from "../../common/base-response"

export interface SmsAlertListRes extends BaseResponse {
  feeAmountEachReg: number 
  maxSmsEachReg: number
  listAccountSAR: Account[]
  reportList: SmsAlertUser[]
}

export interface SmsAlertUser {
  userId: string
  userPk: number
  userName: string
  mobileNumber: string
  registrationDate: string
  renewalDate: string
  expiryDate: string
  maxSmsCount: number
  smsReached: number
  alertPrivileges:string
  userFee: number
  email: string
  alertPrivilegesFlag: boolean
}
