import { BaseResponse } from './../../common/base-response';

export interface ConfirmResponse extends BaseResponse {
    fileReference: string
    hasNextApprovalLevel: boolean
}


