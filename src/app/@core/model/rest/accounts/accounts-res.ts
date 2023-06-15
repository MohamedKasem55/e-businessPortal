import { Account } from '../common/account';

export interface AccountsRes {
  currencyBalance: any;
  customerName: string;
  listAccount: Account[];
  size: number;
  page?: number | null;
  total: number;
  totalBalance: number;
  userUpdate?: string;
  dateUpdate?: Date;
  status?: string;
  accountList?: Account[];
}
