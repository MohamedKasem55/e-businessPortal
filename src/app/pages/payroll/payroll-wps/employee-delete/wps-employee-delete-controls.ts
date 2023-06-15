import {TableHeaderModel} from "arb-design-library/model/table-header.model";
import {TableHeaderType} from "arb-design-library";
import {FormModel} from "../../../../@core/model/dto/formModel";
import {TableControl} from "../../../../@core/model/dto/control/table-control";
import {TitleControl} from "../../../../@core/model/dto/control/title-control";

export const DeleteEmployeeHeader: TableHeaderModel[] = [
  {
    title: 'payroll.payroll-wps.delete-emp.table-header.emp-no',
    fieldName: 'employeeReference',
    type: TableHeaderType.TEXT
  },
  {
    title: 'payroll.payroll-wps.delete-emp.table-header.emp-name',
    fieldName: 'name',
    type: TableHeaderType.TEXT
  },
  {
    title: 'payroll.payroll-wps.delete-emp.table-header.emp-total-salary',
    fieldName: 'salary',
    type: TableHeaderType.AMOUNT_TEXT,
    controlOptions: {
      currency: 'currencyCode'
    }
  },
  {
    title: 'payroll.payroll-wps.delete-emp.table-header.emp-basic-salary',
    fieldName: 'salaryBasic',
    type: TableHeaderType.AMOUNT_TEXT,
    controlOptions: {
      currency: 'currencyCode'
    }
  },
  {
    title: 'payroll.payroll-wps.delete-emp.table-header.emp-housing-allowance',
    fieldName: 'allowanceHousing',
    type: TableHeaderType.AMOUNT_TEXT,
    controlOptions: {
      currency: 'currencyCode'
    }
  },
  {
    title: 'payroll.payroll-wps.delete-emp.table-header.emp-other-allowance',
    fieldName: 'allowanceOther',
    type: TableHeaderType.AMOUNT_TEXT,
    controlOptions: {
      currency: 'currencyCode'
    }
  },
  {
    title: 'payroll.payroll-wps.delete-emp.table-header.emp-deductions',
    fieldName: 'deductions',
    type: TableHeaderType.AMOUNT_TEXT,
    controlOptions: {
      currency: 'currencyCode',
    }
  }
]


export const deleteEmployeeForm = (id: string): FormModel => {
  return new FormModel({
    id: id,
    controls: {
      deleteTable: new TableControl({
        columnCount: 12,
        order: 2,
        disable: true,
        controlOptions: {
          headers: DeleteEmployeeHeader,
          columnId: "civilianId",
          hasCheckbox: true,
          showSearch: false,
          showFilter: false,
          pageSizes: [5, 10, 20],
          paginationValue: {page: 1, size: 10},
          title: 'payroll.payroll-wps.delete-emp.table-name',
        },
      })
    }
  })
}
