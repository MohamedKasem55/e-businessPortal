import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {AbstractBaseService} from "../../base/abstract-base.service";
import {Constants} from "./urpay-transfer-service-urls";
import {ValidateReqModel} from "../../../model/rest/transfer/urpayTransfer/validate-req.model";
import {ConfirmReqModel} from "../../../model/rest/transfer/urpayTransfer/confirm-req.model";
import {CustomerDetailsReqModel} from "../../../model/rest/transfer/urpayTransfer/customer-details-req.model";
import {CustomerDetailsResModel} from "../../../model/rest/transfer/urpayTransfer/customer-details-res.model";
import {ValidateResModel} from "../../../model/rest/transfer/urpayTransfer/validate-res.model";

@Injectable()
export class UrPayTransferService extends AbstractBaseService {


  urpayCustomerDetails(customerDetails: CustomerDetailsReqModel): Observable<CustomerDetailsResModel> {
    return this.post(Constants.URPAY_TRANSFER,
      customerDetails);
  }

  urpayValidate(validateUrpayTransferRequest: ValidateReqModel): Observable<ValidateResModel> {
    return this.post(Constants.URPAY_VALIDATE,
      validateUrpayTransferRequest);
  }

  urpayConfirm(confirmUrpayTransferRequest: ConfirmReqModel): Observable<any> {
    return this.post(Constants.URPAY_CONFIRM,
      confirmUrpayTransferRequest);
  }
}
