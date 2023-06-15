import {Injectable} from '@angular/core';
import {AbstractBaseService} from "../../base/abstract-base.service";
import {StandingOrderConstants} from "./standing-orders-service-urls";
import {Observable} from "rxjs";
import {
  StandingOrderEligibleAccountList
} from "../../../model/rest/transfer/standing-order/standing-order-eligible-account-list";
import {
  StandingOrderBeneficiaryListResponse
} from "../../../model/rest/transfer/standing-order/standing-order-beneficiary-list-response";
import {
  StandingOrderValidateRequest
} from "../../../model/rest/transfer/standing-order/standing-order-validate-request";
import {StandingOrderValidateRes} from "../../../model/rest/transfer/standing-order/standing-order-validate-res";
import {StandingOrderConfirmReq} from "../../../model/rest/transfer/standing-order/standing-order-confirm-req";
import {StandingOrderListRes} from "../../../model/rest/transfer/standing-order/standing-order-list-res";
import {BaseResponse} from "../../../model/rest/common/base-response";
import {
  StandingOrderDeleteEditValidateResponse,
  StandingOrderDeleteValidateRequest,
  StandingOrderValidationConfirmRequest
} from "../../../model/rest/transfer/standing-order/standing-order-delete-validate-request";
import {StandingOrderEditValidateReq} from "../../../model/rest/transfer/standing-order/standing-order-edit";

@Injectable()
export class StandingOrderService extends AbstractBaseService {

  constructor() {
    super();
  }

  getEligibleAccounts(): Observable<StandingOrderEligibleAccountList> {
    return this.get(StandingOrderConstants.STANDING_ORDERS_ACCOUNT_LIST)
  }

  validateStandingOrder(standingOrderValidateRequest: StandingOrderValidateRequest): Observable<StandingOrderValidateRes> {
    return this.post(StandingOrderConstants.STANDING_ORDERS_VALIDATE, standingOrderValidateRequest);
  }

  confirmStandingOrder(standingOrderConfirmRequest: StandingOrderConfirmReq): Observable<any> {
    return this.post(StandingOrderConstants.STANDING_ORDERS_CONFIRM, standingOrderConfirmRequest);
  }

  getBeneficiariesList(accountNumber?: string): Observable<StandingOrderBeneficiaryListResponse> {
    return this.get(StandingOrderConstants.STANDING_ORDERS_BEN_LIST + "/" + accountNumber)
  }

  getStandingOrderList(accountNumber?: string): Observable<StandingOrderListRes> {
    return this.post(StandingOrderConstants.STANDING_ORDERS_LIST + accountNumber, {}, {hideLoader: true})
  }

  validateStandingOrderDelete(selectedStandingOrder: StandingOrderDeleteValidateRequest): Observable<StandingOrderDeleteEditValidateResponse> {
    return this.post(StandingOrderConstants.STANDING_ORDERS_DELETE_VALIDATE, selectedStandingOrder)
  }

  confirmStandingOrderDelete(standingOrderDeleteValidateRequest: StandingOrderValidationConfirmRequest): Observable<BaseResponse> {
    return this.post(StandingOrderConstants.STANDING_ORDERS_DELETE_CONFIRM, standingOrderDeleteValidateRequest)
  }

  validateStandingOrderEdit(standingOrderEditValidateReq: StandingOrderEditValidateReq):
    Observable<StandingOrderDeleteEditValidateResponse> {
    return this.post(StandingOrderConstants.STANDING_ORDERS_EDIT_VALIDATE,
      standingOrderEditValidateReq)
  }

  confirmStandingOrderEdit(standingOrderEditValidateReq: StandingOrderValidationConfirmRequest):
    Observable<BaseResponse> {
    return this.post(StandingOrderConstants.STANDING_ORDERS_EDIT_CONFIRM,
      standingOrderEditValidateReq)
  }

}
