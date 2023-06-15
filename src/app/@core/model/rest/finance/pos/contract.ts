export interface ContractItem {
  dossierID: string;
  contractDate: ContractDate;
  amt: number;
  dossierType: string;
  productKey: ProductKey;
  dossierStatus: string;
  profit: number;
  hasDisbursmentDossier: boolean;
  firstDisbursmentDossierStatus?: string;
  childContracts: any[];
}

export interface ContractDate {
  hijriDate: boolean;
  startDate: string;
  timestamp: string;
}

export interface ProductKey {
  cIst: string;
  channel: string;
  macroFacility: string;
  facility: string;
  productCode: string;
}


export interface Product {
  cIst: any;
  channel: string;
  macroFacility: any;
  facility: any;
  productCode: string;
}

export interface ContractDate {
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

export interface FirstRePymtDate {
  hijriDate: boolean;
  startDate: string;
  timestamp: string;
}

export interface DisbursmentList {
  profit: any;
  fees: number;
  tenure: number;
  stipulatedFlg: boolean;
  documentsLst: DocumentsLst[];
  nextInstallmentDate: NextInstallmentDate;
  remainingInstallments: any;
  posDetail: PosDetail;
  cardDetail: any;
}

export interface DocumentsLst {
  documentCode: string;
  description: string;
  fileName: string;
  fileType: any;
  fileContent: any;
  approvedDoc: boolean;
}

export interface NextInstallmentDate {
  hijriDate: boolean;
  startDate: any;
  timestamp: string;
}

export interface PosDetail {
  branchesNumber: number;
  businessType: string;
  businessModel: string;
  firstRePymtDate: FirstRePymtDate2;
  lastRePymntDate: LastRePymntDate;
  accountNum: any;
  businessLocation: any;
  branchType: any;
}

export interface FirstRePymtDate2 {
  hijriDate: boolean;
  startDate: string;
  timestamp: string;
}

export interface LastRePymntDate {
  hijriDate: boolean;
  startDate: any;
  timestamp: string;
}
export interface GenerateChallengeAndOtp {
  typeAuthentication: string;
  otpPurposeCodes: any;
  serial: any;
  challengeCode: any;
  mobileNumber: string;
  isNoQr: boolean;
  callBackRequestId: any;
  owner: boolean;
}
export interface SanadLst {
  sanadID: string;
  sanadNumber: string;
  createdAt: string;
  updatedAt: string;
  sanadStatus: string;
}

export interface CommodityDetailsModel {
  commoditiesQuantity: string;
  commodityUnits: string;
  settlementDate: string;
}
