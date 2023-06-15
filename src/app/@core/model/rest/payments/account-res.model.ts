import { AccountModel } from "arb-design-library/model/account.model";
import { BaseResponse } from "../common/base-response";
import { CurrencyBalance } from "../common/currency-balance.model";
import { PaginationModel } from "../common/pagination.model";

export interface AccountsResModel extends PaginationModel, BaseResponse {
    listAccount: AccountModel[],
    customerName: string;
    totalBalance: number;
    currencyBalance: CurrencyBalance;
}