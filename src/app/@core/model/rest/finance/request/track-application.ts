import { KeyValueModel } from '../../common/key-value.model';

export interface ProductKey {
  cIst: string | null;
  channel: string | null;
  macroFacility: string | null;
  facility: string | null;
  productCode: string | null;
}

export interface ContractDate {
  hijriDate: boolean | null;
  startDate: string | null;
  timestamp: string | null;
}

export interface DocumentList {
  documentCode: string | null;
  description: string | null;
  fileName?: string | null;
  fileType: string | null;
  fileContent?: string | any;
  approvedDoc?: boolean | null;
  name?:string,
}


export interface BusinessDetail {
  branchesNumber: string | number | null;
  businessType: string | null | KeyValueModel;
  businessModel: string | null;
  firstRePymtDate: ContractDate | any;
  lastRePymntDate: ContractDate | any;
  accountNum: string | null;
  businessLocation: string | null | KeyValueModel;
  branchType: string | null | KeyValueModel;
}
export interface CardDetail {
  customerName: string | null;
  cardType: string | null;
  cardProduct: string | null;
  cardCategory: string | null;
  creditLimitAmt: number | string | null;
  firstNameEN: string | null;
  lastNameEN: string | null;
  embossingName: string | null;
  membershipID: string | null;
  cardNum: string | null;
  cardStatus: string | null;
  cardPrintingMode: string | null;
}
export interface DisbursmentList {
  profit: number | null;
  fees: number | null;
  tenure: number | null;
  stipulatedFlg: boolean | null;
  documentsLst: Array<DocumentList> | null;
  nextInstallmentDate: ContractDate | null;
  remainingInstallments: number | string | null;
  posDetail: BusinessDetail | null;
  cardDetail: CardDetail | null;
}

export interface CreditLine {
  totalUsedAmt: number | null;
  totalAmt: number | null;
  installmentAmt: number | null;
  totalProfitAmt: number | null;
  expirytDate: ContractDate | null;
  rePymtPeriod: number | null;
  firstRePymtDate: ContractDate | null;
  profitRate: number | string | null;
  documentsListt: string | any | null;
  disbursmentList: Array<DisbursmentList>;
  accountNumber: string | null;
}
export interface VehicleGroup {
  product: string | null;
  campaign: string | null;
  dealerName: string | null;
  brandName: string | null;
  modelName: string | null;
  modelYear: string | null;
  vehicleVariant: string | null;
  vehiclesNum: string | null;
  vehiclePrice: number | null;
  vehicleType: string | null;
  gracePeriod: string | null;
  tenure: string | number | null;
  profitRate: number | string | null;
  downPmt: number | null;
  ballonPmt: number | null;
  vehicleCategory: string | null;
  adminFeeAmt: number | null;
  defaultProfitRate: number | null;
  pmtFrequency: string | null;
  minDownPmt: number | null;
  firstInstallmentAmt: number | null;
  insurancePer: string | null;
  currentYearGroup: string | number | null;
  totalGroups: number | null;
  quotationNum: string | number | null;
  quotationDate: string | null;
  dealerType: string | null;
  vehicleSegment: string | null;
}

export interface InstallmentList {
  installmentNum: number | null;
  monthlyInstallmentAmt: number | null;
  installmentDate: string | null;
}

export interface FinancialDetails {
  totalFinanceAmt: number | null;
  totalDownPmt: number | null;
  totalAdminFeeAmt: number | null;
}

export interface UploadQuotation {
  quotationType: string | null;
  quotationNum: string | number | null;
  quotationDate: string | null;
  fileId?: string | null;
  documentsInfo: DocumentInfo | null;
  purposes: Array<Purposes>;
}
export interface DocumentInfo {
  documentCode: string | null;
  description: string | null;
  fileName: string | null;
  fileType: string | null;
  fileContent: string | null;
}

export interface Purposes {
  purposeOfUse: string | null;
  purposeValue: string | number | null;
  campaign: string | null;
  dealerName: string | null;
  brandName: string | null;
  modelName: string | null;
  modelYear: string | null;
  vehicleVariant: string | null;
  vehiclesNum: string | number | null;
  vehiclePrice: number | null;
  vehicleType: string | null;
  vehicleColor: string | null;
  gracePeriod: string | null;
  gracePeriodType: string | null;
  tenure: string | number | null;
  profitRate: string | number | null;
  pmtFrequency: string | null;
  downPmt: number | string | null;
  ballonPmt: number | null;
}

export interface VendorInfo {
  product: string | null;
  telephoneNumber: string | null;
  dealerName: string | null;
  email: string | null;
  address: string | null;
}
export interface TrackApplication {
  trackingData: {
    requiredAmt: number | null;
    productKey: ProductKey | null;
    dossierStatus: string | null;
    statusDesc: string | null;
  };
  offer: {
    financeID: string | null;
    acctNum: string | any;
    contractDate: ContractDate | null;
    financeAmt: number | null;
    installmentAmt: number | null;
    profit: number | null;
    annualProfit: number | null;
    fees: number | null;
    tenure: number | null;
  };
  productKey: string | null;
  cicNum: string | null;
  requestingBranch: string | null;
  contractDate: ContractDate | null;
  financeAmt: number | null;
  creditLine: CreditLine | any;
  initialOfferData: {
    vehicleGroupsLst: Array<VehicleGroup> | null;
    installmentsLst: InstallmentList | null;
    financialDetails: Array<FinancialDetails> | null;
  };
  uploadedQuotationData: Array<UploadQuotation> | null;
  vendorInfo: VendorInfo | null;
}
