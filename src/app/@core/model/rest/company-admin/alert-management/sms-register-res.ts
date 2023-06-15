import { Account } from "../../common/account"
import { BaseResponse } from "../../common/base-response"
import { UserData } from "./sms-register-req"

export interface SmsRegistrationRes extends BaseResponse{
    accountSelected?: Account
    usersSelectedOk: UserDateWithStatus[]
    expiryDate: string
    registrationDate: string,
    totalFees: number
}

export interface UserDateWithStatus extends UserData {
  status:string
} 

  
