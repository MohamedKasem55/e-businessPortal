import { Account } from 'app/@core/model/rest/common/account';
import { BaseResponse } from "../../common/base-response";
import { Batch } from "../../common/batchResponse";

export interface BeneficiariesDetailsResModel extends BaseResponse {
    lastTransactionDetails: Batch;
}
export interface LastTransactionDetails {
    account: Account[];
    amount: string;
    date: string;
    detail: string;
}

