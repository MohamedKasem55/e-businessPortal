import {BatchResponse} from "../../common/batchResponse";
import {RequestValidate} from "../../common/otp.model";


export interface ConfirmReqModel extends BatchResponse {
  emailChecked: string,
  typeBatchList: "batchListSelectedLocal"
  requestValidate?: RequestValidate
  listbatchToDelete: [],
  totalAmountProcess: number,
}
