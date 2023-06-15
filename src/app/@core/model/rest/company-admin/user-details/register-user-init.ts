import {BaseResponse} from "../../common/base-response";
import {Account} from "../../common/account";
import {
  GroupListAramcoPayments,
  GroupListBills,
  GroupListBusinessCards,
  GroupListCheckBook,
  GroupListCm,
  GroupListOthers,
  GroupListPayments,
  GroupListPrepaidCards,
  GroupListSadadInvoiceHub,
  GroupListTransfers
} from "./user-details-res";
import {BackEndAccountPrivileges} from "./user-operation-request";


export interface RegisterUserInit extends BaseResponse {
  nameAuthenticationMethod: string;
  backEndAccountPrivileges: BackEndAccountPrivileges;
  accountList: Account[];
  groupListOthers: GroupListOthers;
  groupListTransfers: GroupListTransfers;
  groupListBills: GroupListBills;
  groupListCM: GroupListCm;
  groupListCheckBook: GroupListCheckBook;
  groupListPayments: GroupListPayments;
  groupListMuqeem: any;
  groupListCrossCurrency: any;
  groupListSadadInvoiceHub: GroupListSadadInvoiceHub;
  groupListLockBox: any;
  groupListVirtualAccounts: any;
  groupListAramcoPayments: GroupListAramcoPayments;
  groupListBusinessCards: GroupListBusinessCards;
  groupListPrepaidCards: GroupListPrepaidCards;
  groupListFinanceProduct: any;
  unassignedHardSerialList: string[];
  unassignedSoftSerialList: string[];
  vaPermissions?: any;
  groupListPosReport: any;
  groupListEmCrey: any;
}

export interface EtradeFunction {
  etradeFunctionPk: number;
  functionId: string;
  active: boolean;
  descriptionAr: string;
  descriptionEn: string;
  status?: any;
  process?: any;
}

export interface CompanyEtradeWorkflow {
  companyEtradeWorkflowPk: number;
  amount: number;
  level: number;
}

export interface CompanyEtradeFunctionList {
  companyEtradeFunctionsPk: number;
  etradeFunction: EtradeFunction;
  limit: number;
  companyEtradeWorkflows: CompanyEtradeWorkflow[];
}

export interface CompanyDetails {
  companyEtradeFunctionList: CompanyEtradeFunctionList[];
  companyEtradeParameter?: any;
}

export interface EtradeCompanyDetails extends BaseResponse {
  companyDetails: CompanyDetails;
}



