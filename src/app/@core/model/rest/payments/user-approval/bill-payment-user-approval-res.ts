
export interface BillPaymentUserApprovalRes {
  billsPagedResults: {
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
  process: string;
  billCode: string;
  billRef: string;
  amountOriginal: number;
  amountPayment: number;
  nickname: string;
  addDescriptionEn: string;
  addDescriptionAr: string;
  detailsDescriptionAr: string;
  paymentType: string;
  dueDate: Date;
  vatAmount: number;
  amountWithoutVat:	number;
  newAddBill: boolean;
  amount: number;
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

