import {BaseResponse} from "../../common/base-response";
import {Batch} from "../../common/batchResponse";

export interface beneficiaryWithinValidateRes extends BaseResponse {
    beneficiary: Batch;
}
