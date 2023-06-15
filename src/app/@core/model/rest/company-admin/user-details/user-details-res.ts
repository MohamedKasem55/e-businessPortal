import {BaseResponse} from "../../common/base-response";
import {CompanyUser} from "./user-operation-request";
import {Account} from "../../common/account";
import {Group} from "../../common/Group";

export interface UserDetailsRes extends BaseResponse {
  userPk: number
  companyUserDetails: CompanyUser;
  bloked: boolean
  containsCUAlertsGroup: boolean
  groupListOthers: GroupListOthers | any
  groupListTransfers: GroupListTransfers | any
  groupListBills: GroupListBills | any
  groupListCM: GroupListCm | any
  groupListCheckBook: GroupListCheckBook | any
  groupListPayments: GroupListPayments | any
  groupListMuqeem: {}
  groupListCrossCurrency: {}
  groupListSadadInvoiceHub: GroupListSadadInvoiceHub | any
  groupListLockBox: {}
  groupListVirtualAccounts: {}
  groupListAramcoPayments: GroupListAramcoPayments | any
  groupListBusinessCards: GroupListBusinessCards | any
  groupListPrepaidCards: GroupListPrepaidCards | any
  groupListFinanceProduct: {}
  groupListCustomizeReport: GroupListCustomizeReport | any
  userImage: string
  userEtradeFunctions: any[]
  groupListEmCrey: {}
  showBillPaymentLimit: boolean
  showGovernmentPaymentLimit: boolean
  showOwnAccountLimit: boolean
  showMutualFundLimit: boolean
  oldMobile: string
  checkaccountlist: Account[]
  checksubciclist: any[]
  selectPrivilegeIndex: string[]
  backEndAccountPrivileges: BackEndAccountPrivileges
  unassignedHardSerialList: string[]
  unassignedSoftSerialList: string[]
}

export interface GroupListOthers {
  AccountNicknameGroup: Group
  BalanceCertificateGroup: Group
  CcGroup: Group
  CCSecurityGroup: Group
  DailyMT940Group: Group
  InquiryGroup: Group
  IPS: Group
  MADAQueryCardCredentials: Group
  MonthlyMT940Group: Group
  PosStatementGroup: Group
  PosTerminalGroup: Group
  ServGroup: Group
  VatMonthlyReportGroup: Group
}


export interface GroupListTransfers {
  GovRevenueGroup: Group
  OrdGroup: Group
  TfGroup: Group
  TfLocalGroup: Group
  TfOwnGroup: Group
  TfRemGroup: Group
  URPayGroup: Group
  rtpGroup: Group
}

export interface GroupListBills {
  BillPayGroup: Group
}

export interface GroupListCm {
  CMPoolingGroup: Group
  CMReportGroup: Group
  CMSweepingGroup: Group
}

export interface GroupListCheckBook {
  RequestCheckBookGroup: Group
  StopCheckBookGroup: Group
}

export interface GroupListPayments {
  BulkPaymentsFileCancellationGroup: Group
  BulkPaymentsGroup: Group
  EgovGroup: Group
  PayrollFileCancellationGroup: Group
  PayrollGroup: Group
  WPSPayrollGroup: Group
}

export interface GroupListSadadInvoiceHub {
  SadadInvoiceHubGroup: Group
}

export interface GroupListAramcoPayments {
  AramcoPaymentsGroup: Group
}

export interface GroupListBusinessCards {
  BusinessCardsActivate: Group
  BusinessCardsBlock: Group
  BusinessCardsBlockReplace: Group
  BusinessCardsDisplay: Group
  BusinessCardsManagementPIN: Group
  BusinessCardsPayments: Group
  BusinessQueryCardCredentials: Group
}

export interface GroupListPrepaidCards {
  PrepaidCardsClosureRequestReplacementGroup: Group
  PrepaidCardsDisplayGroup: Group
  PrepaidCardsLostStolenGroup: Group
  PrepaidCardsPaymentsGroup: Group
  PrepaidCardsRequestActivateGroup: Group
  PrepaidCardsSetResetPINGroup: Group
  PrepaidQueryCardCredentials: Group
}

export interface GroupListCustomizeReport {
  CustomizeReportGroup: Group
}


export interface BackEndAccountPrivileges {
  privilegesDirectDebits: boolean[]
  privilegesBeneficiariesWithin: boolean[]
  privilegesBeneficiariesLocal: boolean[]
  privilegesBeneficiariesInternational: boolean[]
  privilegesPayrollCards: boolean[]
  privilegesLetterGuarantee: boolean[]
  privilegesHajjUmrahCards: boolean[]
  privilegesPosManagement: boolean[]
  privilegesBillAdd: boolean[]
  privilegesBalanceCertificate: boolean[]
  privilegesChecks: boolean[]
  privilegesPositivePay: boolean[]
  directDebitsPrivilege: boolean
  payrollCardsPrivilege: boolean
  beneficiariesWithinPrivilege: boolean
  beneficiariesLocalPrivilege: boolean
  beneficiariesInternationalPrivilege: boolean
  letterGuaranteePrivilege: boolean
  hajjUmrahCardsPrivilege: boolean
  posManagementPrivilege: boolean
  billAddPrivilege: boolean
  balanceCertificatePrivilege: boolean
  checksPrivilege: boolean
  positivePayPrivilege: boolean
}
