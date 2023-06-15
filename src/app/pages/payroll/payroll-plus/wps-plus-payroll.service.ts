import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {AbstractBaseService, ContextPath, RequestOption} from "../../../@core/service/base/abstract-base.service";
import {UploadPayrollFileReq} from "../../../@core/model/rest/payroll/upload-file/upload-payroll-file-req";
import {
  UploadSalaryFileValidateRes
} from "../../../@core/model/rest/payroll/upload-file/upload-salary-file-validate-res";
import {HttpHeaders, HttpParams} from "@angular/common/http";
import {UploadFileConfirmReq} from "../../../@core/model/rest/payroll/upload-file/upload-file-confirm-req";
import {WPSPlusEmployeeFileRes} from "../../../@core/model/rest/payroll/upload-file/upload-employee-file-validate-res";
import {EmployeeList, PayrollWPSSearchFilter} from "../payroll-wps/employee-list/employee-list";
import {
  ValidateOpenAccountReq
} from "../../../@core/model/rest/payroll/wps-plus/request-open-account/validate-open-account-req";
import {
  ConfirmOpenAccountReq
} from "../../../@core/model/rest/payroll/wps-plus/request-open-account/confirm-open-account-req";
import {
  OpenAccountTrackerListRes
} from "../../../@core/model/rest/payroll/wps-plus/request-open-account/open-account-tracker-list-res";
import {
  OpenAccountTrackerListReq
} from "../../../@core/model/rest/payroll/wps-plus/request-open-account/open-account-tracker-list-req";
import {
  OpenAccountTrackerDetailsReq
} from "../../../@core/model/rest/payroll/wps-plus/request-open-account/open-account-tracker-details-req";
import {
  OpenAccountTrackerDetailsRes
} from "../../../@core/model/rest/payroll/wps-plus/request-open-account/open-account-tracker-details-res";
import {
  ReInitiateRejectedRecordsInitReq
} from "../../../@core/model/rest/payroll/wps-plus/request-open-account/re-initiate-rejected-records-init-req";
import {
  ReInitiateRejectedRecordsInitRes
} from "../../../@core/model/rest/payroll/wps-plus/request-open-account/re-initiate-rejected-records-init-res";
import {
  UploadRequestOpenAccountFileReq
} from "../../../@core/model/rest/payroll/wps-plus/file-upluad/upload-request-open-account-file-req";
import {
  ConfirmModifyEmployeesReq
} from "../../../@core/model/rest/payroll/wps-plus/employees-edit/confirm-modify-employees-req";
import {
  ConfirmDeleteEmployeesReq
} from "../../../@core/model/rest/payroll/wps-plus/employee-delete/confirm-delete-employees-req";
import {SalaryPaymentsValidateReq} from "../../../@core/model/rest/payroll/wps-plus/salary-payment/salary-payments-validate-req";
import {SalaryPaymentsValidateRes} from "../../../@core/model/rest/payroll/wps-plus/salary-payment/salary-payments-validate-res";
import {SalaryPaymentsInitRes} from "../../../@core/model/rest/payroll/wps-plus/salary-payment/salary-payments-init-res";
import {SalaryPaymentsConfirmReq} from "../../../@core/model/rest/payroll/wps-plus/salary-payment/salary-payments-confirm-req";
import {MolFilesListReq} from "../../../@core/model/rest/payroll/wps/mol-file/mol-files-list-req";
import {MolFilesListRes} from "../../../@core/model/rest/payroll/wps/mol-file/mol-files-list-res";
import {MultiMolFileDownloadReq} from "../../../@core/model/rest/payroll/wps/mol-file/multi-mol-file-download-req";
import {SingleMolFileDownloadReq} from "../../../@core/model/rest/payroll/wps/mol-file/single-mol-file-download-req";
import {ProcessedFilesSearchReq} from "../../../@core/model/rest/payroll/processed-files/processed-files-search-req";

@Injectable()
export class WpsPlusPayrollService extends AbstractBaseService {

  constructor() {
    super();
  }

  public getEmployees(body: PayrollWPSSearchFilter): Observable<EmployeeList> {
    return this.post('payroll/wps-plus/employee/list', body, {hideLoader: true});
  }

  public validateRequestToOpenAccount(validateOpenAccountReq: ValidateOpenAccountReq): Observable<any> {
    return this.post('payroll/wps-plus/employee/add/validate', validateOpenAccountReq)
  }

  public confirmRequestToOpenAccount(confirmOpenAccountReq: ConfirmOpenAccountReq): Observable<any> {
    return this.post('payroll/wps-plus/employee/add/confirm', confirmOpenAccountReq)
  }

  validateUploadSalaryFile(request: UploadPayrollFileReq): Observable<UploadSalaryFileValidateRes> {
    const formData = new FormData();
    formData.append("file", request.file)
    formData.append('batchName', request.batchName!)
    return this.post("payroll/wps-plus/salary-payment/file/validate", formData,
      {customHeaders: new HttpHeaders().set('Content-Type', 'multipart/form-data')})
  }

  confirmUploadSalaryFile(request: UploadFileConfirmReq): Observable<any> {
    return this.post("payroll/wps-plus/salary-payment/file/confirm", request)
  }

  validateUploadRequestAccountOpenFile(request: UploadRequestOpenAccountFileReq): Observable<WPSPlusEmployeeFileRes> {
    const formData = new FormData()
    formData.append('batchName', request.batchName!)
    formData.append('file', request.file)
    return this.post("payroll/wps-plus/employee/add/file/validate", formData, {customHeaders: new HttpHeaders().set('Content-Type', 'multipart/form-data')})
  }

  confirmUploadRequestAccountOpenFile(request: UploadRequestOpenAccountFileReq): Observable<any> {
    const formData = new FormData()
    formData.append('batchName', request.batchName!)
    formData.append('file', request.file)
    formData.append('challengeResponse', request.requestValidate?.challengeResponse!)
    formData.append('challengeNumber', request.requestValidate?.challengeNumber!)
    formData.append('password', request.requestValidate?.password!)
    formData.append('OTP', request.requestValidate?.otp!)

    return this.post("payroll/wps-plus/employee/add/file/confirm", formData, {customHeaders: new HttpHeaders().set('Content-Type', 'multipart/form-data')})
  }

  getPendingEmployeesOpenAccount(request: OpenAccountTrackerListReq): Observable<OpenAccountTrackerListRes> {
    return this.post('payroll/wps-plus/employee/add/tracker', request, {hideLoader: true})
  }

  getEmployeesOpenAccountDetails(request: OpenAccountTrackerDetailsReq): Observable<OpenAccountTrackerDetailsRes> {
    return this.post('payroll/wps-plus/employee/add/tracker/details', request, {hideLoader: true})
  }

  reInitiateRejectedRecordsInit(request: ReInitiateRejectedRecordsInitReq): Observable<ReInitiateRejectedRecordsInitRes> {
    return this.post('payroll/wps-plus/employee/re-initiate/init', request)
  }

  reInitiateRejectedRecordsValidate(request: any): Observable<any> {
    return this.post('payroll/wps-plus/employee/re-initiate/validate', request)
  }

  reInitiateRejectedRecordsConfirm(request: any): Observable<any> {
    return this.post('payroll/wps-plus/employee/re-initiate/confirm', request)
  }

  confirmModifyEmployees(request: ConfirmModifyEmployeesReq): Observable<any> {
    return this.post('payroll/wps-plus/employee/modify', request);
  }

  confirmDeleteEmployees(request: ConfirmDeleteEmployeesReq): Observable<any> {
    return this.post('payroll/wps-plus/employee/delete', request);
  }

  get salaryPaymentsInit(): Observable<SalaryPaymentsInitRes> {
    return this.get('payroll/wps-plus/salary-payment/init')
  }

  salaryPaymentsValidate(request: SalaryPaymentsValidateReq): Observable<SalaryPaymentsValidateRes> {
    return this.post('payroll/wps-plus/salary-payment/validate', request);
  }

  salaryPaymentsConfirm(request: SalaryPaymentsConfirmReq): Observable<any> {
    return this.post('payroll/wps-plus/salary-payment/confirm', request);
  }

  getMolFilesList(request: MolFilesListReq): Observable<MolFilesListRes> {
    return this.post('payrollWPS/MOLFiles/list', request, {hideLoader: true,requestParams: new HttpParams().append('payrollType', "WPS_PAYROLL_PLUS")});
  }

  downloadMultiMolFiles(request: MultiMolFileDownloadReq): Observable<any> {
    return this.post('payrollWPS/MOLFiles/download/list', request, {responseType: 'blob'})
  }

  downloadSingleMolFiles(request: SingleMolFileDownloadReq): Observable<any> {
    return this.post('payrollWPS/MOLFiles/download', request, {responseType: 'blob'})
  }

  searchProcessedFiles(request: ProcessedFilesSearchReq): Observable<any> {
    return this.post("payrollWPS/processedFile/list", request, {hideLoader: true,requestParams: new HttpParams().append('payrollType', "WPS_PAYROLL_PLUS")})
  }
  getDocument(fileName: string) {
    const options: RequestOption = {contextPath: ContextPath.DOCUMENT_CONTEXT}
    this.getFile(fileName,fileName,true, options)
  }
}
