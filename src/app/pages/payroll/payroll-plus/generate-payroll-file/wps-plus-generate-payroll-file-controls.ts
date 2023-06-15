import {FormModel} from "../../../../@core/model/dto/formModel";
import {TitleControl} from "../../../../@core/model/dto/control/title-control";
import {AccountControl} from "../../../../@core/model/dto/control/account-control";
import {TextInputControl} from "../../../../@core/model/dto/control/text-input-control";
import {CalenderType, DateControl} from "../../../../@core/model/dto/control/date-control";
import {TableControl} from "../../../../@core/model/dto/control/table-control";
import {TableHeaderModel} from "arb-design-library/model/table-header.model";
import {TableHeaderType} from "arb-design-library";
import {SelectionControl} from "../../../../@core/model/dto/control/selection-control";

export function generateSalaryFileForm(): FormModel {
  return new FormModel({
    id: "generateSalaryFileFormId",
    controls: {
      salaryPaymentsTitle: new TitleControl({
        order: 1,
        columnCount: 12,
        controlOptions: {
          id: "salaryPaymentsTitleId",
          type: "Section",
          title: "payroll.payroll-wps-plus.generate-payroll-file.salary-payments-form.title",
        }
      }),
      debitAccount: new AccountControl({
        label: "payroll.payroll-wps-plus.generate-payroll-file.salary-payments-form.debit-account",
        order: 2,
        columnCount: 6,
        required: true,
        validationLabels: {required: "payroll.payroll-wps.generate-payroll-file.validations.debit-account-is-required"}
      }),
      molId: new TextInputControl({
        label: "payroll.payroll-wps-plus.generate-payroll-file.salary-payments-form.mol-id",
        order: 3,
        columnCount: 6,
        required: true,
        value: '',
        validationLabels: {required: 'payroll.payroll-wps.generate-payroll-file.validations.molId-is-required'}
      }),
      batchName: new TextInputControl({
        label: "payroll.payroll-wps-plus.generate-payroll-file.salary-payments-form.batch-name",
        order: 4,
        columnCount: 6,
        value: "",
        required: true,
        validationLabels: {required: 'payroll.payroll-wps.generate-payroll-file.validations.batch-name-is-required'}
      }),
      paymentDate: new DateControl({
        label: "payroll.payroll-wps-plus.generate-payroll-file.salary-payments-form.payment-date",
        order: 5,
        columnCount: 6,
        required: true,
        controlOptions: {type: CalenderType.GREGORIAN, displayPattern: 'dd/MM/yyyy'},
        validationLabels: {required: 'payroll.payroll-wps.generate-payroll-file.validations.payment-date-is-required'}
      }),
      hijriDate: new DateControl({
        label: "payroll.payroll-wps-plus.generate-payroll-file.salary-payments-form.hijri-date",
        order: 6,
        columnCount: 6,
        controlOptions: {type: CalenderType.HIJRI, displayPattern: 'dd/MM/yyyy'},
        disable: true,
        validationLabels: {required: 'payroll.payroll-wps.generate-payroll-file.validations.hijri-date-is-required'}
      }),
      customerRef: new TextInputControl({
        label: "payroll.payroll-wps-plus.generate-payroll-file.salary-payments-form.customer-reference",
        order: 7,
        columnCount: 6,
        value: '',
        required: true,
        validationLabels: {required: 'payroll.payroll-wps.generate-payroll-file.validations.customer-reference-is-required'}
      }),
      paymentPurpose: new TextInputControl({
        label: "payroll.payroll-wps-plus.generate-payroll-file.salary-payments-form.payment-purpose",
        order: 8,
        columnCount: 6,
        value: '',
        required: true,
        validationLabels: {required: 'payroll.payroll-wps.generate-payroll-file.validations.payment-purpose-is-required'}
      }),
      Remarks: new TextInputControl({
        label: "payroll.payroll-wps-plus.generate-payroll-file.salary-payments-form.remarks",
        order: 9,
        columnCount: 6,
        value: ''
      }),
      employeeList: new TableControl({
        order: 11,
        columnCount: 12,
        disable: false,
        controlOptions: {
          title: "payroll.payroll-wps-plus.generate-payroll-file.table-title",
          data:[],
          selectedValues:[],
          showSortAndPin: false,
          headers: EmployeeTableHeader,
          columnId: "uniqueEmployeeKey",
          pageSizes: [5, 10, 20],
          paginationValue: {page: 1, size: 10},
        }
      }),
      updateSalaryPaymentDetails: new SelectionControl({
        order: 12,
        columnCount: 12,
        required: false,
        controlOptions: {
          title: [{text: 'do you want to update payment details'}]
        },
      }),
    }
  })
}

export const EmployeeTableHeader: TableHeaderModel[] = [
  {
    type: TableHeaderType.BUTTON,
    title: '',
    fieldName: '',
    controlOptions: {id: 'RemoveSelected',prefixIcon:"arb-icon-Trash color-arb-negativeText"}
  },
  {
    title: 'payroll.payroll-wps.generate-payroll-file.table-header.emp-no',
    fieldName: 'employeeNumber',
    type: TableHeaderType.TEXT,
  },
  {
    title: 'payroll.payroll-wps.generate-payroll-file.table-header.emp-name',
    fieldName: 'nickName',
    type: TableHeaderType.TEXT
  },
  {
    title: 'payroll.payroll-wps.generate-payroll-file.table-header.emp-total-salary',
    fieldName: 'salary',
    type: TableHeaderType.AMOUNT_TEXT,
    controlOptions: {
      currency: 'currencyCode'
    }
  },
  {
    title: 'payroll.payroll-wps.generate-payroll-file.table-header.emp-basic-salary',
    fieldName: 'salaryBasic',
    type: TableHeaderType.AMOUNT_INPUT,
    controlOptions: {
      currency: 'currencyCode'
    }
  },
  {
    title: 'payroll.payroll-wps.generate-payroll-file.table-header.emp-housing-allowance',
    fieldName: 'allowanceHousing',
    type: TableHeaderType.AMOUNT_INPUT,
    controlOptions: {
      currency: 'currencyCode'
    }
  },
  {
    title: 'payroll.payroll-wps.generate-payroll-file.table-header.emp-other-allowance',
    fieldName: 'allowanceOther',
    type: TableHeaderType.AMOUNT_INPUT,
    controlOptions: {
      currency: 'currencyCode'
    }
  },
  {
    title: 'payroll.payroll-wps.generate-payroll-file.table-header.emp-deductions',
    fieldName: 'deductions',
    type: TableHeaderType.AMOUNT_INPUT,
    controlOptions: {
      currency: 'currencyCode',
    }
  },
  // {
  //   title: "payroll.payroll-wps.generate-payroll-file.table-header.remarks",
  //   fieldName: "remarks",
  //   type: TableHeaderType.TEXT_INPUT,
  // }
]
export const SummaryEmployeeTableHeader: TableHeaderModel[] = [
  {
    title: 'payroll.payroll-wps-plus.generate-payroll-file.summary.table-header.emp-no',
    fieldName: 'employeeNumber',
    type: TableHeaderType.TEXT,
  },
  {
    title: 'payroll.payroll-wps-plus.generate-payroll-file.summary.table-header.emp-name',
    fieldName: 'nickName',
    type: TableHeaderType.TEXT
  },
  {
    title: 'payroll.payroll-wps-plus.generate-payroll-file.summary.table-header.emp-total-salary',
    fieldName: 'salary',
    type: TableHeaderType.AMOUNT_TEXT,
    controlOptions: {
      currency: 'currencyCode'
    }
  },
  {
    title: 'payroll.payroll-wps-plus.generate-payroll-file.summary.table-header.emp-basic-salary',
    fieldName: 'salaryBasic',
    type: TableHeaderType.AMOUNT_INPUT,
    controlOptions: {
      currency: 'currencyCode'
    }
  },
  {
    title: 'payroll.payroll-wps-plus.generate-payroll-file.summary.table-header.emp-housing-allowance',
    fieldName: 'allowanceHousing',
    type: TableHeaderType.AMOUNT_INPUT,
    controlOptions: {
      currency: 'currencyCode'
    }
  },
  {
    title: 'payroll.payroll-wps-plus.generate-payroll-file.summary.table-header.emp-other-allowance',
    fieldName: 'allowanceOther',
    type: TableHeaderType.AMOUNT_INPUT,
    controlOptions: {
      currency: 'currencyCode'
    }
  },
  {
    title: 'payroll.payroll-wps-plus.generate-payroll-file.summary.table-header.emp-deductions',
    fieldName: 'deductions',
    type: TableHeaderType.AMOUNT_INPUT,
    controlOptions: {
      currency: 'currencyCode',
    }
  }
]
