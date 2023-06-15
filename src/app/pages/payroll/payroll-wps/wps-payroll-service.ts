import {Injectable} from '@angular/core';
import {Observable} from "rxjs";

import {EmployeePayroll} from "../../../@core/model/rest/payroll/emoployee/Employee-payroll";
import {AbstractBaseService} from "../../../@core/service/base/abstract-base.service";
import {UploadPayrollFileReq} from "../../../@core/model/rest/payroll/upload-file/upload-payroll-file-req";
import {
  UploadSalaryFileValidateRes
} from "../../../@core/model/rest/payroll/upload-file/upload-salary-file-validate-res";
import {HttpHeaders, HttpParams} from "@angular/common/http";
import {UploadFileConfirmReq} from "../../../@core/model/rest/payroll/upload-file/upload-file-confirm-req";
import {
  UploadEmployeeFileValidateReq
} from "../../../@core/model/rest/payroll/upload-file/upload-employee-file-validate-req";
import {
  UploadEmployeeFileValidateRes
} from "../../../@core/model/rest/payroll/upload-file/upload-employee-file-validate-res";
import {UploadEmployeeFileSaveReq} from "../../../@core/model/rest/payroll/upload-file/upload-employee-file-save-req";
import {ProcessedFilesSearchReq} from "../../../@core/model/rest/payroll/processed-files/processed-files-search-req";
import {EmployeeList, PayrollWPSSearchFilter} from "./employee-list/employee-list";
import {ConfirmAddEmployeeReq} from "../../../@core/model/rest/payroll/wps/add-employee/confirm-add-employee-req";
import {
  ConfirmDeleteEmployeeReq
} from "../../../@core/model/rest/payroll/wps/delet-employee/confirm-delete-employee-req";
import {
  SalaryPaymentInitRes
} from "../../../@core/model/rest/payroll/wps/generate-payroll-file/salary-payment-init-res";
import {
  SalaryPaymentValidateReq
} from "../../../@core/model/rest/payroll/wps/generate-payroll-file/salary-payment-validate-req";
import {
  SalaryPaymentValidateRes
} from "../../../@core/model/rest/payroll/wps/generate-payroll-file/salary-payment-validate-res";
import {
  SalaryPaymentConfirmReq
} from "../../../@core/model/rest/payroll/wps/generate-payroll-file/salary-payment-confirm-req";
import {MolFilesListReq} from "../../../@core/model/rest/payroll/wps/mol-file/mol-files-list-req";
import {MolFilesListRes} from "../../../@core/model/rest/payroll/wps/mol-file/mol-files-list-res";
import {MultiMolFileDownloadReq} from "../../../@core/model/rest/payroll/wps/mol-file/multi-mol-file-download-req";
import {SingleMolFileDownloadReq} from "../../../@core/model/rest/payroll/wps/mol-file/single-mol-file-download-req";
import {AnalyticsDashboardReq} from "../../../@core/model/rest/payroll/wps/analytics-dashboard/analytics-dashboard-req";
import {
  ResponseRelatedFilesPayrollWPS
} from "../../../@core/model/rest/payroll/wps/analytics-dashboard/response-related-files-payroll-wps";

@Injectable()
export class WpsPayrollService extends AbstractBaseService {

  constructor() {
    super();
  }

  public getEmployees(body: PayrollWPSSearchFilter): Observable<EmployeeList> {
    return this.post('payrollWPS/employees/list', body, {hideLoader: true});
  }

  initiateModifyEmployee(): Observable<any> {
    return this.get('payrollWPS/employees/modify/init');
  }

  public validateModifyEmployee(employees: EmployeePayroll[]): Observable<EmployeeList> {
    return this.post('payrollWPS/employees/modify/validate', employees);
  }

  public confirmModifyEmployee(employees: any): Observable<any> {
    return this.post('payrollWPS/employees/modify/confirm', employees)
  }

  public validateAddEmployee(employees: EmployeePayroll[]): Observable<EmployeeList> {
    return this.post('payrollWPS/employees/add/validate', {employeesList: employees})
  }

  public confirmAddEmployee(employees: ConfirmAddEmployeeReq): Observable<any> {
    return this.post('payrollWPS/employees/add/confirm', employees)
  }

  public confirmDeleteEmployee(employees: ConfirmDeleteEmployeeReq): Observable<any> {
    return this.post('payrollWPS/employees/delete/confirm', employees)
  }

  validateUploadSalaryFile(request: UploadPayrollFileReq): Observable<UploadSalaryFileValidateRes> {
    const formDate = new FormData();
    formDate.append("file", request.file)
    return this.post("payrollWPS/salaryPayment/file/validate/v2/" + request.batchName + "/" + request.paymentPurpose, formDate, {customHeaders: new HttpHeaders().set('Content-Type', 'multipart/form-data')})
  }

  confirmUploadSalaryFile(request: UploadFileConfirmReq): Observable<any> {
    return this.post("payrollWPS/salaryPayment/file/confirm", request)
  }

  validateUploadEmployeeFile(request: UploadEmployeeFileValidateReq): Observable<UploadEmployeeFileValidateRes> {
    const formDate = new FormData();
    formDate.append("file", request.file)
    return this.post("payrollWPS/employees/fileEmployees/validate", formDate, {customHeaders: new HttpHeaders().set('Content-Type', 'multipart/form-data')})
  }

  confirmUploadEmployeeFile(uploadEmployeeFileSaveReq: UploadEmployeeFileSaveReq): Observable<any> {
    return this.post("payrollWPS/employees/fileEmployees/save", uploadEmployeeFileSaveReq)
  }

  downloadTemplate(name: string) {
    this.getFile(name)
  }

  searchProcessedFiles(request: ProcessedFilesSearchReq): Observable<any> {
    return this.post("payrollWPS/processedFile/list", request, {
      hideLoader: true,
      requestParams: new HttpParams().append('payrollType', "WPS_PAYROLL")
    })
  }

  getRelatedFiles(request: any): Observable<any> {
    return this.post("payrollWPS/processedFile/related", request)
  }

  getRelatedFileDetails(request: any, payrollType: string): Observable<any> {
    return this.post("payrollWPS/processedFile/details", request, {requestParams: new HttpParams().append('payrollType', payrollType)})
  }

  get salaryPaymentInit(): Observable<SalaryPaymentInitRes> {
    return this.get('payrollWPS/salaryPayment/init');
  }

  salaryPaymentValidate(request: SalaryPaymentValidateReq): Observable<SalaryPaymentValidateRes> {
    return this.post('payrollWPS/salaryPayment/validate', request)
  }

  salaryPaymentConfirm(request: SalaryPaymentConfirmReq): Observable<any> {
    return this.post('payrollWPS/salaryPayment/confirm', request)
  }

  getMolFilesList(request: MolFilesListReq): Observable<MolFilesListRes> {
    return this.post('payrollWPS/MOLFiles/list', request, {hideLoader: true});
  }

  downloadMultiMolFiles(request: MultiMolFileDownloadReq): Observable<any> {
    return this.post('payrollWPS/MOLFiles/download/list', request, {responseType: 'blob'})
  }

  downloadSingleMolFiles(request: SingleMolFileDownloadReq): Observable<any> {
    return this.post('payrollWPS/MOLFiles/download', request, {responseType: 'blob'})
  }

  getDashboardData(request: AnalyticsDashboardReq): Observable<ResponseRelatedFilesPayrollWPS> {
    return this.post('payrollWPS/dashboard', request, {hideLoader: true});
  }

  downloadSystemFile(request: any): Observable<any> {
    return this.post('payrollWPS/processedFile/csvSent', request, {responseType: 'blob'})
  }

  validateCancel(): Observable<any> {
    return this.get('payrollWPS/sentFile/previewCancel');
  }

  cancelFile(request: any): Observable<any> {
    return this.post('payrollWPS/sentFile/cancel', request);

  }
}
