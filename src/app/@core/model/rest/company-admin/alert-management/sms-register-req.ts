import { Account } from "../../common/account"

export interface SmsRegistrationReq {
    accountSelected?: Account
    usersListData: UserData[]
  }

  
export interface UserData {
    fees: number,
    user: User
}

export interface User {
  userPk: number,
  userId: string,
  userName: string,
  mobile: string,
  email: string
}