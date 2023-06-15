import { Injectable } from '@angular/core';
import { InitRegistrationRes, RegisterNewQOYODReq, RegisterNewZIDReq } from 'app/@core/model/rest/business-hub/business-hub-req.model';
import { Observable, of } from 'rxjs';
import { AbstractBaseService, ContextPath, RequestOption } from '../base/abstract-base.service';

@Injectable()
export class BusinessHubService extends AbstractBaseService {

  private ZID_GET_CONFIG_URL = 'hub/eBusinessHubStores/getConfig/ZID';
  private ZID_HAS_ACCESS_URL = 'hub/eBusinessHubStores/hasAccess/ZID';
  private QOYOD_GET_CONFIG_URL = 'hub/eBusinessHubStores/getConfig/QOYOD';
  private QOYOD_HAS_ACCESS_URL = 'hub/eBusinessHubStores/hasAccess/QOYOD';
  private OWNER_DETAILS = 'hub/eBusinessHubStores/getOwnerDetails';
  private INIT_REGISTRATION_ZID = 'hub/eBusinessHubStores/zidInitRegistration';
  private REGISTER_NEW_ZID = 'hub/eBusinessHubStores/zidRegisterNew';
  private INIT_REGISTRATION_QOYOD = 'hub/eBusinessHubStores/qoyodInitRegistration';
  private REGISTER_NEW_QOYOD = 'hub/eBusinessHubStores/qoyodRegisterNew';

  constructor() {
    super();
  }

  getConfig(feature: string) {
    switch (feature) {
      case 'zid':
        return this.get(this.ZID_GET_CONFIG_URL);
      case 'qoyod':
        return this.get(this.QOYOD_GET_CONFIG_URL);
      default:
        return of();
    }
  }

  hasAccess(feature: string) {
    switch (feature) {
      case 'zid':
        return this.get(this.ZID_HAS_ACCESS_URL);
      case 'qoyod':
        return this.get(this.QOYOD_HAS_ACCESS_URL);
      default:
        return of();
    }
  }

  getOwnerDetails() {
    return this.get(this.OWNER_DETAILS);
  }

  getDocument(fileName: string) {
    const options: RequestOption = { contextPath: ContextPath.DOCUMENT_CONTEXT }
    this.getFile(fileName, fileName, true, options)
  }

  initRegistration(feature: string): Observable<InitRegistrationRes> {
    switch (feature) {
      case 'zid':
        return this.post(this.INIT_REGISTRATION_ZID, {});
      case 'qoyod':
        return this.post(this.INIT_REGISTRATION_QOYOD, {});
      default:
        return of();
    }
  }
  registerNew(feature: string, subsData: RegisterNewZIDReq | RegisterNewQOYODReq): Observable<any> {
    switch (feature) {
      case 'zid':
        return this.post(this.REGISTER_NEW_ZID, subsData);
      case 'qoyod':
        return this.post(this.REGISTER_NEW_QOYOD, subsData);
      default:
        return of();
    }
  }
}
