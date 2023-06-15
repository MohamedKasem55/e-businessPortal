import {TableHeaderModel} from "arb-design-library/model/table-header.model";
import {TableHeaderType} from "arb-design-library";
import {FormModel} from "../../../../@core/model/dto/formModel";
import {TableControl} from "../../../../@core/model/dto/control/table-control";


export const editEmployeeHeader: TableHeaderModel[] = [
  {
    title: 'payroll.payroll-wps.edit-employee.table-header.emp-no',
    fieldName: 'employeeReference',
    type: TableHeaderType.TEXT_INPUT
  },
  {
    title: 'payroll.payroll-wps.edit-employee.table-header.emp-name',
    fieldName: 'name',
    type: TableHeaderType.TEXT_INPUT
  },
    {
      title: 'payroll.payroll-wps.edit-employee.table-header.emp-id',
      fieldName: 'civilianId',
      type: TableHeaderType.TEXT_INPUT,
    },
    {
      title: 'payroll.payroll-wps.edit-employee.table-header.emp-account',
      fieldName: 'account',
      type: TableHeaderType.TEXT_INPUT
    },
    {
      title: 'payroll.payroll-wps.edit-employee.table-header.bank-name',
      fieldName: 'bankNameToShow',
      type: TableHeaderType.TEXT
    },
    {
      title: 'payroll.payroll-wps.edit-employee.table-header.departmentId',
      fieldName: 'departmentId',
      type: TableHeaderType.TEXT_INPUT
    },
  {
    title: 'payroll.payroll-wps.edit-employee.table-header.emp-total-salary',
    fieldName: 'salary',
    type: TableHeaderType.AMOUNT_TEXT,
    controlOptions: {
      currency: 'currencyCode'
    }
  },
  {
    title: 'payroll.payroll-wps.edit-employee.table-header.emp-basic-salary',
    fieldName: 'salaryBasic',
    type: TableHeaderType.AMOUNT_INPUT,
    controlOptions: {
      currency: 'currencyCode'
    }
  },
  {
    title: 'payroll.payroll-wps.edit-employee.table-header.emp-housing-allowance',
    fieldName: 'allowanceHousing',
    type: TableHeaderType.AMOUNT_INPUT,
    controlOptions: {
      currency: 'currencyCode'
    }
  },
  {
    title: 'payroll.payroll-wps.edit-employee.table-header.emp-other-allowance',
    fieldName: 'allowanceOther',
    type: TableHeaderType.AMOUNT_INPUT,
    controlOptions: {
      currency: 'currencyCode'
    }
  },
  {
    title: 'payroll.payroll-wps.edit-employee.table-header.emp-deductions',
    fieldName: 'deductions',
    type: TableHeaderType.AMOUNT_INPUT,
    controlOptions: {
      currency: 'currencyCode',
    }
  }
]

export const confirmEmployeeHeader: TableHeaderModel[] = [
  {
    title: 'payroll.payroll-wps.edit-employee.table-header.emp-no',
    fieldName: 'employeeReference',
    type: TableHeaderType.TEXT,

  },
  {
    title: 'payroll.payroll-wps.edit-employee.table-header.emp-name',
    fieldName: 'name',
    type: TableHeaderType.TEXT,
  },
  {
    title: 'payroll.payroll-wps.edit-employee.table-header.emp-id',
    fieldName: 'civilianId',
    type: TableHeaderType.TEXT,
  },
  {
    title: 'payroll.payroll-wps.edit-employee.table-header.emp-account',
    fieldName: 'account',
    type: TableHeaderType.TEXT
  },
  {
    title: 'payroll.payroll-wps.edit-employee.table-header.bank-name',
    fieldName: 'bankNameToShow',
    type: TableHeaderType.TEXT
  },
  {
    title: 'payroll.payroll-wps.edit-employee.table-header.departmentId',
    fieldName: 'departmentId',
    type: TableHeaderType.TEXT
  },
  {
    title: 'payroll.payroll-wps.edit-employee.table-header.emp-total-salary',
    fieldName: 'salary',
    type: TableHeaderType.AMOUNT_TEXT,
    controlOptions: {
      currency: 'currencyCode'
    }
  },
  {
    title: 'payroll.payroll-wps.edit-employee.table-header.emp-basic-salary',
    fieldName: 'salaryBasic',
    type: TableHeaderType.AMOUNT_TEXT,
    controlOptions: {
      currency: 'currencyCode'
    }
  },
  {
    title: 'payroll.payroll-wps.edit-employee.table-header.emp-housing-allowance',
    fieldName: 'allowanceHousing',
    type: TableHeaderType.AMOUNT_TEXT,
    controlOptions: {
      currency: 'currencyCode'
    }
  },
  {
    title: 'payroll.payroll-wps.edit-employee.table-header.emp-other-allowance',
    fieldName: 'allowanceOther',
    type: TableHeaderType.AMOUNT_TEXT,
    controlOptions: {
      currency: 'currencyCode'
    }
  },
  {
    title: 'payroll.payroll-wps.edit-employee.table-header.emp-deductions',
    fieldName: 'deductions',
    type: TableHeaderType.AMOUNT_TEXT,
    controlOptions: {
      currency: 'currencyCode',
    }
  }
]

export const editEmployeeForm = (id: string): FormModel => {
  return new FormModel({
    id: id,
    controls: {
      editEmpTable: new TableControl({
        columnCount: 12,
        order: 1,
        disable: false,
        controlOptions: {
          showSortAndPin: false,
          headers: editEmployeeHeader,
          columnId: "employeePk",
          showSearch: false,
          showFilter: false,
          pageSizes: [5, 10, 20],
          paginationValue: {page: 1, size: 10},
        },
      })
    }
  })
}
