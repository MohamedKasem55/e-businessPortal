export interface EmployeePayroll {
  currencyCode?: string
  currencyName?: string
  salaryBasic: number
  allowanceHousing?: number
  allowanceOther?: number
  deductions: number
  bankBranchCode?: string
  bankBranchName?: string
  payMode?: string
  paymentDetails?: string
  departmentId: string
  remarks?: string
  employeeReferenceOLD?: string
  civilianIdOLD?: string
  accountOLD?: string
  salaryCompositionValid?: string
  name: string
  employeeReference: string
  civilianId: string
  account: string
  bankCode?: string
  bankName?: string
  bankNameAr?: string
  bankNameEn?: string
  salary: number
  lastUpdate?: Date
  status?: string
  processFlag?: string
  blockAmount?: string
  kawadar?: string
  rajhiValidAccount?: boolean
}

export interface EmpItemModel {
  items: EmployeePayroll[],
  size: number,
  total: number
}
