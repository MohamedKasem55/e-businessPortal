import { Injectable, Injector } from '@angular/core';
import { AbstractBaseService } from "../../base/abstract-base.service";
import { HttpClient } from "@angular/common/http";
import { Constants } from "../../payments/government/government-payment-service-urls";
import { Observable } from "rxjs";
import { AccountsResModel } from 'app/@core/model/rest/payments/account-res.model';
import { PrepareAlienControlRequest } from 'app/@core/model/rest/payments/government/prepare-alien-control-request';
import { PrepareCivilDefenseViolationsRequest } from 'app/@core/model/rest/payments/government/prepare-civil-defense-violations-request';
import { PrepareCivilRegistrationRequest } from 'app/@core/model/rest/payments/government/prepare-civil-registration-request';
import { PrepareDrivingLicenseRequest } from 'app/@core/model/rest/payments/government/prepare-driving-license-request';
import { PrepareMotorVehiclesRequest } from 'app/@core/model/rest/payments/government/prepare-motor-vehicles-request';
import { ValidateResponse } from 'app/@core/model/rest/payments/government/validate-response';
import { ValidateRequest } from 'app/@core/model/rest/payments/government/validate-request';
import { PrepareTrafficViolationsRequest } from 'app/@core/model/rest/payments/government/prepare-traffic-violations-request';
import { PrepareSaudiPassportRequest } from 'app/@core/model/rest/payments/government/prepare-saudi-passport-request';
import { PreparePublicViolationRequest } from 'app/@core/model/rest/payments/government/prepare-public-violation-request';
import { PrepareCivilDefenseViolationsResponse } from 'app/@core/model/rest/payments/government/prepare-civil-defense-violations-response';
import { PrepareMotorVehiclesResponse } from 'app/@core/model/rest/payments/government/prepare-motor-vehicles-response';
import { PreparePublicViolationResponse } from 'app/@core/model/rest/payments/government/prepare-public-violation-response';
import { PrepareSaudiPassportResponse } from 'app/@core/model/rest/payments/government/prepare-saudi-passport-response';
import { PrepareTrafficViolationsResponse } from 'app/@core/model/rest/payments/government/prepare-traffic-violations-response';
import { PrepareAlienControlResponse } from 'app/@core/model/rest/payments/government/prepare-alien-control-response';
import { ConfirmRequest } from 'app/@core/model/rest/payments/government/confirm-request';
import { ConfirmResponse } from 'app/@core/model/rest/payments/government/confirm-response';

@Injectable()
export class GovermentPaymentService extends AbstractBaseService {
  constructor(http: HttpClient) {
    super();
  }

  getAccounts(): Observable<AccountsResModel> {
    return this.get(Constants.ACCOUNTS);
  }

  prepareSadadPayment(paymentSadadModel: PaymentSadadModel): Observable<PrepareAlienControlResponse | PrepareCivilDefenseViolationsResponse|PrepareCivilRegistrationRequest|PrepareDrivingLicenseRequest|PrepareMotorVehiclesResponse|PreparePublicViolationResponse|PrepareSaudiPassportResponse|PrepareTrafficViolationsResponse> {
    let urlConstant: string = '';
    switch (paymentSadadModel.serviceType) {
      case '095':
        urlConstant = Constants.VISA_CONTROL;
        break;
      case '090':
        urlConstant = Constants.ALIEN_CONTROL;
        break;
      case '092':
        urlConstant = Constants.CIVIL_DEFENSE_VIOLATIONS;
        break;
      case '096':
        urlConstant = Constants.CIVIL_REGISTRATION;
        break;
      case '091':
        urlConstant = Constants.DRIVING_LICENSE;
        break;
      case '094':
        urlConstant = Constants.MOTOR_VEHICLES;
        break;
      case '126':
        urlConstant = Constants.PUBLIC_VIOLATION;
        break;
      case '093':
        urlConstant = Constants.TRAFFIC_VIOLATIONS;
        break;
      case '092':
        urlConstant = Constants.SAUDI_PASSPORT;
        break;
    }
    return this.post(urlConstant, paymentSadadModel.applicationTypeRequest);
  }

  prepareAlienControl(payment: PrepareAlienControlRequest): Observable<PrepareAlienControlResponse> {
    return this.post(Constants.ALIEN_CONTROL, payment);
  }
  prepareCivilDefenseViolations(prepareCivilDefenseViolationsRequest: PrepareCivilDefenseViolationsRequest): Observable<PrepareCivilDefenseViolationsResponse> {
    return this.post(Constants.CIVIL_DEFENSE_VIOLATIONS, prepareCivilDefenseViolationsRequest);
  }
  prepareCivilRegistration(prepareCivilRegistrationRequest: PrepareCivilRegistrationRequest): Observable<PrepareCivilRegistrationRequest> {
    return this.post(Constants.CIVIL_REGISTRATION, prepareCivilRegistrationRequest);
  }
  prepareDrivingLicense(prepareDrivingLicenseRequest: PrepareDrivingLicenseRequest): Observable<PrepareDrivingLicenseRequest> {
    return this.post(Constants.DRIVING_LICENSE, prepareDrivingLicenseRequest);
  }
  prepareMotorVehicles(prepareMotorVehiclesRequest: PrepareMotorVehiclesRequest): Observable<PrepareMotorVehiclesResponse> {
    return this.post(Constants.MOTOR_VEHICLES, prepareMotorVehiclesRequest);
  }
  preparePublicViolation(preparePublicViolationRequest: PreparePublicViolationRequest): Observable<PreparePublicViolationResponse> {
    return this.post(Constants.PUBLIC_VIOLATION, preparePublicViolationRequest);
  }
  prepareSaudiPassport(prepareSaudiPassportRequest: PrepareSaudiPassportRequest): Observable<PrepareSaudiPassportResponse> {
    return this.post(Constants.SAUDI_PASSPORT, prepareSaudiPassportRequest);
  }
  prepareTrafficViolations(prepareTrafficViolationsRequest: PrepareTrafficViolationsRequest): Observable<PrepareTrafficViolationsResponse> {
    return this.post(Constants.TRAFFIC_VIOLATIONS, prepareTrafficViolationsRequest);
  }
  validate(validateRequest: ValidateRequest): Observable<ValidateResponse> {
    return this.post(Constants.VALIDATE, validateRequest);
  }
  confirm(confirmRequest: ConfirmRequest): Observable<ConfirmResponse> {
    return this.post(Constants.CONFIRM, confirmRequest);
  }
}

export interface PaymentSadadModel {
  serviceType: string;
  applicationTypeRequest: PrepareAlienControlRequest | PrepareCivilDefenseViolationsRequest | PrepareCivilRegistrationRequest | PrepareDrivingLicenseRequest | PrepareMotorVehiclesRequest | PreparePublicViolationRequest | PrepareSaudiPassportRequest | PrepareTrafficViolationsRequest;

}
