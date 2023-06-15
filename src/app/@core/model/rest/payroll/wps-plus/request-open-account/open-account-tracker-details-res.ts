export interface OpenAccountTrackerDetailsRes {
  size: number;
  total: number;
  employeesList: WPSPlusEmployeeAccountDTO[]
}

export interface WPSPlusEmployeeAccountDTO {
  batchRef: string;
  empId: string;
  empNationalId: string;
  employeeName: string;
  cardNumber: string;
  cardStatus: string;
  mobile: string;
  expiryDate: Date;
  birthDate: Date;
  activationTimeStamp: string;
  creationTimeStamp: string;
  accountNumber: string;
  statusCode: string;
  isActive: boolean;
  statusDesc: string;
  accountType: string;
}
