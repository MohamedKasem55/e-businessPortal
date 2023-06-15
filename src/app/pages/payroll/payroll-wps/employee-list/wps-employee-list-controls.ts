import { ButtonControl } from "app/@core/model/dto/control/button-control";
import { TextInputControl } from "app/@core/model/dto/control/text-input-control";
import { TableHeaderType } from "arb-design-library";
import { TableControl } from "../../../../@core/model/dto/control/table-control";
import { FormModel } from "../../../../@core/model/dto/formModel";

export const employeeListForm = (): FormModel => {
  return new FormModel({
    id: 'listEmployeeForm',
    controls: {
      listEmpTable: new TableControl({
        columnCount: 12,
        order: 2,
        controlOptions: {
          headers: [
            {
              title: 'payroll.payroll-wps.employee-list.table-header.emp-no',
              fieldName: 'employeeReference',
              type: TableHeaderType.TEXT
            },
            {
              title: 'payroll.payroll-wps.employee-list.table-header.emp-name',
              fieldName: 'name',
              type: TableHeaderType.TEXT
            },
            {
              title: 'payroll.payroll-wps.employee-list.table-header.emp-id',
              fieldName: 'civilianId',
              type: TableHeaderType.TEXT
            },
            {
              title: 'payroll.payroll-wps.employee-list.table-header.emp-account',
              fieldName: 'account',
              type: TableHeaderType.TEXT
            },
            {
              title: 'payroll.payroll-wps.employee-list.table-header.bank-name',
              fieldName: 'bankNameToShow',
              type: TableHeaderType.TEXT
            },
            {
              title: 'payroll.payroll-wps.employee-list.table-header.departmentId',
              fieldName: 'departmentId',
              type: TableHeaderType.TEXT
            },
            {
              title: 'payroll.payroll-wps.employee-list.table-header.emp-total-salary',
              fieldName: 'salary',
              type: TableHeaderType.AMOUNT_TEXT,
              controlOptions: {
                currency: 'currencyCode'
              }
            },
            {
              title: 'payroll.payroll-wps.employee-list.table-header.emp-basic-salary',
              fieldName: 'salaryBasic',
              type: TableHeaderType.AMOUNT_TEXT,
              controlOptions: {
                currency: 'currencyCode'
              }
            },
            {
              title: 'payroll.payroll-wps.employee-list.table-header.emp-housing-allowance',
              fieldName: 'allowanceHousing',
              type: TableHeaderType.AMOUNT_TEXT,
              controlOptions: {
                currency: 'currencyCode'
              }
            },
            {
              title: 'payroll.payroll-wps.employee-list.table-header.emp-other-allowance',
              fieldName: 'allowanceOther',
              type: TableHeaderType.AMOUNT_TEXT,
              controlOptions: {
                currency: 'currencyCode'
              }
            },
            {
              title: 'payroll.payroll-wps.employee-list.table-header.emp-deductions',
              fieldName: 'deductions',
              type: TableHeaderType.AMOUNT_TEXT,
              controlOptions: {
                currency: 'currencyCode'
              }
            }
          ],
          selectedValues: [],
          data: [],
          columnId: "employeePk",
          hasCheckbox: true,
          showSearch: true,
          showFilter: true,
          pageSizes: [5, 10, 20],
          paginationValue: {page: 1, size: 10},
          exportFileName: "employeesData",
          title: "payroll.payroll-wps.employee-list.table-title"
        },
      })
    }
  })
}

export function getSearchForm() {
  return new FormModel({
    id: 'fromAccountForm',
    controls: {
      "employeeNum": new TextInputControl({
        label: 'payroll.payroll-wps.employee-list.table-header.emp-no',
        required: false,
        order: 4,
        columnCount: 12,
        value: ''
      }),
      "employeeName": new TextInputControl({
        label: 'payroll.payroll-wps.employee-list.table-header.emp-name',
        required: false,
        order: 4,
        columnCount: 12,
        value: ''
      }),
      "civilianId": new TextInputControl({
        label: 'payroll.payroll-wps.employee-list.table-header.emp-id',
        required: false,
        order: 4,
        columnCount: 12,
        value: ''
      }),
      "cancelButton": new ButtonControl({
        order: 4,
        columnCount: 4,
        controlOptions: {
          id: "cancel",
          type: 'secondary',
          text: "public.cancel"
        }
      }),
      "resetButton": new ButtonControl({
        order: 4,
        columnCount: 4,
        controlOptions: {
          id: "reset",
          type: 'secondary',
          text: "public.reset"
        }
      }),
      "searchButton": new ButtonControl({
        order: 4,
        columnCount: 4,
        controlOptions: {
          id: "search",
          type: 'primary',
          text: "public.search"
        }
      }),
    }
  })
}

