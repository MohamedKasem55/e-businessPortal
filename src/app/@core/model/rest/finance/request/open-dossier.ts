

export interface OpenDossierRes {
  dossierID: string
  accountNumber: string
  dossierType: string
  financeProductCode: string
  posBusinessDataDetailsl: PosBusinessDataDetailsl
}

export interface PosBusinessDataDetailsl {
  contactPersonName: string
  email: string
  intDialCode: string
  mobileNumber: string
  firstRePymtDate: string
  rePymtPeriod: number
  simahAuth: boolean
  businessOutletsNum: number
  businessOutletsType: string
  businessModelSalesDesc: string
  businessLocation: string
  businessActivities: string
  businessType: string
  establishmentDate: string
  sector: Sector
  subSector: SubSector
  industry: Industry
  terminalsNumber: number
  posStartDate: string
  fromCortexFlg: boolean
  termCortexNumber: number
  termCortexDate: string
  facilityLst: FacilityLst[]
  keyFinancialInfo: KeyFinancialInfo[]
}

export interface Sector {
  key: string
  value: string
}

export interface SubSector {
  key: string
  value: string
}

export interface Industry {
  key: string
  value: string
}

export interface FacilityLst {
  facilityType: string
  product: string
  amt: number
  usageAmt: number
  totalOutstandingAmt: number
  bankDesc: BankDesc
}

export interface BankDesc {
  key: string
  value: string
}

export interface KeyFinancialInfo {
  fromDate: FromDate
  toDate: ToDate
  acctType: string
  salesTurnOver: number
  grossProfit: number
  netProfit: number
  fullYearAcct: boolean
  years: string
}

export interface FromDate {
  hijriDate: boolean
  startDate: string
  timestamp: string
}

export interface ToDate {
  hijriDate: boolean
  startDate: string
  timestamp: string
}
