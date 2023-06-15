import {FormModel} from "../../../../@core/model/dto/formModel";
import {TableControl} from "../../../../@core/model/dto/control/table-control";
import {TableHeaderType} from "arb-design-library";
import {TitleControl} from "../../../../@core/model/dto/control/title-control";
import {PayrollPagesNames} from "../../payroll-pages-names";
import {TableHeaderModel} from "arb-design-library/model/table-header.model";
import {ButtonControl} from "../../../../@core/model/dto/control/button-control";
import {TextInputControl} from "../../../../@core/model/dto/control/text-input-control";
import {NumberInputControl} from "../../../../@core/model/dto/control/number-input-control";
import {ValidationsEnum} from "../../../../@core/model/dto/validations-enum";

export const employeeListForm = (): FormModel => {
  return new FormModel({
    id: 'listEmployeeForm',
    controls: {
      tableTitle: new TitleControl({
        order: 1,
        columnCount: 12,
        value: undefined,
        controlOptions: {
          id: 'boxesTitles',
          type: 'Section',
          endButtons: [{
            text: "Request Open Account",
            id: PayrollPagesNames.REQUEST_OPEN_ACCOUNT,
            type: "secondary"
          },
            {
              text: "Payroll Card Migration",
              id: "open",
              type: "secondary"
            }

          ]
        },
      }),
      listEmpTable: new TableControl({
        columnCount: 12,
        order: 2,
        controlOptions: {
          headers: TableHeaders,
          columnId: "uniqueEmployeeKey",
          hasCheckbox: true,
          showSearch: true,
          showFilter: true,
          pageSizes: [5, 10, 20],
          paginationValue: {page: 1, size: 10},
        },
      })
    }
  })
}

export const TableHeaders: TableHeaderModel[] = [
  {
    title: 'payroll.payroll-wps-plus.table-headers.emp-no',
    fieldName: 'employeeNumber',
    type: TableHeaderType.TEXT
  },
  {
    title: 'payroll.payroll-wps-plus.table-headers.emp-nickName',
    fieldName: 'nickName',
    type: TableHeaderType.TEXT
  },
  {
    title: 'payroll.payroll-wps-plus.table-headers.emp-total-salary',
    fieldName: 'salary',
    type: TableHeaderType.AMOUNT_TEXT,
    controlOptions: {
      currency: 'currencyCode'
    }
  },
  {
    title: 'payroll.payroll-wps-plus.table-headers.emp-basic-salary',
    fieldName: 'salaryBasic',
    type: TableHeaderType.AMOUNT_TEXT,
    controlOptions: {
      currency: 'currencyCode'
    }
  },
  {
    title: 'payroll.payroll-wps-plus.table-headers.emp-housing-allowance',
    fieldName: 'allowanceHousing',
    type: TableHeaderType.AMOUNT_TEXT,
    controlOptions: {
      currency: 'currencyCode'
    }
  },
  {
    title: 'payroll.payroll-wps-plus.table-headers.emp-other-allowance',
    fieldName: 'allowanceOther',
    type: TableHeaderType.AMOUNT_TEXT,
    controlOptions: {
      currency: 'currencyCode'
    }
  },
  {
    title: 'payroll.payroll-wps-plus.table-headers.deduction',
    fieldName: 'deductions',
    type: TableHeaderType.AMOUNT_TEXT,
    controlOptions: {
      currency: 'currencyCode'
    }
  },
  {
    title: 'payroll.payroll-wps-plus.table-headers.emp-type',
    fieldName: 'type',
    type: TableHeaderType.TEXT
  },
  {
    title: 'payroll.payroll-wps-plus.table-headers.emp-name',
    fieldName: 'name',
    type: TableHeaderType.TEXT
  },
  {
    title: 'payroll.payroll-wps-plus.table-headers.emp-civilianId',
    fieldName: 'civilianId',
    type: TableHeaderType.TEXT
  },
  {
    title: 'payroll.payroll-wps-plus.table-headers.emp-bank',
    fieldName: 'bankCode',
    type: TableHeaderType.TEXT
  },
  {
    title: 'payroll.payroll-wps-plus.table-headers.emp-account-number',
    fieldName: 'account',
    type: TableHeaderType.TEXT
  },
  {
    title: 'payroll.payroll-wps-plus.table-headers.emp-mobile',
    fieldName: 'mobile',
    type: TableHeaderType.TEXT
  },
  {
    title: 'payroll.payroll-wps-plus.table-headers.contractStartDate',
    fieldName: 'contractStartDate',
    type: TableHeaderType.DATE_TEXT, controlOptions: {format: "yyyy/MM/dd"}
  },
  {
    title: 'payroll.payroll-wps-plus.table-headers.batch-name',
    fieldName: 'batchName',
    type: TableHeaderType.TEXT
  },
  {
    title: 'payroll.payroll-wps-plus.table-headers.status',
    fieldName: 'beStatus',
    type: TableHeaderType.TEXT
  },
]

export function getFilterForm() {
  return new FormModel({
    id: 'filterFormId',
    controls: {
      empName: new TextInputControl({
        label: 'payroll.payroll-wps-plus.table-headers.emp-nickName',
        order: 1,
        columnCount: 4,
        value: '',
      }),
      employeeNumber: new NumberInputControl({
        label: 'payroll.payroll-wps-plus.table-headers.emp-no',
        order: 2,
        columnCount: 4,
        value: ''
      }),
      civilianId: new NumberInputControl({
        label: 'civ-id', order: 3, columnCount: 4, value: '', controlOptions: {maxlength: 10},
        validators: [{validation: ValidationsEnum.NATIONALID}],
      }),
      "cancelButton": new ButtonControl({
        order: 4,
        columnCount: 4,
        controlOptions: {
          id: 'cancel',
          type: 'secondary',
          text: "public.cancel"
        }
      }),
      "resetButton": new ButtonControl({
        order: 5,
        columnCount: 4,
        controlOptions: {
          id: "reset",
          type: 'secondary',
          text: "public.reset"
        }
      }),
      "filterButton": new ButtonControl({
        order: 6,
        columnCount: 4,
        controlOptions: {
          id: 'Search',
          type: 'primary',
          text: "public.search"
        }
      }),
    }
  })
}
