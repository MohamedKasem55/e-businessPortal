import { Account } from "../common/account";

export interface WalletOnBoardingConfirmRes {
    linkedAccountDTO: Account;
    walletId: string;
}
