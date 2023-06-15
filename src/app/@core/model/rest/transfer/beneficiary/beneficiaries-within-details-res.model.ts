import {BaseResponse} from "../../common/base-response";

export interface beneficiaryWithinDetailsRes extends BaseResponse {
    authStatus: 'NOT_ALLOWED' | 'PROCESS' | 'PENDING';
}
