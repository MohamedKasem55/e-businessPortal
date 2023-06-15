import {BatchResponse} from "../../common/batchResponse";
import {RequestValidate} from "../../common/otp.model";

export interface ConfirmReqModel extends BatchResponse {
  totalAmountProcess: number
  listbatchToDelete: any[]
  emailChecked: string
  requestValidate?: RequestValidate
  typeBatchList: "batchListSelected"
}
