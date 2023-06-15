import {EmpItemModel} from "../../../../@core/model/rest/payroll/emoployee/Employee-payroll";


export interface WpsPlusEmployeeList {

  departments?: any
  departmentsAll?: any
  departmentListSelected?: string
  employeesList: EmpItemModel

}

export interface PayrollWPSSearchFilter {
  accountSelected?: string,
  batchName?: string,
  civilianID?: number,
  customerReference?: string,
  employeeName?: string,
  employeeNumber?: number,
  listCompletePagination?: [boolean],
  page?: number,
  paymentDate?: string,
  rows?: number,
  search?: boolean,
  totalEmployees?: string

}
