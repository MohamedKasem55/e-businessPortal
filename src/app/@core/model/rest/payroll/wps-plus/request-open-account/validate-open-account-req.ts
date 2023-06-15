import {BatchSecurity} from "../../../payments/billPayment/bill-payment-validate-res";

export interface ValidateOpenAccountReq {
  batchName: string;
  listEmployees: Employee[]
}

export interface Employee {
  nickName: string
  employeeNumber: string
  civilianId: string
  mobile: string
  contractStartDate: Date
  birthDate: Date
  salary: number
  salaryBasic: number
  batchName?: string
  allowanceHousing: number
  allowanceOther: number
  deductions: number
  title: string
  batchPk: number;
  companyFk: number;
  cic: string;
  type: string;
  status: string;
  accountFromFk: number;
  accountNumber: string;
  accountAlias: string;
  rejectedReason: string;
  initiationDate: Date;
  initiatedBy: string;
  approvedDate: Date;
  approvedBy: string;
  nextStatus: string;
  beStatus: string;
  futureSecurityLevelsDTOList: BatchSecurity[]
}
