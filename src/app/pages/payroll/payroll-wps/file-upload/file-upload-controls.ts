import {FormModel} from "../../../../@core/model/dto/formModel";
import {TitleControl} from "../../../../@core/model/dto/control/title-control";
import {DropdownControl} from "../../../../@core/model/dto/control/dropdown-control";
import {UploadControl} from "../../../../@core/model/dto/control/upload-control";
import {EmptyControl} from "../../../../@core/model/dto/control/empty-control";
import {TextInputControl} from "../../../../@core/model/dto/control/text-input-control";
import {AlertModel} from "../../../../@core/model/dto/alert.model";
import {
  UploadSalaryFileValidateRes
} from "../../../../@core/model/rest/payroll/upload-file/upload-salary-file-validate-res";
import {RequestValidate} from "../../../../@core/model/rest/common/otp.model";
import {UploadFileConfirmReq} from "../../../../@core/model/rest/payroll/upload-file/upload-file-confirm-req";
import {
  UploadPayrollFileReq
} from "../../../../@core/model/rest/payroll/upload-file/upload-payroll-file-req";
import {
  UploadEmployeeFileValidateReq
} from "../../../../@core/model/rest/payroll/upload-file/upload-employee-file-validate-req";
import {DocKey, DocType} from "./doc-type";
import {PayrollType} from "../../payroll-type";
import {
  UploadEmployeeFileValidateRes
} from "../../../../@core/model/rest/payroll/upload-file/upload-employee-file-validate-res";
import {UploadEmployeeFileSaveReq} from "../../../../@core/model/rest/payroll/upload-file/upload-employee-file-save-req";
import {LineCardControl} from "../../../../@core/model/dto/control/line-card-control";

export function buildFileUploadForm() {
  return new FormModel({
    id: 'upload-file-id',
    controls: {
      uploadFileTitle: new TitleControl({
        columnCount: 12,
        order: 1,
        controlOptions: {
          id: 'payroll.uploadFileSectionId',
          title: 'payroll.payroll-wps.upload-files.title',
          type: 'Section',
          endButtons: [{
            id: "EmployeeFileTemplate",
            type: "secondary",
            text: 'payroll.payroll-wps.upload-files.buttons.EmployeeFileTemplate',
            prefixIcon: "arb-icon-arrowDownBox"

          },
            {
              id: "SalaryFileTemplate",
              type: "secondary",
              text: 'payroll.payroll-wps.upload-files.buttons.SalaryFileTemplate',
              prefixIcon: "arb-icon-arrowDownBox"
            }]
        },
      }),
      fileType: new DropdownControl({
        label: 'payroll.payroll-wps.upload-files.fileType',
        hidden: false,
        required: true,
        order: 2,
        controlOptions: {
          columnId: "key", textField: 'value',
          hasSearch: true,
        },
        columnCount: 6,
        validationLabels: {required: 'payroll.payroll-wps.upload-files.validation.file-type-is-required'}
      }),
      paymentPurpose: new DropdownControl({
        label: "payroll.payroll-wps.generate-payroll-file.salary-payments-form.payment-purpose",
        order: 3,
        columnCount: 6,
        value: '',
        hidden: true,
        required: true,
        controlOptions: {options: [], columnId: "key", textField: "value"},
        validationLabels: {required: 'payroll.payroll-wps.generate-payroll-file.validations.payment-purpose-is-required'}
      }),
      fileControl: new UploadControl({
        label: 'payroll.payroll-wps.upload-files.upload',
        hidden: false,
        required: true,
        value: "",
        order: 4,
        columnCount: 6,
        controlOptions: {acceptedTypes: [".txt"]},
        validationLabels: {required: 'payroll.payroll-wps.upload-files.validation.file-is-required'}
      }),
      batchName: new TextInputControl({
        label: 'payroll.payroll-wps.upload-files.BatchPayrollName',
        hidden: true,
        required: true,
        value: "",
        order: 5,
        columnCount: 6,
        validationLabels: {required: 'payroll.payroll-wps.upload-files.validation.batch-name-is-required'}
      }),
      disclaimer: new LineCardControl({
        columnCount: 12,
        order: 6,
        controlOptions: {
          title: "payroll.payroll-wps.upload-files.disclaimer-message"
        }
      })
    }

  })
}

export const getAlertModel = (susFile: string[]): AlertModel => {
  return {
    id: 'doc-alert-model',
    type: 'Normal',
    title: 'payroll.payroll-wps.upload-files.sus-file-message',
    message: susFile,
    showClose: true
  }
}

export function creteUploadWPSSalaryFileReq(uploadFileValidateRes: UploadSalaryFileValidateRes, requestValidate?: RequestValidate): UploadFileConfirmReq {
  return {
    requestValidate: requestValidate,
    salaryPaymentDetails: uploadFileValidateRes.salaryPaymentDetails,
    payrollBatch: uploadFileValidateRes.payrollBatch
  }
}

export function createRequestValidateSalaryFile(file: File, batchName: string, paymentPurpose: string): UploadPayrollFileReq {
  return {
    file: file,
    batchName: batchName,
    paymentPurpose: paymentPurpose
  }

}

export function createRequestValidateEmployeeFile(file: File): UploadEmployeeFileValidateReq {
  return {
    file: file
  }

}

export function listOfProps(): string[] {
  return [
    'currency',
    'payrollBankCode',
    'currencyIso',
    'billStatus',
    'batchSecurityLevelStatus',
    'positivePayStatus',
    'payrollBankCode']
}

export function getDocTypeObject(payrollType: string): DocType[] {
  switch (payrollType) {
    case PayrollType.WPS:
      return [
        {
          key: DocKey.SALARY_FILE,
          value: 'payroll.payroll-wps.upload-files.file-types.SalaryFile'
        },
        {
          key: DocKey.EMPLOYEE_FILE,
          value: 'payroll.payroll-wps.upload-files.file-types.EmployeeFile'
        },
      ]
    default:
      return []

  }
}

export function creteUploadWPSEmployeeFileReq(uploadEmployeeFileValidateRes: UploadEmployeeFileValidateRes): UploadEmployeeFileSaveReq {
  return {
    employeesList: uploadEmployeeFileValidateRes.companyEmployeeList
  }
}

export const paymentPurposes = ["PAYR", "PCHA"]
