import {Account} from "../../common/account";
import {RequestValidate} from "../../common/otp.model";
import {Group} from "../../common/Group";
import {Privilege} from "../../common/Privilege";

//Validate
export interface RequestUserManagementValidate {
  typeOperation: string;
  companyUser: CompanyUser
  listAccount: Account[];
  listWebSCIC?: ListWebScic[];
  selectedGroupList?: Group[];
  backEndAccountPrivileges: BackEndAccountPrivileges
  oldTokenSerial?: string;
  oldMobile?: string;
  containsCUAlertsGroup?: boolean;
  userEtradeFunctions: UserEtradeFunction[];
  profileNumber?: string
}

export interface CompanyUser {
  companyPk: number;
  maker: boolean
  checker: boolean
  nickName: string
  natIDExpiry: string
  language: string;
  userPk: number;
  empRef: string;
  ownacclimit: number;
  withinlimit: number;
  locallimit: number;
  internationallimit: number;
  qtlLimit: number;
  lastLoginDate: string;
  lastLoginTime: string;
  limit: number;
  limitSpent: number;
  dateLimitReset: string;
  accessLimited: boolean;
  accessFrom: string;
  accessTo: string;
  billPaymentLimit: number;
  sadadInvoiceHubLimit: number;
  governmentPaymentLimit: number;
  billLimitSpent: number;
  sadadInvoiceHubLimitSpent: number;
  governmentLimitSpent: number;
  billDateLimitReset: string;
  sadadInvoiceHubDateLimitReset: string;
  governmentDateLimitReset: string;
  alertsFeeAccount: string;
  fundLimit: number;
  fundLimitSpent: number;
  fundDateLimitReset: string;
  bulkLimit: number;
  bulkLimitSpent: number;
  bulkDateLimitReset: string;
  tokenSerial: string;
  tokenStatus: string;
  tokenSuccessLogin: number;
  tokenFailLogin: number;
  loginMethodType: string;
  tokenLanguage: string;
  passDelivery: string;
  userAuthenticationType: string;
  softTokenSubstatus: string;
  groups: string[];
  daysOfWeek: any[];
  cardDepartments: any[];
  vaPermissions: any[];
  tokenDevice: any
  companyQtlLimit: number;
  process: string;
  processStatus: string;
  urPayLimit: number;
  userId: string;
  blocked: string;
  firstLogin: boolean;
  tries: number;
  maxTries: number;
  questionTries: number;
  maxQuestionTries: number;
  userName: string;
  userNameArabic: string;
  nickname: string;
  status: string;
  type: string;
  idIqama: string;
  department: string;
  address: string;
  phone: string;
  mobile: string;
  secondMobile: string;
  email: string;
  secondEmail: string;
  nationality: string;
  region: string;
  city: string;
  expiryDate: string;
  issuingPlace: string;
  active: string;
  lastLogon: string;
  lastPasswordChange: string;
  userImage: string;
  authenticationMethod: string;
  passport: string;
  preferedLanguage: string;
  createdBy: string;
  idExpireDate: string;
  createdDate: string;
  birthDate: string;
  passwordExpired: boolean;
  tutorialDone: boolean;
  socialTwitter: string;
  socialFacebook: string;
  socialInstagram: string;
  socialLinkedin: string;
  userStatus: string;
  showSMSAlert: boolean;
}

export interface Company {
  companyPk: number;
  companyName: string;
  status: string;
  register: string;
  profilenumber: string;
  registrationDate: string;
  lastBranchAdmin: string;
  password: string;
  lastActionTimestamp: string;
  expiryDate: string;
  cicType: string;
  userIdOp: string;
  lastReturnCode: string;
  lastLogonInfo: string;
  newMessages: string;
  dueBills: string;
  civilianHijraExpiryDate: string;
  transferLimit: number;
  companyDetailsDTO: CompanyDetailsDto
  institution: string;
  institutionDescription: string;
  payrollCardsLayout: string;
  payrollCardsInstitutionType: string;
  payrollRegistered: boolean;
  payrollFileSystem: boolean;
  originatorId: string;
  companyLimits: number;
  directDebitAccount: string;
  authenticationMethod: string;
  tokenPrice: number;
  changeAuthMethodDate: string;
  organizationType: string;
  etradeReferenceId: string;
  samaId: string;
  bulkPaymentsRegistered: boolean;
  wpsPayrollRegistered: boolean;
  wpsPayrollFileSystem: boolean;
  wpsMolEstbid: string;
  blockUnblockReason: string;
  tokenMigrated: string;
  numTokens: number;
  numSTokenMigrations: number;
  olpRequestId: string;
  olpRegistered: boolean;
  olpAccount: string;
  payrollLayout: string;
  companyCode: string;
  companyCodeWps: string;
  bulkPaymentsParameters: BulkPaymentsParameters
  privileges: Privilege[];
  authDay: string;
  commissions: any[];
  vaClientId: string;
  lastUserLogin: string;
  companyHajjUmrah: any
  companyType: string;
  IPSTCStatus: string;
  dualAuthorization: boolean;
  fees: number;
  registrationAccount: string;
  lastCRNUpdate: string;
  idnumber: string;
  idType: string;
  adminResetPassNotification: boolean;
  vatnumber: string;
  vatTries: number;
  workflowType: string;
  ownAccountWorkflow: boolean;
  users: User[];
  branchPk: number;
  branchId: string;
  branchRbs5: string;
  branchLegacy5: string;
  branchName: string;
  branchNameEn: string;
  lgEnabled: boolean;
  lcEnabled: boolean;
  collecEnabled: boolean;
  branchInfo: {}
}

export interface User {
  empRef: string;
  secondPwd: string;
  ownacclimit: number;
  withinlimit: number;
  locallimit: number;
  internationallimit: number;
  lastLoginDate: string;
  lastLoginTime: string;
  limit: number;
  limitSpent: number;
  dateLimitReset: string;
  accessLimited: boolean;
  accessFrom: string;
  accessTo: string;
  mailAddress: string;
  mailPassword: string;
  billPaymentLimit: number;
  sadadInvoiceHubLimit: number;
  governmentPaymentLimit: number;
  billLimitSpent: number;
  sadadInvoiceHubLimitSpent: number;
  governmentLimitSpent: number;
  billDateLimitReset: string;
  sadadInvoiceHubDateLimitReset: string;
  governmentDateLimitReset: string;
  alertsFeeAccount: string;
  fundLimit: number;
  fundLimitSpent: number;
  fundDateLimitReset: string;
  bulkLimit: number;
  bulkLimitSpent: number;
  bulkDateLimitReset: string;
  urPayLimit: number;
  tokenSerial: string;
  tokenStatus: string;
  tokenSuccessLogin: number;
  tokenFailLogin: number;
  loginMethodType: string;
  tokenLanguage: string;
  passDelivery: string;
  userAuthenticationType: string;
  groups: string[];
  softTokenSubstatus: string;
  companyProfilenumber: string;
  daysOfWeek: any[];
  cardDepartments: any[];
  vaPermissions: any[];
  tokenDevice: {}
  userImage: string;
  qtlLimit: number;
  randomPasswordGeneratedDate: string;
  process: string;
  processStatus: string;
  companyPk: number;
  userPk: number;
  userId: string;
  blocked: string;
  firstLogin: boolean;
  password: string;
  tries: number;
  maxTries: number;
  userName: string;
  userNameArabic: string;
  nickname: string;
  status: string;
  type: string;
  idIqama: string;
  department: string;
  address: string;
  phone: string;
  mobile: string;
  secondMobile: string;
  email: string;
  secondEmail: string;
  nationality: string;
  region: string;
  city: string;
  expiryDate: string;
  issuingPlace: string;
  active: string;
  socialTwitter: string;
  socialFacebook: string;
  socialInstagram: string;
  socialLinkedin: string;
  lastPasswordChange: string;
  createdDate: string;
  createdBy: string;
  passport: string;
  preferedLanguage: string;
  birthDate: string;
  userStatus: string;
  questionTries: number;
  maxQuestionTries: number;
  tutorialDone: boolean;
  blockedBy: string;
  showSMSAlert: boolean;
  rtpNotification: boolean;
  authenticationMethod: string;
  offset: number;
  max: number;
  orders: any[];
  sessionInfo: any;
  typeUser:string;
}

export interface ListWebScic {
  checked: boolean;
  checked2: boolean;
  company: Company
}

export interface CompanyDetailsDto {
  customerName1: string;
  customerName2: string;
  juridicalState: string;
  idnumber: string;
  title: string;
  cicSponsor: string;
  language: string;
  customerType: string;
  documentnumber: string;
  issuePlace: string;
  issueDate: string;
  phonenumber: string;
  faxnumber: string;
  email: string;
  expiryDate: string;
  nationalAddressFlag: string;
}

export interface BulkPaymentsParameters {
  bulkPaymentsPk: number;
  companyPk: number;
  bulkPaymentsRegistered: string;
  bulkPaymentsFileSystem: string;
  bulkPaymentsCode: string;
  bulkPaymentsUserFolder: string;
}

export interface BackEndAccountPrivileges {
  privilegesDirectDebits: boolean[];
  privilegesBeneficiariesWithin: boolean[];
  privilegesBeneficiariesLocal: boolean[];
  privilegesBeneficiariesInternational: boolean[];
  privilegesPayrollCards: boolean[];
  privilegesLetterGuarantee: boolean[];
  privilegesHajjUmrahCards: boolean[];
  privilegesPosManagement: boolean[];
  privilegesBillAdd: boolean[];
  privilegesBalanceCertificate: boolean[];
  privilegesChecks: boolean[];
  privilegesPositivePay: boolean[];
  directDebitsPrivilege: boolean;
  payrollCardsPrivilege: boolean;
  beneficiariesWithinPrivilege: boolean;
  beneficiariesLocalPrivilege: boolean;
  beneficiariesInternationalPrivilege: boolean;
  letterGuaranteePrivilege: boolean;
  hajjUmrahCardsPrivilege: boolean;
  posManagementPrivilege: boolean;
  billAddPrivilege: boolean;
  balanceCertificatePrivilege: boolean;
  checksPrivilege: boolean;
  positivePayPrivilege: boolean;
}

export interface UserEtradeFunction {
  userEtradeFunctionsPk: number;
  etradeFunction: EtradeFunction
  level: number;
  initiator: boolean;
}

export interface EtradeFunction {
  etradeFunctionPk: number;
  functionId: string;
  active: boolean;
  descriptionAr: string;
  descriptionEn: string;
  status: string;
  process: string;
}

//confirm


export interface RequestUserManagementConfirm {
  user: User;
  requestValidate: RequestValidate;
}
