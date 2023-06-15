import {BatchListsContainer} from "./bill-payment-validate-res";
import {RequestValidate} from "../../common/otp.model";

export interface BillPayConfirmReq {
  batchListsContainer?: BatchListsContainer;
  emailChecked?: string;
  requestValidate?: RequestValidate;
}
