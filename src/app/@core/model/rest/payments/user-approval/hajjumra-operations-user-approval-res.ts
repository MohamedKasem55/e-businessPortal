
export interface HajjUmrahOperationsUserApprovalRes {
  listOperationsDSO: {
    items: BatchItem[]
    size: number;
    total: number;
  }
}

export interface BatchItem {
  batchPk: number;
  type: string;
  status: string;
  accountNumber: string;
  accountAlias: string;
  rejectedReason?: any;
  initiationDate: Date;
  hostRequest: HostItem;
  nextStatus: string;
  securityLevelsDTOList: SecurityItem[];
  futureSecurityLevelsDTOList: SecurityItem[];
  beStatus: string;
  hajjUmrahOperationBatchPk: number;
  cardNumber: string;
  passportNumber: string;
  cardHolderName: string;
  birthDate: Date;
  visaNumber: string;
  visaExpiryDate: Date;
  amount: number;
  operation: string;
  newCardNumber: string;
  executionDate: Date;
  address: string;
  country: string;
  nationality: string;
  stateRegion: string;
  city: string;
  postalCode: string;
  mobileNumber: string;
  mobileKSA: string;
  email: string;
  language: string;
  expectedFees: number;
  cardAllocationDate: Date;
  cardExpiryDate: Date;
  totalAmountLoaded: number;
  currentBalance: number;
  cardStatus: string;
  pdfSecurityLevelsDTOList: SecurityItem[];
  futureStatus: string;
}

export interface HostItem {
  hostRequestsPk: number;
  fileReference: string;
  fileType:	string;
  fileStatus:	string;
  requestDate: Date;
  fileName: string;
  requestTime: Date;
  transfaerDate: Date;
  companyDTO: CompanyItem;
  accountFrom: string;
  newTransferDate: Date;
  rejectionReason: string;
  userFileName: string;
  batchList	:string;//
  prepared: boolean;
}

export interface SecurityItem {
  batchSecurityPk: number;
  level: number;
  status: string;
  updater: string;
  updateDate: string;
  userPk?: any;
  auditStatus?: any;
  pdfStatus?: any;
}

export interface CompanyItem {}

