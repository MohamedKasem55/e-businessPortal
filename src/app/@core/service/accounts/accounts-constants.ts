export class AccountsConstants {
  static ACCOUNTS_STATEMENT = 'accountsStatements/search';
  static ACCOUNTS_STATEMENT_PDF = 'accountsStatements/pdf';
  static ACCOUNTS = 'accounts';
  static ACCOUNTS_STATEMENTS_DTLS = 'accountsStatements/detail';
  static ACCOUNTS_STATEMENTS_SEND_DETAIL_MAIL =
    'accountsStatements/sendDetailMail';
  static ACCOUNTS_STATEMENTS_SEND_DETAIL_PDF = 'accountsStatements/pdfDetail';

  static JURIDICAL_STATUS = 'companyDetails/juridicalState';
  static SAR_ACCOUNTS = 'userProfile/getSARAccounts';

  static MAIN_ACCOUNTS = 'posStatementCU/account/accountMain';

  /**
   * Documents APIS
   * */

  static CUSTOMER_DOCS_List = 'custDocs/listCustDocRequests';
  static DOC_ELIGIBILITY = 'custDocs/eligibilityInq/';
  static CREATE_CUST_DOC = 'custDocs/createCustDocRequest';
  static GET_CUST_DOC = 'custDocs/downloadDocument/';
  /**
   *
   * Monthly Statement APIs
   *
   * */

  static MONTHLY_ACCOUNT_STATEMENTS = 'accountsStatements/monthly'
  static DOWNLOAD_MONTHLY_ACCOUNT_STATEMENTS = 'accountsStatements/monthly/download'
  static REQUESTED_ACCOUNT_STATEMENTS = 'accountsStatements/requested/list'
  static DOWNLOAD_REQUESTED_ACCOUNT_STATEMENTS = 'accountsStatements/requested/download'
  static DELETE_REQUESTED_ACCOUNT_STATEMENTS = 'accountsStatements/requested/delete'
  /**
   * Requested Statement
   * */
  static REQUEST_NEW_STATEMENT = "accountsStatements/requested/new"

  /**
   *
   * Balance Certificate APIs
   *
   * */

  static BALANCE_CERTIFICATE_STATEMENTS = 'balanceCertificate/list';
  static BALANCE_CERTIFICATE_VALIDATE = 'balanceCertificate/validate';
  static BALANCE_CERTIFICATE_CONFIRM = 'balanceCertificate/confirm';
  static BALANCE_CERTIFICATE_LIST = "balanceCertificate/requestStatus/list"
  /**
   * VAT Invoice
   * */
  static VAT_MONTHLY_REPORT = 'vatMonthly/report/';

  /**
   * SWIFT Statement
   * */
  static SWIFT_STATEMENTS_INIT = 'swiftStatements/init';
  static SWIFT_STATEMENTS_DOWNLOAD = 'swiftStatements/download';
  /**
   * CONSTANTS
   * */
  static DOCUMENT_TYPES = {
    docTypes: {
      '01': 'Bank Certificate',
      '02': 'Account Statement',
      '05': 'IBAN Certificate',
    },
  };
  static DOCUMENTS_STATUS = {
    status: {
      '01': 'Approved',
      '02': 'Rejected',
      '03': 'Pending',
      '04': 'Expired',
      '05': 'Failed',
    },
  };
  static PERIOD_TYPES = [
    {
      id: 2,
      text: 'accounts.curr-month',
    },
    {
      id: 3,
      text: 'accounts.six-month',
    },
  ];
  /**
   * nickname update
   * */
  static NICKNAME_UPDATE = 'accounts/nicknameUpdate';
  /**
   * ADD Account
   * */
  static ELIGIBILITY_INQUIRY = 'accounts/eligibilityInquiry';
  static CREATE_VALIDATE = 'accounts/createAccount/validate';
  static CREATE_CONFIRM = 'accounts/createAccount/confirm';

  /* BFM */
  static CONNECTED_TPP="tpp/financialInstitutions";
  static FINANCIAL_INSTITUTIONS="tpp/financialInstitutions";
  static DATA_GROUP="tpp/dataGroups";
}
