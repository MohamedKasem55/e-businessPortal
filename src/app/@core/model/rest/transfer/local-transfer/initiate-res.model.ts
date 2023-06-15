import {Account} from "../../common/account";
import {KeyValueModel} from "../../common/key-value.model";

export interface InitiateResModel {
  listAccount: Account[],
  transferLimit: number,
  privilegePaymentInitiate: boolean,
  currencyList: KeyValueModel[]
}
