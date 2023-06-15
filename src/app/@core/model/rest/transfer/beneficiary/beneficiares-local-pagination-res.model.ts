import { beneficiaryPaginationRes } from "./beneficiaries-pagination-res-model";
import {BaseResponse} from "../../common/base-response";

export interface beneficiaryLocalPaginationRes extends BaseResponse {
    localBatchList: beneficiaryPaginationRes;
}
