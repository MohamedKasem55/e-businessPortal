import { RequestValidate } from 'app/@core/model/rest/common/otp.model';
import { PrepaidCardsRequestNewDSO } from "./request-new-validate-req.model"

export interface PrepaidRequestNewConfirmReqModel {
  prepaidCardsRequestNewDSO: PrepaidCardsRequestNewDSO
  requestValidate: RequestValidate
}
