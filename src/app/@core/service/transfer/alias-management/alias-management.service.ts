import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccountsResModel } from 'app/@core/model/rest/payments/account-res.model';
import { IpstcStatusReqModel } from 'app/@core/model/rest/transfer/alias-management/ipstcstatus-req.model';
import { ProxyConfirmReqModel } from 'app/@core/model/rest/transfer/alias-management/proxy-confirm-req.model';
import { ProxyListResModel } from 'app/@core/model/rest/transfer/alias-management/proxy-list-res.model';
import { ProxyManageResModel } from 'app/@core/model/rest/transfer/alias-management/proxy-manage-res.model';
import { ProxyValidateReqModel } from 'app/@core/model/rest/transfer/alias-management/proxy-validate-req.model';
import { Observable } from "rxjs";
import { AbstractBaseService } from "../../base/abstract-base.service";
import { Constants } from './alias-management-service-urls';

@Injectable()
export class AliasManagementService extends AbstractBaseService {
  constructor() {
    super();
  }

  getAccounts(): Observable<AccountsResModel> {
    return this.get(Constants.ACCOUNTS, {hideLoader: true});
  }

  getProxyList(iban:string): Observable<ProxyListResModel> {
    return this.get(Constants.PROXY_LIST, {requestParams:new HttpParams().append('iban', iban)});
  }

  validate(validateReq: ProxyValidateReqModel): Observable<ProxyManageResModel> {
    return this.post(Constants.PROXY_VALIDATE, validateReq);
  }

  confirm(confirmReq: ProxyConfirmReqModel): Observable<ProxyManageResModel> {
    return this.post(Constants.PROXY_CONFIRM, confirmReq);
  }

  updateIPSTCStatus(ipstcstatus: IpstcStatusReqModel): Observable<any> {
    return this.put(Constants.UPDATE_IPSTC_STATUS, ipstcstatus);
  }
}
