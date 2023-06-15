import {Account} from "../common/account";

export interface SwiftInitRes {
  listAccount: Account[]
  dailyRole: boolean,
  monthlyRole: boolean,
  days: string[],
  months: string[],
}

