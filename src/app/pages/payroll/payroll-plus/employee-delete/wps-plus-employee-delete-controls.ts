import {FormModel} from "../../../../@core/model/dto/formModel";
import {TableControl} from "../../../../@core/model/dto/control/table-control";
import {TableHeaderModel} from "arb-design-library/model/table-header.model";
import {TableHeaderType} from "arb-design-library";

export function deleteEmployeesFrom(): FormModel {
  return new FormModel({
    id: "deleteEmployeesFromId",
    controls: {
      employeesDeleteTable: new TableControl({
        order: 1,
        columnCount: 12,
        disable: true,
        controlOptions: {
          headers: confirmDeleteTableHeaders,
          selectedValues: [],
          columnId: "civilianId",
          showSortAndPin: false,
          hasCheckbox: true,
          pageSizes: [5, 10, 20],
          paginationValue: {page: 1, size: 10},
        }
      })
    }
  })
}
export const confirmDeleteTableHeaders: TableHeaderModel[] = [
  {
    title: 'payroll.payroll-wps-plus.delete-employee.table-headers.emp-no',
    fieldName: 'employeeNumber',
    type: TableHeaderType.TEXT
  },
  {
    title: 'payroll.payroll-wps-plus.delete-employee.table-headers.emp-nickName',
    fieldName: 'nickName',
    type: TableHeaderType.TEXT
  },
  {
    title: 'payroll.payroll-wps-plus.delete-employee.table-headers.emp-total-salary',
    fieldName: 'salary',
    type: TableHeaderType.AMOUNT_TEXT,
    controlOptions: {
      currency: 'currencyCode'
    }
  },
  {
    title: 'payroll.payroll-wps-plus.delete-employee.table-headers.emp-basic-salary',
    fieldName: 'salaryBasic',
    type: TableHeaderType.AMOUNT_TEXT,
    controlOptions: {
      currency: 'currencyCode'
    }
  },
  {
    title: 'payroll.payroll-wps-plus.delete-employee.table-headers.emp-housing-allowance',
    fieldName: 'allowanceHousing',
    type: TableHeaderType.AMOUNT_TEXT,
    controlOptions: {
      currency: 'currencyCode'
    }
  },
  {
    title: 'payroll.payroll-wps-plus.delete-employee.table-headers.emp-other-allowance',
    fieldName: 'allowanceOther',
    type: TableHeaderType.AMOUNT_TEXT,
    controlOptions: {
      currency: 'currencyCode'
    }
  },
  {
    title: 'payroll.payroll-wps-plus.delete-employee.table-headers.deductions',
    fieldName: 'deductions',
    type: TableHeaderType.AMOUNT_TEXT,
    controlOptions: {
      currency: 'currencyCode'
    }
  },
  {
    title: 'payroll.payroll-wps-plus.delete-employee.table-headers.emp-type',
    fieldName: 'type',
    type: TableHeaderType.TEXT
  },
  {
    title: 'payroll.payroll-wps-plus.delete-employee.table-headers.emp-name',
    fieldName: 'name',
    type: TableHeaderType.TEXT
  },
  {
    title: 'payroll.payroll-wps-plus.delete-employee.table-headers.emp-civilianId',
    fieldName: 'civilianId',
    type: TableHeaderType.TEXT
  },
  {
    title: 'payroll.payroll-wps-plus.delete-employee.table-headers.emp-bank',
    fieldName: 'bankCode',
    type: TableHeaderType.TEXT
  },
  {
    title: 'payroll.payroll-wps-plus.delete-employee.table-headers.emp-account-number',
    fieldName: 'account',
    type: TableHeaderType.TEXT
  },
  {
    title: 'payroll.payroll-wps-plus.delete-employee.table-headers.emp-mobile',
    fieldName: 'mobile',
    type: TableHeaderType.TEXT
  },
  {
    title: 'payroll.payroll-wps-plus.delete-employee.table-headers.contractStartDate',
    fieldName: 'contractStartDate',
    type: TableHeaderType.DATE_TEXT, controlOptions: {format: "yyyy/MM/dd"}
  },
  {
    title: 'payroll.payroll-wps-plus.delete-employee.table-headers.batch-name',
    fieldName: 'batchName',
    type: TableHeaderType.TEXT
  },
  {
    title: 'payroll.payroll-wps-plus.delete-employee.table-headers.status',
    fieldName: 'beStatus',
    type: TableHeaderType.TEXT
  },
]
