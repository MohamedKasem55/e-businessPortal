import { Injectable } from '@angular/core';
import { AlertsAccountResModel } from 'app/@core/model/rest/manage-alerts/alerts-account-res.model';
import { AlertsAddPostReqModel } from 'app/@core/model/rest/manage-alerts/alerts-add-post-req.model';
import { AlertsAddPostResModel } from 'app/@core/model/rest/manage-alerts/alerts-add-post-res.model';
import { AlertsAddResModel } from 'app/@core/model/rest/manage-alerts/alerts-add-res.model';
import { AlertsDeleteReqModel } from 'app/@core/model/rest/manage-alerts/alerts-delete-req.model';
import { AlertsDeleteResModel } from 'app/@core/model/rest/manage-alerts/alerts-delete-res.model';
import { AlertsPutReqModel } from 'app/@core/model/rest/manage-alerts/alerts-put-req.model';
import { AlertsPutResModel } from 'app/@core/model/rest/manage-alerts/alerts-put-res.model';
import { AlertsReqModel } from 'app/@core/model/rest/manage-alerts/alerts-req.model';
import { AlertsResModel } from 'app/@core/model/rest/manage-alerts/alerts-res.model';
import { LanguagesModelRes } from 'app/@core/model/rest/manage-alerts/languages-res.model';
import { ProxyManageResModel } from 'app/@core/model/rest/transfer/alias-management/proxy-manage-res.model';
import { Observable } from "rxjs";
import { AbstractBaseService } from '../base/abstract-base.service';
import { Constants as BaseConstants } from '../base/base-urls';
import { Constants } from './manage-alerts-service-urls';


@Injectable()
export class ManageAlertsService extends AbstractBaseService {
  constructor() {
    super();
  }

  getAlertsAdd(): Observable<AlertsAddResModel> {
    return this.get(Constants.ALERTS_ADD);
  }

  postAlerts(alertsReq: AlertsReqModel): Observable<AlertsResModel> {
    return this.post(Constants.ALERTS, alertsReq);
  }

  postLanguages(req: string[]): Observable<LanguagesModelRes[]> {
    const data = { names: req }
    return this.post(BaseConstants.STATIC_LIST, data);
  }

  postAlertsAdd(alertsAddReq: AlertsAddPostReqModel): Observable<AlertsAddPostResModel> {
    return this.post(Constants.ALERTS_ADD, alertsAddReq);
  }

  deleteAlerts(deleteAlertsReq: AlertsDeleteReqModel): Observable<AlertsDeleteResModel> {
    return this.delete(Constants.ALERTS_DELETE, deleteAlertsReq);
  }

  putModifyAlerts(putAlertsReq: AlertsPutReqModel): Observable<AlertsPutResModel> {
    return this.put(Constants.ALERTS_MODIFY, putAlertsReq);
  }

  getModifyAccountAlerts(accountNumber: string): Observable<AlertsAccountResModel> {
    return this.get(Constants.ALERTS_MODIFY_ACCOUNT.replace("{{accountNumber}}", accountNumber));
  }
}
