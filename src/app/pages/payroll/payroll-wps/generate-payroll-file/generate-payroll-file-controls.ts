import {TableHeaderType} from "arb-design-library";
import {TableHeaderModel} from "arb-design-library/model/table-header.model";
import {AccountControl} from "../../../../@core/model/dto/control/account-control";
import {CalenderType, DateControl} from "../../../../@core/model/dto/control/date-control";
import {TableControl} from "../../../../@core/model/dto/control/table-control";
import {TextInputControl} from "../../../../@core/model/dto/control/text-input-control";
import {TitleControl} from "../../../../@core/model/dto/control/title-control";
import {FormModel} from "../../../../@core/model/dto/formModel";
import {PayrollPagesNames} from "../../payroll-pages-names";
import {DropdownControl} from "../../../../@core/model/dto/control/dropdown-control";
import { Utils } from "app/@core/utility/Utils";

export function generatePayrollFileForm(): FormModel {
  return new FormModel({
    id: "generatePayrollFileForm",
    controls: {
      salaryPaymentsTitle: new TitleControl({
        order: 1,
        columnCount: 12,
        controlOptions: {
          id: "salaryPaymentsTitle",
          type: "Section",
          title: "payroll.payroll-wps.generate-payroll-file.salary-payments-form.title",
          endButtons: [{
            id: PayrollPagesNames.UPLOAD_FILES,
            type: "secondary",
            prefixIcon: "arb-icon-arrowUpLine",
            text: "payroll.payroll-wps.generate-payroll-file.buttons.upload-salary-file"
          }]

        }
      }),
      debitAccount: new AccountControl({
        label: "payroll.payroll-wps.generate-payroll-file.salary-payments-form.debit-account",
        order: 2,
        columnCount: 6,
        required: true,
        validationLabels: {required: "payroll.payroll-wps.generate-payroll-file.validations.debit-account-is-required"}
      }),
      molId: new TextInputControl({
        label: "payroll.payroll-wps.generate-payroll-file.salary-payments-form.mol-id",
        order: 3,
        columnCount: 6,
        required: true,
        value: '',
        validationLabels: {required: 'payroll.payroll-wps.generate-payroll-file.validations.molId-is-required'}
      }),
      batchName: new TextInputControl({
        label: "payroll.payroll-wps.generate-payroll-file.salary-payments-form.batch-name",
        order: 4,
        columnCount: 6,
        value: "",
        required: true,
        validationLabels: {required: 'payroll.payroll-wps.generate-payroll-file.validations.batch-name-is-required'}
      }),
      paymentDate: new DateControl({
        label: "payroll.payroll-wps.generate-payroll-file.salary-payments-form.payment-date",
        order: 5,
        columnCount: 6,
        required: true,
        controlOptions: {
          type: CalenderType.GREGORIAN,
          displayPattern: 'dd/MM/yyyy',
          minDate: {
            day: Utils.getToday().day,
            month: Utils.getToday().month + 1,
            year: Utils.getToday().year,
          },
          maxDate: {
            day: Utils.getFutureDate(15).day,
            month: Utils.getFutureDate(15).month + 1,
            year: Utils.getFutureDate(15).year,
          }
        },
        validationLabels: {required: 'payroll.payroll-wps.generate-payroll-file.validations.payment-date-is-required'}
      }),
      hijriDate: new DateControl({
        label: "payroll.payroll-wps.generate-payroll-file.salary-payments-form.hijri-date",
        order: 6,
        columnCount: 6,
        controlOptions: {type: CalenderType.HIJRI, displayPattern: 'dd/MM/yyyy'},
        disable: true,
        validationLabels: {required: 'payroll.payroll-wps.generate-payroll-file.validations.hijri-date-is-required'}
      }),
      customerRef: new TextInputControl({
        label: "payroll.payroll-wps.generate-payroll-file.salary-payments-form.customer-reference",
        order: 7,
        columnCount: 6,
        value: '',
        required: true,
        validationLabels: {required: 'payroll.payroll-wps.generate-payroll-file.validations.customer-reference-is-required'}
      }),
      paymentPurpose: new DropdownControl({
        label: "payroll.payroll-wps.generate-payroll-file.salary-payments-form.payment-purpose",
        order: 8,
        columnCount: 6,
        value: '',
        required: true,
        controlOptions: {options: [], columnId: "key", textField: "value"},
        validationLabels: {required: 'payroll.payroll-wps.generate-payroll-file.validations.payment-purpose-is-required'}
      }),
      Remarks: new TextInputControl({
        label: "payroll.payroll-wps.generate-payroll-file.salary-payments-form.remarks",
        order: 9,
        columnCount: 6,
        value: ''
      }),
      employeeList: new TableControl({
        order: 11,
        columnCount: 12,
        disable: false,
        controlOptions: {
          title: "payroll.payroll-wps.generate-payroll-file.table-title",
          showSearch: true,
          exportFileName: "payroll.payroll-wps.generate-payroll-file.table-title",
          headers: EmployeeTableHeader,
          columnId: "employeePk",
          pageSizes: [5, 10, 20],
          paginationValue: {page: 1, size: 10},
        },
      })
    }
  })
}

export const EmployeeTableHeader: TableHeaderModel[] = [
  {
    title: 'payroll.payroll-wps.generate-payroll-file.table-header.emp-no',
    fieldName: 'employeeReference',
    type: TableHeaderType.TEXT,
  },
  {
    title: 'payroll.payroll-wps.generate-payroll-file.table-header.emp-name',
    fieldName: 'name',
    type: TableHeaderType.TEXT
  },
  {
    title: 'payroll.payroll-wps.generate-payroll-file.table-header.emp-id',
    fieldName: 'civilianId',
    type: TableHeaderType.TEXT
  },
  {
    title: 'payroll.payroll-wps.generate-payroll-file.table-header.emp-account',
    fieldName: 'account',
    type: TableHeaderType.TEXT
  },
  {
    title: 'payroll.payroll-wps.generate-payroll-file.table-header.bank-name',
    fieldName: 'bankNameToShow',
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
    type: TableHeaderType.AMOUNT_TEXT,
    controlOptions: {
      currency: 'currencyCode'
    }
  },
  {
    title: 'payroll.payroll-wps.generate-payroll-file.table-header.emp-housing-allowance',
    fieldName: 'allowanceHousing',
    type: TableHeaderType.AMOUNT_TEXT,
    controlOptions: {
      currency: 'currencyCode'
    }
  },
  {
    title: 'payroll.payroll-wps.generate-payroll-file.table-header.emp-other-allowance',
    fieldName: 'allowanceOther',
    type: TableHeaderType.AMOUNT_TEXT,
    controlOptions: {
      currency: 'currencyCode'
    }
  },
  {
    title: 'payroll.payroll-wps.generate-payroll-file.table-header.emp-deductions',
    fieldName: 'deductions',
    type: TableHeaderType.AMOUNT_TEXT,
    controlOptions: {
      currency: 'currencyCode',
    }
  },
  {
    title: "payroll.payroll-wps.generate-payroll-file.table-header.remarks",
    fieldName: "remarks",
    type: TableHeaderType.TEXT_INPUT,
  }
]

export const EmployeeSummaryTableHeader: TableHeaderModel[] = [
  {
    title: 'payroll.payroll-wps.generate-payroll-file.summary.table-header.emp-no',
    fieldName: 'employeeReference',
    type: TableHeaderType.TEXT,
  },
  {
    title: 'payroll.payroll-wps.generate-payroll-file.summary.table-header.emp-name',
    fieldName: 'name',
    type: TableHeaderType.TEXT
  },
  {
    title: 'payroll.payroll-wps.generate-payroll-file.table-header.emp-id',
    fieldName: 'civilianId',
    type: TableHeaderType.TEXT
  },
  {
    title: 'payroll.payroll-wps.generate-payroll-file.table-header.emp-account',
    fieldName: 'account',
    type: TableHeaderType.TEXT
  },
  {
    title: 'payroll.payroll-wps.generate-payroll-file.table-header.bank-name',
    fieldName: 'bankNameToShow',
    type: TableHeaderType.TEXT
  },
  {
    title: 'payroll.payroll-wps.generate-payroll-file.summary.table-header.emp-total-salary',
    fieldName: 'salary',
    type: TableHeaderType.AMOUNT_TEXT,
    controlOptions: {
      currency: 'currencyCode'
    }
  },
  {
    title: 'payroll.payroll-wps.generate-payroll-file.summary.table-header.emp-basic-salary',
    fieldName: 'salaryBasic',
    type: TableHeaderType.AMOUNT_TEXT,
    controlOptions: {
      currency: 'currencyCode'
    }
  },
  {
    title: 'payroll.payroll-wps.generate-payroll-file.summary.table-header.emp-housing-allowance',
    fieldName: 'allowanceHousing',
    type: TableHeaderType.AMOUNT_TEXT,
    controlOptions: {
      currency: 'currencyCode'
    }
  },
  {
    title: 'payroll.payroll-wps.generate-payroll-file.summary.table-header.emp-other-allowance',
    fieldName: 'allowanceOther',
    type: TableHeaderType.AMOUNT_TEXT,
    controlOptions: {
      currency: 'currencyCode'
    }
  },
  {
    title: 'payroll.payroll-wps.generate-payroll-file.summary.table-header.emp-deductions',
    fieldName: 'deductions',
    type: TableHeaderType.AMOUNT_TEXT,
    controlOptions: {
      currency: 'currencyCode',
    }
  },
  {
    title: "payroll.payroll-wps.generate-payroll-file.summary.table-header.remarks",
    fieldName: "remarks",
    type: TableHeaderType.TEXT,
  }
]

export const paymentPurposes = ["PAYR", "PCHA"]
