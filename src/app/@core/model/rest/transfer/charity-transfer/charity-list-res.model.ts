import { BaseResponse } from "../../common/base-response";
import { CharityTransferBatchList } from "./charity-transfer-batch-list";

export interface charityListResModel extends BaseResponse {
    size: string,
    total:string,
    charityTransferBatchList: CharityTransferBatchList[]
}

