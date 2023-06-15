import {BatchList} from "../../common/batchResponse";
import {BaseResponse} from "../../common/base-response";

export interface ResponseValidateClaimPosManagement extends BaseResponse{

  requiredSFA?: boolean;
  batchList?: BatchList;
}

