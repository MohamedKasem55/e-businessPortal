import {Injectable} from "@angular/core";
import { SmsAlertListRes } from "app/@core/model/rest/company-admin/alert-management/sms-alert-list-res";
import { SmsDeactivateReq } from "app/@core/model/rest/company-admin/alert-management/sms-deactivate-req";
import { SmsRegistrationReq } from "app/@core/model/rest/company-admin/alert-management/sms-register-req";
import { SmsRegistrationRes } from "app/@core/model/rest/company-admin/alert-management/sms-register-res";
import { SmsRenewalReq } from "app/@core/model/rest/company-admin/alert-management/sms-renewal-req";
import { SmsRenewalRes } from "app/@core/model/rest/company-admin/alert-management/sms-renewal-res";
import { SmsAlertSoloPropertyRes } from "app/@core/model/rest/company-admin/alert-management/sms-solo-property-res";
import {Observable} from "rxjs";
import {AbstractBaseService} from "../../base/abstract-base.service";
import {SmsAlertConstants} from "./sms-alert-urls";

@Injectable()
export class SmsAlertService extends AbstractBaseService {
  getSmsSubscribedUserList(): Observable<SmsAlertListRes> {
    return this.get(SmsAlertConstants.SMS_ALERT_SUBSCRIBED_LIST, {hideLoader: true} );
  }

  getSmsUnsubscribedUserList(): Observable<SmsAlertListRes> {
    return this.get(SmsAlertConstants.SMS_ALERT_UNSUBSCRIBED_LIST, {hideLoader: true});
  }

  getSoloProperty(): Observable<SmsAlertSoloPropertyRes> {
    return this.get(SmsAlertConstants.SMS_ALERT_SOLO_PROPERTY_VALIDATE, {hideLoader: true});
  }

  getSmsExpiredList(): Observable<SmsAlertListRes> {
    return this.get(SmsAlertConstants.SMS_ALERT_EXPIRED_LIST, {hideLoader: true});
  }

  getSmsReportList(): Observable<SmsAlertListRes> {
    return this.get(SmsAlertConstants.SMS_ALERT_REPORT_LIST, {hideLoader: true});
  }

  addSMSRenewalRequest(renewalReq: SmsRenewalReq): Observable<SmsRenewalRes> {
    return this.post(SmsAlertConstants.SMS_ALERT_RENEWAL, renewalReq);
  }

  addSMSDeactivateRequest(renewalReq: SmsDeactivateReq): Observable<any> {
    return this.post(SmsAlertConstants.SMS_ALERT_DEACTIVATE, renewalReq);
  }

  addSMSRegisterRequest(renewalReq: SmsRegistrationReq): Observable<SmsRegistrationRes> {
    return this.post(SmsAlertConstants.SMS_ALERT_REGISTER, renewalReq);
  }
}
