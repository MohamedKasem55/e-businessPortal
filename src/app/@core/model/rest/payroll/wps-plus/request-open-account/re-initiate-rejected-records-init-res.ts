export interface ReInitiateRejectedRecordsInitRes {
  employeesList: EmployeeList
}

export interface EmployeeList {
  size: number
  total: number
  items: WPSPlusEmployeeBatchDTO[]

}

export interface WPSPlusEmployeeBatchDTO {
  name: string;
  nickName: string;
  account: string;
  bankCode: string;
  employeeNumber: string;
  civilianId: string;
  salary: number;
  salaryBasic: number;
  lastUpdate: Date;
  allowanceHousing: number;
  allowanceOther: number;
  deductions: number;
  mobile: string;
  birthDate: Date;
  contractStartDate: Date;
  batchName: string;
  correlationId: string;
  initiatorId: string;
  approverId: string;
  title: string;
  profileNumber: string;
  editableFields: string[];
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
  // HostRequestDTO hostRequest;
  initiatedBy: string;
  approvedDate: Date;
  approvedBy: string;
  nextStatus: string;
  // List<BatchSecurityDTO> securityLevelsDTOList;
  // List<BatchSecurityDTO> futureSecurityLevelsDTOList;
  // InitiationResponseRecordWSDTO initiationResponseRecordWSDTO;
  // AuthorizationResponseRecordWSDTO authorizationResponseRecordWSDTO;
  beStatus: string;
  errorDesc: string;
}
