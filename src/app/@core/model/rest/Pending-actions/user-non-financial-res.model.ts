import { BaseResponse } from "../common/base-response";

export interface UserNonFinancialResModel extends BaseResponse {
    workflowList: workflowList[];
}

export interface workflowList {
    paymentId: string;
    levels: boolean[];
}