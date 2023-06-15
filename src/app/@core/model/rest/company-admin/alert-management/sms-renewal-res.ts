import { BaseResponse } from "../../common/base-response"

export interface SmsRenewalRes extends BaseResponse {
    expiryDate: string
    renewalDate: string
    totalFees: number
    usersSelectedOk: UsersSelectedOk[]
}

export interface UsersSelectedOk {
    fees: number
    userData: UserData
    user: any
    status: string
}

export interface UserData {
    mobileNumber: string
    feeAmount: number
    userId: string
    returnCode: string
    expirationDate: string
}