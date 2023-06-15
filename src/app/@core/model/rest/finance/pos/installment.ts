

export interface Installment {
  dueDate: DueDate;
  amt: number;
  status: string;
}

export interface DueDate {
  hijriDate: boolean;
  startDate: string;
  timestamp: string;
}

export interface TrackingData {
  requiredAmt: number;
  productKey: ProductKey;
  dossierStatus: string;
  statusDesc: string;
}

export interface ProductKey {
  cIst: string;
  channel: string;
  macroFacility: string;
  facility: string;
  productCode: string;
}

export interface Offer {
  financeID: string;
  acctNum: string;
  contractDate: ContractDate;
  financeAmt: number;
  installmentAmt: any;
  profit: number;
  annualProfit: any;
  fees: number;
  tenure: number;
}

export interface ContractDate {
  hijriDate: boolean;
  startDate: string;
  timestamp: string;
}

export interface ContractDate2 {
  hijriDate: boolean;
  startDate: string;
  timestamp: string;
}

export interface CreditLine {
  totalUsedAmt: number;
  totalAmt: any;
  installmentAmt: any;
  totalProfitAmt: any;
  expirytDate: any;
  rePymtPeriod: any;
  firstRePymtDate: FirstRePymtDate;
  profitRate: any;
  documentsListt: any;
  disbursmentList: DisbursmentList[];
  accountNumber: any;
}

export interface ExpirytDate {
  hijriDate: boolean;
  startDate: string;
  timestamp: string;
}

export interface FirstRePymtDate {
  hijriDate: boolean;
  startDate: string;
  timestamp: string;
}

export interface DisbursmentList {
  profit: number | any;
  fees: number;
  tenure: number;
  stipulatedFlg: boolean;
  documentsLst: DocumentsLst[];
  nextInstallmentDate: string;
  remainingInstallments: any;
  posDetail: PosDetail;
  cardDetail: CardDetail;
}

export interface DocumentsLst {
  documentCode: string;
  description: string;
  fileName: string;
  fileType: any;
  fileContent: any;
  approvedDoc: boolean;
}

export interface PosDetail {
  branchesNumber: number;
  businessType: string;
  businessModel: string;
  firstRePymtDate: FirstRePymtDate2;
  lastRePymntDate: any;
  accountNum: any;
  businessLocation: any;
  branchType: any;
}

export interface FirstRePymtDate2 {
  hijriDate: boolean;
  startDate: string;
  timestamp: string;
}

export interface CardDetail {
  customerName: any;
  cardType: any;
  cardProduct: any;
  cardCategory: any;
  creditLimitAmt: any;
  firstNameEN: any;
  lastNameEN: any;
  embossingName: any;
  membershipID: any;
  cardNum: any;
  cardStatus: any;
  cardPrintingMode: any;
}
