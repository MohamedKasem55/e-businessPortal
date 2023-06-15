import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {AbstractBaseService} from "../../@core/service/base/abstract-base.service";
import {PayrollAgreementEligibilityRes} from "../../@core/model/rest/payroll/self-on-boarding/PayrollAgreementEligibilityRes";
import {PayrollAgreementTemplateListRes} from "../../@core/model/rest/payroll/self-on-boarding/payroll-agreement-template-list-res";
import {AgreementValidateReq} from "../../@core/model/rest/payroll/self-on-boarding/agreement-validate-req";
import {AgreementValidateRes} from "../../@core/model/rest/payroll/self-on-boarding/agreement-validate-res";
import {AgreementConfirmReq} from "../../@core/model/rest/payroll/self-on-boarding/agreement-confirm-req";
import {HttpParams} from "@angular/common/http";


@Injectable()
export class PayrollAgreementsService extends AbstractBaseService {

  constructor() {
    super();
  }


  get payrollAgreementEligibility(): Observable<PayrollAgreementEligibilityRes> {
    return this.get("payroll/agreement/eligibility");
  }

  getPayrollAgreementTemplate(employeesCount: number): Observable<any> {
    return this.get("payroll/agreement/template/" + employeesCount)
  }

  getPayrollAgreementTemplateList(payrollType: string): Observable<PayrollAgreementTemplateListRes> {
    return this.get("payroll/agreement/template/all", {requestParams: new HttpParams().append('agreementType', payrollType)})
  }

  get companyPayrollAgreementTemplateList(): Observable<any> {
    return this.get("payroll/agreement/company/list")
  }

  getCompanyPayrollAgreementDetails(agreementId: number): Observable<any> {
    return this.get("payroll/agreement/company/details/" + agreementId)
  }

  payrollCompanyAgreementValidate(agreement: AgreementValidateReq): Observable<AgreementValidateRes> {
    return this.post("payroll/agreement/register/validate", agreement);
  }

  payrollCompanyAgreementConfirm(agreement: AgreementConfirmReq): Observable<any> {
    return this.post("payroll/agreement/register/confirm", agreement);
  }

}
