import { Account } from '../../common/account';
import { OwnerCardsListModel } from '../onwer-cards/list-res.model';

export interface OwnerCardPaymentReq {
  cardDTO: OwnerCardsListModel;
  accountDTO: Account;
  amount: string;
}
