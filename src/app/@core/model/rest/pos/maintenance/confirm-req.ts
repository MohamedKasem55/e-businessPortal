import { RequestValidate } from "../../common/otp.model"
import { PosMaintananceBatchList } from "./validate-res"

export interface PosMaitananceConfirmReq {
    requestValidate?: RequestValidate
    batchList: PosMaintananceBatchList
  }