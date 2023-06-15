import {FormModel} from "../../../../@core/model/dto/formModel";
import {TitleControl} from "../../../../@core/model/dto/control/title-control";
import {DropdownControl} from "../../../../@core/model/dto/control/dropdown-control";
import {UploadControl} from "../../../../@core/model/dto/control/upload-control";
import {EmptyControl} from "../../../../@core/model/dto/control/empty-control";
import {TextInputControl} from "../../../../@core/model/dto/control/text-input-control";
import {AlertModel} from "../../../../@core/model/dto/alert.model";
import {UploadSalaryFileValidateRes} from "../../../../@core/model/rest/payroll/upload-file/upload-salary-file-validate-res";
import {RequestValidate} from "../../../../@core/model/rest/common/otp.model";
import {UploadFileConfirmReq} from "../../../../@core/model/rest/payroll/upload-file/upload-file-confirm-req";
import {UploadPayrollFileReq} from "../../../../@core/model/rest/payroll/upload-file/upload-payroll-file-req";
import {DocKey, DocType} from "./doc-type";
import {UploadEmployeeFileValidateRes} from "../../../../@core/model/rest/payroll/upload-file/upload-employee-file-validate-res";
import {UploadEmployeeFileSaveReq} from "../../../../@core/model/rest/payroll/upload-file/upload-employee-file-save-req";

export function buildFileUploadForm() {
  return new FormModel({
    id: 'upload-file-id',
    controls: {
      uploadFileTitle: new TitleControl({
        columnCount: 12,
        order: 1,
        controlOptions: {
          id: 'payroll.uploadFileSectionId',
          title: 'payroll.uploadFile.title',
          type: 'Section',
          endButtons: [
            // {
            //   id: DocKey.PAYROLL_CARD_MIGRATION_FILE,
            //   type: "secondary",
            //   text: 'payroll.payroll-wps-plus.upload-file.buttons.CardMigrationTem',
            //   prefixIcon: "arb-icon-arrowDownBox"
            //
            // },
            {
              id: DocKey.REQUEST_OPEN_ACCOUNT_FILE,
              type: "secondary",
              text: 'payroll.payroll-wps-plus.upload-file.buttons.OpenAccountTemplate',
              prefixIcon: "arb-icon-arrowDownBox"
            },
            {
              id: DocKey.SALARY_FILE,
              type: "secondary",
              text: 'payroll.payroll-wps-plus.upload-file.buttons.SalaryFileTemplate',
              prefixIcon: "arb-icon-arrowDownBox"
            }
          ]
        },
      }),
      fileType: new DropdownControl({
        label: 'payroll.uploadFile.fileType',
        hidden: false,
        required: true,
        order: 2,
        controlOptions: {columnId: "key", textField: 'value',
          hasSearch: true,},
        columnCount: 6,
        validationLabels: {required: 'payroll.uploadFile.file-type-is-required'}
      }),
      empty: new EmptyControl({
        columnCount: 6,
        order: 3,
      }),
      fileControl: new UploadControl({
        label: 'payroll.uploadFile.upload',
        hidden: false,
        required: true,
        value: "",
        order: 4,
        columnCount: 6,
        controlOptions: {acceptedTypes: [".txt"]},
        validationLabels: {required: 'payroll.uploadFile.file-is-required'}
      }),
      batchName: new TextInputControl({
        label: 'payroll.uploadFile.batchName',
        hidden: false,
        required: true,
        value: "",
        order: 5,
        columnCount: 6,
        validationLabels: {required: 'payroll.uploadFile.batch-name-is-required'}
      })
    }

  })
}

export const getAlertModel = (susFile: string[]): AlertModel => {
  return {
    id: 'doc-alert-model',
    type: 'Normal',
    title: 'A Suspicious Payroll Duplication File, Another File Already Has Same Details',
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

export function createRequestValidateSalaryFile(file: File, batchName: string): UploadPayrollFileReq {
  return {
    file: file,
    batchName: batchName,
    paymentPurpose: "PAYR"
  }

}

export function createRequestValidateEmployeeFile(file: File, batchName?: string): UploadPayrollFileReq {
  return {
    file: file,
    batchName: batchName,
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

export function getDocTypeObject(): DocType[] {
  return [
    {
      key: DocKey.REQUEST_OPEN_ACCOUNT_FILE,
      value: 'payroll.payroll-wps-plus.upload-file.files.RequestOpenAccount'
    },
    // {
    //   key: DocKey.PAYROLL_CARD_MIGRATION_FILE,
    //   value: 'payroll.payroll-wps-plus.upload-file.files.PayrollCardMigration'
    // },
    {
      key: DocKey.SALARY_FILE,
      value: 'payroll.payroll-wps-plus.upload-file.files.SalaryFile'
    }
  ]
}

export function creteUploadWPSEmployeeFileReq(uploadEmployeeFileValidateRes: UploadEmployeeFileValidateRes): UploadEmployeeFileSaveReq {
  return {
    employeesList: uploadEmployeeFileValidateRes.companyEmployeeList
  }
}
