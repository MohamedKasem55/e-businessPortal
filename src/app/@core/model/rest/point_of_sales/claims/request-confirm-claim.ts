import {BatchList} from "../../common/batchResponse";
import {RequestValidate} from "../../common/otp.model";

export interface RequestConfirmClaimPosManagement {
  batchList?: BatchList | null;
  requestValidate?: RequestValidate;
}
