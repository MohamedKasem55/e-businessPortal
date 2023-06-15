import { RequestValidate } from "../../common/otp.model";
import {AramcoBatchList} from "./validate-res.model";

export interface ConfirmReqModel {
  aramcoBatchList: AramcoBatchList,
  requestValidate?: RequestValidate
}

