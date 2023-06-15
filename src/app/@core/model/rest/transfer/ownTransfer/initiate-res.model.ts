import {Account} from "../../common/account";

export interface InitiateResModel {
  accountList: Account[],
  accountListTo: Account[],
  transferLimit: number
}
