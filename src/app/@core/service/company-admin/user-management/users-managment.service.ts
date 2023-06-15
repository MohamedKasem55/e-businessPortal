import {Injectable} from "@angular/core";
import {UsersListReq} from "app/@core/model/rest/company-admin/user-management/users-list-req";
import {UsersListRes} from "app/@core/model/rest/company-admin/user-management/users-list-res";
import {Observable} from "rxjs";
import {AbstractBaseService} from "../../base/abstract-base.service";
import {UserManagementConstants} from "./users-management-urls";
import {
  RequestUserManagementConfirm,
  RequestUserManagementValidate
} from "../../../model/rest/company-admin/user-details/user-operation-request";
import {ResUserManagementValidate} from "../../../model/rest/company-admin/user-details/update-user-response";
import {BlockRequest} from "../../../model/rest/company-admin/user-details/block-request";
import {BaseResponse} from "../../../model/rest/common/base-response";
import {
  EtradeCompanyDetails,
  RegisterUserInit
} from "../../../model/rest/company-admin/user-details/register-user-init";
import {IpsPaymentOrderConfigRes} from "../../../model/rest/company-admin/user-details/ips-payment-order-config-res";

@Injectable()
export class UserManagementService extends AbstractBaseService {

  getUsersList(usersListReq: UsersListReq): Observable<UsersListRes> {
    return this.post(UserManagementConstants.USER_MANAGEMENT, usersListReq, {hideLoader: true});
  }

  loadUserDetailsById(userId: string): Observable<any> {
    return this.get(UserManagementConstants.USER_DETAILS + `/${userId}`);
  }

  validateUserOperation(userDetails: RequestUserManagementValidate): Observable<ResUserManagementValidate> {
    return this.put(UserManagementConstants.VALIDATE_OPERATION_USER, userDetails);
  }

  confirmUserOperation(userDetails: RequestUserManagementConfirm): Observable<ResUserManagementValidate> {
    return this.put(UserManagementConstants.CONFIRM_OPERATION_USER, userDetails);
  }

  blockUserOperation(blockRequest: BlockRequest): Observable<BaseResponse> {
    return this.put(UserManagementConstants.BLOCK_USER, blockRequest);
  }

  unBlockUserOperation(blockRequest: BlockRequest): Observable<BaseResponse> {
    return this.put(UserManagementConstants.UNBLOCK_USER, blockRequest);
  }

  resetPasswordUserOperation(blockRequest: BlockRequest): Observable<BaseResponse> {
    return this.put(UserManagementConstants.RESET_PASSWORD_USER, blockRequest);
  }

  registerInIt(): Observable<RegisterUserInit> {
    return this.get(UserManagementConstants.REGISTER_INIT);
  }

  getCompanyDetails(): Observable<EtradeCompanyDetails> {
    return this.get(UserManagementConstants.E_TRADE_COMPANY_DETAILS);
  }
  getCompanyIPSPaymentOrderConfig(): Observable<IpsPaymentOrderConfigRes> {
    return this.get(UserManagementConstants.IPS_PAYMENT_ORDER_CONFIG);
  }
}
