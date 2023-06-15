import {JuridicalStatusValue} from "../model/rest/common/juridical-status-value-enum";
import {CompanyWorkflowTypeEnum} from "../model/rest/company-admin/workflow/company-workflow-type-enum";
import {environment} from "../../../environments/environment";

export class AuthenticationUtils {

  public static get isCompanyAdmin(): boolean {
    return this.userHasAnyGroup(['CompanyAdmins'])
  }

  public static get isSolePropertyCompany(): boolean {
    return (sessionStorage.getItem("ownershipType")!.length > 0 &&
      (JuridicalStatusValue.SOLE === sessionStorage.getItem("ownershipType")!));
  }

  public static get isBasic(): boolean {
    return JSON.parse(sessionStorage.getItem('company')!).companyWorkflowType === CompanyWorkflowTypeEnum.BASIC;
  }

  public static get isMakerChecker(): boolean {
    return JSON.parse(sessionStorage.getItem('company')!).companyWorkflowType === CompanyWorkflowTypeEnum.MAKER_CHECKER;
  }

  public static get isWorkflow(): boolean {
    let companyWorkflowType = JSON.parse(sessionStorage.getItem('company')!).companyWorkflowType;
    return !(companyWorkflowType === CompanyWorkflowTypeEnum.MAKER_CHECKER || companyWorkflowType === CompanyWorkflowTypeEnum.BASIC);
  }

  public static get isChecker(): boolean {
    let companyWorkflowType = JSON.parse(sessionStorage.getItem('company')!).companyWorkflowType;
    if (companyWorkflowType === CompanyWorkflowTypeEnum.MAKER_CHECKER) {
      return JSON.parse(sessionStorage.getItem('user')!).checker
    }
    return false;
  }

  public static get showQTL(): boolean {
    return (this.isBasic || this.isMakerChecker) && this.isCompanyAdmin && this.isSolePropertyCompany
      && this.serviceIsActive('SetupCompanyQtlLimits');
  }

  public static get showPendingActions(): boolean {
    return this.isWorkflow || this.isChecker;

  }

  public static canActive(
    service: string,
    privilege: string[],
    listGroup: string[],
  ): boolean {
    const activeService = this.serviceIsActive(service)
    const activePrivilege = this.hasPrivilege(privilege)
    const activeGroup = this.userHasAnyGroup(listGroup)
    if (activeService) {
      if (activePrivilege) {
        if (activeGroup) {
          return true
        }
      }
    }
    return false
  }

  public static serviceIsActive(service: string): boolean {
    let result = false
    const services = JSON.parse(sessionStorage.getItem('services')!);
    if (services) {
      if (services.items[service]) {
        result = services.items[service]
      }
    }
    return result
  }

  public static hasPrivilege(privilegesList: string[]): boolean {
    if (privilegesList === null || privilegesList.length === 0) {
      return true
    }
    let result = false
    const privileges = JSON.parse(sessionStorage.getItem('privilegesAuth')!);
    if (privileges) {
      for (const pr of privilegesList) {
        if (privileges.items[pr]) {
          result = true
        }
      }
    }
    return result
  }

  public static userHasAnyGroup(groupList: string[]): boolean {
    let result = false
    if (groupList === null || groupList.length === 0) {
      return true
    }
    const groups = JSON.parse(sessionStorage.getItem('groups')!);
    if (groups) {
      for (const _group of groupList) {
        if (groups.items[_group]) {
          result = true
        }
      }
    }
    return result
  }

  public static hasAccess(service: string): boolean {

    let flag: boolean

    switch (service) {

      case 'AccountsManagement':
        flag = this.canActive(
          'AccountsManagement',
          [],
          [
            'BalanceCertificateGroup',
            'RequestCheckBookGroup',
            'InquiryGroup',
            'PosStatementGroup',
          ]
        );
        break;

      case 'CardsManagement':
        flag = this.canActive(
          'CardsManagement',
          [],
          [
            'BusinessCardsDisplay',
            'BusinessCardsPayments',
            'BusinessCardsActivate',
            'BusinessCardsManagementPIN',
            'BusinessCardsBlock',
            'BusinessCardsBlockReplace',
            'CompanyAdmins',
            'PrepaidCardsDisplayGroup',
            'PrepaidCardsRequestActivateGroup',
            'PrepaidCardsPaymentsGroup',
          ],
        );
        break;

      case 'CardsRequestStatus':
        flag = this.hasAccess('BusinessCardsRequestStatus') || this.hasAccess('DebitCardsMenu') || this.hasAccess('CreditCardsMenu') || this.hasAccess('PrepaidCardsStatus');
        break;

      case 'applyForCards':
        flag = this.hasAccess('RequestNewPrepaidCard') ||
          this.hasAccess('RequestNewDebitCard');
        break;

      case 'TransfersManagement':
        flag = this.canActive(
          'TransfersManagement',
          [],
          [],
        );
        break;

      case 'TransfersUserApproval':
        flag = this.hasAccess('TransferRequestStatus') || this.hasAccess('BeneficiaryRequestStatus') ||
          this.hasAccess('StandingOrderRequestStatus') || this.hasAccess('BulkPaymentsRequestStatus');
        break;

      case 'PaymentsManagement':
        flag = this.canActive(
          'PaymentsManagement',
          [
            'ARAMCOPAYMENTS_PRIVILEGE',
            'GOVERNMENTREVENUE_PRIVILEGE',
            'HAJJUMRAHCARDS_PRIVILEGE',
          ],
          [
            'AramcoPaymentsGroup',
            'GovRevenueGroup',
            'GovRevenueBulkUploadGroup',
            'GovRevenueGroupAdmin',
            'HajjUmrahCardsGroup',
          ],
        );
        break;

      case 'PaymentsRequestStatus':
        flag = this.hasAccess('BillRequestStatus') || this.hasAccess('MOIRequestStatus') ||
          this.hasAccess('MOIRefunds') || this.hasAccess('EsalRequestStatus') || this.hasAccess('AramcoPaymentRequestStatus');
        break;

      case 'PaymentsProcessedTransactions':
        flag = this.hasAccess('BillDashboard') || this.hasAccess('MOIPaymentMenu') ||
          this.hasAccess('MOIRefunds') || this.hasAccess('EsalMenu');
        break;

      case 'PaymentsFeedbackFiles':
        flag = this.hasAccess('BillFeedBackFiles') || this.hasAccess('EsalFeedBackFiles') ||
          this.hasAccess('MOIFeedBackFiles');
        break;

      case 'PayrollManagement':
        flag = this.canActive(
          'PayrollManagement',
          [
            'PAYROLL_PRIVILEGE',
            'WPSPAYROLL_PRIVILEGE',
            'WMSPAYROLL_PRIVILEGE',
            'PAYROLLCARDS_PRIVILEGE',
          ],
          [
            'PayrollGroup',
            'WPSPayrollGroup',
            'WMSPayrollGroup',
            'PayrollCardsGroup',
          ],
        );
        break;

      case 'FinanceProduct':
        flag = this.canActive(
          'FinanceProduct',
          [],
          ['CompanyAdmins'],
        );
        break;

      case 'POSFinanceProduct':
        flag = this.hasAccess('FinanceProduct') && this.canActive(
          'POSFinanceProduct',
          ['POS_FINANCE_PRIVILEGE'],
          ['CompanyAdmins'],
        );
        break;

      case 'BusinessFinanceManager':
        flag = this.isSolePropertyCompany && this.canActive(
          'BusinessFinanceManagement',
          [],
          ['CompanyAdmins']);
        break;

      case 'AdminManagement':
        flag = this.canActive(
          'AdminManagement',
          [],
          ['CompanyAdmins'],
        );
        break;

      case 'RepresentativesManagement':
        flag = this.canActive(
          'RepresentativesManagement',
          [],
          ['CompanyAdmins'],
        );
        break;

      case 'BusinessHub':
        flag = this.canActive(
          'BusinessHub',
          [],
          ['CompanyAdmins'],
        );
        break;

      case 'CollectionsManagement':
        flag = this.canActive(
          'CollectionsManagement',
          [],
          [
            'DirectDebitsGroup',
            'PosStatementGroup',
            'VirtualAccountsGroup',
            'LockboxGroupStatement',
            'LockboxTerminalList',
            'CustomizeReportGroup',
            'CompanyAdmins'
          ],
        );
        break;

      case 'GoldWallet':
        flag = this.canActive('GoldWallet', [], ['CompanyAdmins']);
        break;

      case 'CashManagementProducts':
        flag = this.canActive(
          'CashManagementProducts',
          [],
          [],
        );
        break;

      case 'AccountsMenu':
        flag = this.canActive(
          'AccountsMenu',
          [],
          ['InquiryGroup'],
        );
        break;

      case 'AccountsStatement':
        flag = this.canActive(
          'AccountsStatement',
          [],
          ['InquiryGroup'],
        );
        break;

      case 'AccountsNickName':
        flag = this.canActive(
          'AccountsNickName',
          [],
          ['AccountNicknameGroup']);
        break;

      case 'AddAccount':
        flag = this.userHasAnyGroup(['CompanyAdmins']);
        break;

      case 'documents':
        flag = this.userHasAnyGroup([
          'CompanyAdmins',
          'InquiryGroup',]) || this.canActive(
          'BalanceCertificateMenu',
          [],
          ['BalanceCertificateGroup'],
        ) || this.canActive(
          'SwiftMt940Statement',
          [],
          ['DailyMT940Group', 'MonthlyMT940Group'],
        );
        break;

      case 'BalanceCertificateMenu':
        flag = this.canActive(
          'BalanceCertificateMenu',
          [],
          ['BalanceCertificateGroup'],
        );
        break;

      case 'SwiftMt940Statement':
        flag = this.canActive(
          'SwiftMt940Statement',
          [],
          ['DailyMT940Group', 'MonthlyMT940Group'],
        );
        break;

      case 'request-documents':
        flag = (this.hasAccess('AccountsMenu') &&
          (this.hasAccess('SwiftMt940Statement') ||
            this.hasAccess('BalanceCertificateMenu') ||
            this.isCompanyAdmin
          ));
        break;

      case 'BalanceCertificateRequestStatus':
        flag = this.canActive(
          'BalanceCertificateRequestStatus',
          [],
          ['BalanceCertificateGroup'],
        );
        break;

      case 'TaxInvoice':
        flag = this.canActive(
          'TaxInvoice',
          [],
          ['VatMonthlyReportGroup'],
        );
        break;

      case 'ChequeManagement':
        flag = this.canActive(
          'ChequeManagement',
          [],
          [
            'RequestCheckBookGroup',
            'StopCheckBookGroup',
            'PositivePayCheckGroup',
          ],
        );
        break;

      case 'companyAdmin':
        flag = this.isCompanyAdmin;
        break;

      case 'PrepaidCardsMenu':
        flag = this.canActive(
          'PrepaidCardsMenu',
          ['PREPAID_CARDS_PRIVILEGE'],
          ['PrepaidCardsDisplayGroup']
        );
        break;

      case 'PayPrepaidCard':
        flag = this.canActive(
          'PrepaidCardsMenu',
          ['PREPAID_CARDS_PRIVILEGE'],
          ['PrepaidCardsPaymentsGroup']
        );
        break;

      case 'ActivatePrepaidCard':
        flag = this.canActive(
          'PrepaidCardsMenu',
          ['PREPAID_CARDS_PRIVILEGE'],
          ['PrepaidCardsRequestActivateGroup']
        );
        break;

      case 'PrepaidCardsClosureRequestReplacement':
        flag = this.canActive(
          'PrepaidCardsMenu',
          ['PREPAID_CARDS_PRIVILEGE'],
          ['PrepaidCardsClosureRequestReplacementGroup']
        );
        break;

      case 'GoLostStolenPrepaidCard':
        flag = this.canActive(
          'PrepaidCardsManage',
          ['PREPAID_CARDS_PRIVILEGE'],
          ['PrepaidCardsLostStolenGroup']
        );
        break;

      case 'ViewCredentialsPrepaidCard':
        flag = this.canActive(
          'PrepaidCardsMenu',
          ['PREPAID_CARDS_PRIVILEGE'],
          ['PrepaidQueryCardCredentials']
        );
        break;

      case 'RequestNewPrepaidCard':
        flag = this.canActive(
          'PrepaidCardsRequest',
          ['PREPAID_CARDS_PRIVILEGE'],
          ['CompanyAdmins']
        );
        break;

      case 'PrepaidCardsStatus':
        flag = this.canActive(
          'PrepaidCardsStatus',
          ['PREPAID_CARDS_PRIVILEGE'],
          ['PrepaidCardsPaymentsGroup']
        );
        break;

      case 'ManagePINPrepaidCard':
        flag = this.canActive(
          'PrepaidCardsMenu',
          ['PREPAID_CARDS_PRIVILEGE'],
          ['PrepaidCardsSetResetPINGroup']
        );
        break;

      case 'DebitCardsMenu':
        flag = this.canActive(
          'DebitCardsMenu',
          [],
          ['CompanyAdmins']
        );
        break;

      case 'ListDebitCards':
        flag = this.canActive(
          'DebitCardsList',
          [],
          ['CompanyAdmins']
        );
        break;

      case 'ViewCredentialsDebitCard':
        flag = this.canActive(
          'DebitCardsList',
          [],
          ['MADAQueryCardCredentials']
        );
        break;

      case 'RequestNewDebitCard':
        flag = this.canActive(
          'DebitCardsRequest',
          [],
          ['CompanyAdmins']
        );
        break;

      case 'CreditCardsMenu':
        flag = this.canActive(
          'CreditCardsMenu',
          [],
          ['CcGroup']
        );
        break;

      case 'CreditCardsActivate':
        flag = this.canActive(
          'CreditCardsActivate',
          [],
          ['CcGroup']
        );
        break;

      case 'BusinessCardsMenu':
        flag = this.canActive(
          'BusinessCardsMenu',
          ['BUSINESS_CARDS_PRIVILEGE'],
          ['BusinessCardsDisplay']
        );
        break;

      case 'ViewCredentialsBusinessCards':
        flag = this.canActive(
          'BusinessCardsDisplay',
          ['BUSINESS_CARDS_PRIVILEGE'],
          ['BusinessQueryCardCredentials']
        );
        break;

      case 'PayBusinessCards':
        flag = this.canActive(
          'BusinessCardsMenu',
          ['BUSINESS_CARDS_PRIVILEGE'],
          ['BusinessCardsPayments']
        );
        break;

      case 'ActivateBusinessCards':
        flag = this.canActive(
          'BusinessCardsMenu',
          ['BUSINESS_CARDS_PRIVILEGE'],
          ['BusinessCardsActivate']
        );
        break;

      case 'ManagePINBusinessCards':
        flag = this.canActive(
          'BusinessCardsMenu',
          ['BUSINESS_CARDS_PRIVILEGE'],
          ['BusinessCardsManagementPIN']
        );
        break;

      case 'BlockReplaceBusinessCards':
        flag = this.canActive(
          'BusinessCardsMenu',
          ['BUSINESS_CARDS_PRIVILEGE'],
          ['BusinessCardsBlockReplace']
        );
        break;

      case 'BlockBusinessCards':
        flag = this.canActive(
          'BusinessCardsMenu',
          ['BUSINESS_CARDS_PRIVILEGE'],
          ['BusinessCardsBlock']
        );
        break;

      case 'BusinessCardsRequestStatus':
        flag = this.canActive(
          'BusinessCardsRequestStatus',
          ['BUSINESS_CARDS_PRIVILEGE'],
          ['BusinessCardsDisplay', 'BusinessCardsPayments'],
        );
        break;

      case 'AlRajhiTransfer' :
        flag = this.canActive(
          'TransferAlRajhi',
          ['TRANSFER_PRIVILEGE'],
          ['TfGroup']);
        break;

      case 'LocalTransfer' :
        flag = this.canActive(
          'TransferLocal',
          ['TRANSFER_PRIVILEGE_LOCALBANK'],
          ['TfLocalGroup']);
        break;

      case 'TransferProcessedTransaction' :
        flag = this.canActive(
          'TransferProcessedTransaction',
          [
            'TRANSFER_PRIVILEGE_OWNACCOUNTS',
            'TRANSFER_PRIVILEGE_LOCALBANK',
            'TRANSFER_PRIVILEGE_LOCALBANK',
            'TRANSFER_PRIVILEGE_REMITTANCES',
          ],
          ['TfOwnGroup', 'TfGroup', 'TfRemGroup', 'TfLocalGroup'],
        );
        break;

      case 'TransferRequestStatus' :
        flag = this.canActive(
          'TransferRequestStatus',
          [
            'TRANSFER_PRIVILEGE_OWNACCOUNTS',
            'TRANSFER_PRIVILEGE_LOCALBANK',
            'TRANSFER_PRIVILEGE_LOCALBANK',
            'TRANSFER_PRIVILEGE_REMITTANCES',
          ],
          ['TfOwnGroup', 'TfGroup', 'TfRemGroup', 'TfLocalGroup'],
        );
        break;

      case 'InternationalTransfer' :
        flag = this.canActive(
          'TransferInternational',
          ['TRANSFER_PRIVILEGE_REMITTANCES'],
          ['TfRemGroup']);
        break;

      case 'QuickTransfer' :
        flag = this.canActive(
          'TransferLocal',
          ['TRANSFER_PRIVILEGE_LOCALBANK'],
          ['TfLocalGroup']);
        break;

      case 'BetweenAccounts' :
        flag = this.canActive(
          'TransferOwn',
          ['TRANSFER_PRIVILEGE_OWNACCOUNTS'],
          ['TfOwnGroup']);
        break;

      case 'StandingOrders' :
        flag = this.canActive(
          'StandingOrderMenu',
          ['STANDORD_PRIVILEGE'],
          ['OrdGroup']);
        break;

      case 'StandingOrderList' :
        flag = this.canActive(
          'StandingOrderList',
          ['STANDORD_PRIVILEGE'],
          ['OrdGroup'],
        );
        break;

      case 'StandingOrderRequestStatus' :
        flag = this.canActive(
          'StandingOrderRequestStatus',
          ['STANDORD_PRIVILEGE'],
          ['OrdGroup'],
        );
        break;

      case 'BulkPaymentsMenu' :
        flag = this.canActive(
          'BulkPaymentsMenu',
          [],
          []);
        break;

      case 'BulkPaymentsSelfOnboarding' :
        flag = this.hasAccess('BulkPaymentsMenu') && this.canActive(
          'BulkPaymentsSelfOnboarding',
          [],
          ['CompanyAdmins'],
        );
        break;

      case 'BulkUploadFile' :
        flag = this.hasAccess('BulkPaymentsMenu') && this.canActive(
          'BulkUploadFile',
          ['BULKPAYMENTS_PRIVILEGE'],
          ['BulkPaymentsGroup'],
        );
        break;

      case 'BulkProcessedFiles' :
        flag = this.hasAccess('BulkPaymentsMenu') && this.canActive(
          'BulkProcessedFiles',
          ['BULKPAYMENTS_PRIVILEGE'],
          ['BulkPaymentsGroup'],
        );
        break;

      case 'BulkPaymentsRequestStatus' :
        flag = this.hasAccess('BulkPaymentsMenu') && this.canActive(
          'BulkPaymentsRequestStatus',
          ['BULKPAYMENTS_PRIVILEGE'],
          ['BulkPaymentsGroup'],
        );
        break;

      case 'BulkDownloadTemplates' :
        flag = this.hasAccess('BulkPaymentsMenu') && this.canActive(
          'BulkDownloadTemplates',
          ['BULKPAYMENTS_PRIVILEGE'],
          ['BulkPaymentsGroup'],
        );
        break;

      case 'UrpayTransfer' :
        flag = this.canActive(
          'URPayService',
          ['TRANSFER_PRIVILEGE_LOCALBANK'],
          ['CompanyAdmins', 'URPayGroup']);
        break;

      case 'VisaB2BTransfer' :
        flag = false;
        break;

      case 'Beneficiaries' :
        flag = this.canActive(
          'BeneficiariesMenu',
          [
            'TRANSFER_PRIVILEGE_OWNACCOUNTS',
            'TRANSFER_PRIVILEGE_LOCALBANK',
            'TRANSFER_PRIVILEGE_LOCALBANK',
            'TRANSFER_PRIVILEGE_REMITTANCES',
          ],
          ['TfRemGroup', 'TfLocalGroup', 'TfGroup']);
        break;

      case 'BeneficiaryList' :
        flag = this.canActive(
          'BeneficiaryList',
          [
            'TRANSFER_PRIVILEGE_OWNACCOUNTS',
            'TRANSFER_PRIVILEGE_LOCALBANK',
            'TRANSFER_PRIVILEGE_LOCALBANK',
            'TRANSFER_PRIVILEGE_REMITTANCES',
          ],
          ['TfRemGroup', 'TfLocalGroup', 'TfGroup'],
        );
        break;

      case 'BeneficiaryAdd' :
        flag = this.canActive(
          'BeneficiaryAdd',
          [
            'TRANSFER_PRIVILEGE_OWNACCOUNTS',
            'TRANSFER_PRIVILEGE_LOCALBANK',
            'TRANSFER_PRIVILEGE_LOCALBANK',
            'TRANSFER_PRIVILEGE_REMITTANCES',
          ],
          ['TfRemGroup', 'TfLocalGroup', 'TfGroup'],
        );
        break;

      case 'BeneficiaryRequestStatus' :
        flag = this.canActive(
          'BeneficiaryRequestStatus',
          [
            'TRANSFER_PRIVILEGE_OWNACCOUNTS',
            'TRANSFER_PRIVILEGE_LOCALBANK',
            'TRANSFER_PRIVILEGE_REMITTANCES',
          ],
          ['TfRemGroup', 'TfLocalGroup', 'TfGroup'],
        );
        break;

      case 'TransferManagement' :
        flag = false;
        break;

      case 'CharityTransfer' :
        flag = this.canActive(
          'TransferLocal',
          [],
          []);
        break;

      case 'AliasManagement' :
        flag = this.canActive(
          'AdminManagement',
          [],
          ['CompanyAdmins'],
        );
        break;

      case 'SadadManagement':
        flag = this.canActive(
          'SadadManagement',
          [
            'BILLPAYMENTS_PRIVILEGE',
            'SADAD_INVOICE_HUB_PRIVILEGE',
            'EGOVERNMENT_PRIVILEGE',
          ],
          [
            'BillPayGroup',
            'BillPayAdders',
            'SadadInvoiceHubGroup',
            'EgovGroup',
          ],
        );
        break;

      case 'BillPaymentsMenu' :
        flag = this.canActive(
          'BillPaymentsMenu',
          ['BILLPAYMENTS_PRIVILEGE'],
          ['BillPayGroup', 'BillPayAdders']
        );
        break;

      case 'BillAdd' :
        flag = this.canActive(
          'BillAdd',
          ['BILLPAYMENTS_PRIVILEGE'],
          ['BillPayAdders'],
        );
        break;

      case 'BillRequestStatus' :
        flag = this.canActive(
          'BillRequestStatus',
          ['BILLPAYMENTS_PRIVILEGE'],
          ['BillPayGroup'],
        );
        break;

      case 'BillFeedBackFiles' :
        flag = this.canActive(
          'BillFeedBackFiles',
          ['BILLPAYMENTS_PRIVILEGE'],
          ['BillPayGroup'],
        );
        break;

      case 'BillDashboard' :
        flag = this.canActive(
          'BillDashboard',
          ['BILLPAYMENTS_PRIVILEGE'],
          ['BillPayGroup'],
        );
        break;

      case 'BillManagement' :
        flag = this.canActive(
          'BillManagement',
          ['BILLPAYMENTS_PRIVILEGE'],
          ['BillPayGroup'],
        );
        break;

      case 'MOIPaymentMenu' :
        flag = this.canActive(
          'MOIPaymentMenu',
          ['EGOVERNMENT_PRIVILEGE'],
          ['EgovGroup']);
        break;

      case 'MOIRequestStatus' :
        flag = this.canActive(
          'MOIRequestStatus',
          ['EGOVERNMENT_PRIVILEGE'],
          ['EgovGroup'],
        );
        break;

      case 'MOIFeedBackFiles' :
        flag = this.canActive(
          'MOIFeedBackFiles',
          ['EGOVERNMENT_PRIVILEGE'],
          ['EgovGroup'],
        );
        break;

      case 'MOIRefunds' :
        flag = this.canActive(
          'MOIRefunds',
          ['EGOVERNMENT_PRIVILEGE'],
          ['EgovGroup'],
        );
        break;

      case 'EsalMenu' :
        flag = this.canActive(
          'EsalMenu',
          ['SADAD_INVOICE_HUB_PRIVILEGE'],
          ['SadadInvoiceHubGroup']);
        break;

      case 'EsalPayInvoice' :
        flag = this.canActive(
          'EsalPayInvoice',
          ['SADAD_INVOICE_HUB_PRIVILEGE'],
          ['SadadInvoiceHubGroup'],
        );
        break;

      case 'EsalPayMultiple' :
        flag = this.canActive(
          'EsalPayMultiple',
          ['SADAD_INVOICE_HUB_PRIVILEGE'],
          ['SadadInvoiceHubGroup'],
        );
        break;

      case 'EsalDashboard' :
        flag = this.canActive(
          'EsalDashboard',
          ['SADAD_INVOICE_HUB_PRIVILEGE'],
          ['SadadInvoiceHubGroup'],
        );
        break;

      case 'EsalRequestStatus' :
        flag = this.canActive(
          'EsalRequestStatus',
          ['SADAD_INVOICE_HUB_PRIVILEGE'],
          ['SadadInvoiceHubGroup'],
        );
        break;

      case 'EsalFeedBackFiles' :
        flag = this.canActive(
          'EsalFeedBackFiles',
          ['SADAD_INVOICE_HUB_PRIVILEGE'],
          ['SadadInvoiceHubGroup'],
        );
        break;

      case 'EsalInvoiceHistory' :
        flag = this.canActive(
          'EsalInvoiceHistory',
          ['SADAD_INVOICE_HUB_PRIVILEGE'],
          ['SadadInvoiceHubGroup'],
        );
        break;

      case 'AramcoPaymentMenu' :
        flag = this.canActive(
          'AramcoPaymentMenu',
          ['ARAMCOPAYMENTS_PRIVILEGE'],
          ['AramcoPaymentsGroup']
        );
        break;

      case 'AramcoPaymentRequestStatus' :
        flag = this.canActive(
          'AramcoPaymentRequestStatus',
          ['ARAMCOPAYMENTS_PRIVILEGE'],
          ['AramcoPaymentsGroup'],
        );
        break;

      case 'HajjUmrahMenu' :
        flag = this.canActive(
          'HajjUmrahMenu',
          ['HAJJUMRAHCARDS_PRIVILEGE'],
          ['HajjUmrahCardsGroup'],
        );
        break;

      case 'OneTimePayment' :
        flag = this.canActive(
          'OneTimePayment',
          ['BILLPAYMENTS_PRIVILEGE'],
          ['BillPayAdders']
        );
        break;

      case 'MOIBulkPayment':
        flag = this.canActive(
          'MOIBulkPayment',
          ['EGOVERNMENT_PRIVILEGE'],
          ['EgovGroup'],
        );
        break;

      case 'WPS_MENU' :
        flag = this.canActive(
          'WPSPayrollMenu',
          ['WPSPAYROLL_PRIVILEGE'],
          ['WPSPayrollGroup']);
        break;

      case 'WPS_PAYROLL_SELF_ON_BOARDING' :
        flag = this.canActive(
          'WpsPayrollSelfOnboarding',
          [],
          ['CompanyAdmins'],
        );
        break;
      case 'PAYROLL_PROCESSED_FILES':
        flag= this.hasAccess('WPS_PLUS_MENU')||
          this.hasAccess('WPS_MENU')
        break;

      case 'WPS_PLUS_MENU' :
        flag = this.canActive(
          'WPS_PLUS',
          ['PAYROLL_WPS_EMP_PLUS', 'PAYROLL_WPS_PLUS'],
          ['payrollWpsEmpPlus']);
        break;

      case 'WPS_PLUS_STOP_FILE':
        flag = this.canActive(
          'WPSPayrollMenu',
          ['WPSPAYROLL_PRIVILEGE'],
          ['PayrollFileCancellationGroup']
        );
        break;

      case 'WPS_STOP_FILE':
        flag = this.canActive(
          'WPSPayrollMenu',
          ['WPSPAYROLL_PRIVILEGE'],
          ['PayrollFileCancellationGroup']
        );
        break;

      case 'UsersMenu':
        flag = this.canActive(
          'UsersMenu',
          [],
          ['CompanyAdmins'],
        );
        break;

      case 'UsersList':
        flag = this.canActive(
          'UsersList',
          [],
          ['CompanyAdmins'],
        );
        break;

      case 'UsersAdd':
        flag = this.canActive(
          'UsersAdd',
          [],
          ['CompanyAdmins'],
        );
        break;

      case 'FeesAdminMenu':
        flag = this.canActive(
          'FeesAdminMenu',
          [],
          ['CompanyAdmins'],
        );
        break;

      case 'AlertsAdminMenu':
        flag = this.canActive(
          'AlertsAdminMenu',
          ['ALERTS_PRIVILEGE'],
          ['CompanyAdmins'],
        );
        break;

      case 'AlertsAdminSMSReport':
        flag = this.canActive(
          'AlertsAdminSMSReport',
          ['ALERTS_PRIVILEGE'],
          ['CompanyAdmins'],
        );
        break;

      case 'AlertsAdminSMSRenewal':
        flag = this.canActive(
          'AlertsAdminSMSRenewal',
          ['ALERTS_PRIVILEGE'],
          ['CompanyAdmins'],
        );
        break;

      case 'AlertsAdminSMSDeactivate':
        flag = this.canActive(
          'AlertsAdminSMSDeactivate',
          ['ALERTS_PRIVILEGE'],
          ['CompanyAdmins'],
        );
        break;

      case 'AlertsAdminSMSRegistration':
        flag = this.canActive(
          'AlertsAdminSMSRegistration',
          ['ALERTS_PRIVILEGE'],
          ['CompanyAdmins'],
        );
        break;

      case 'CustomProperties':
        flag = this.canActive(
          'CustomProperties',
          [],
          ['CompanyAdmins'],
        );
        break;

      case 'TokensManagementAdmin':
        flag = this.canActive(
          'TokensManagementAdmin',
          [],
          ['CompanyAdmins'],
        );
        break;

      case 'ActivityLogsAdmin':
        flag = this.canActive(
          'ActivityLogsAdmin',
          [],
          ['CompanyAdmins'],
        );
        break;

      case 'UpdateCR':
        flag = this.canActive(
          'UpdateCR',
          [],
          ['CompanyAdmins'],
        );
        break;

      case 'WorkflowMenu':
        flag = this.canActive(
          'WorkflowMenu',
          [],
          ['CompanyAdmins'],
        );
        break;

      case 'WorkflowAccountsRules':
        flag = this.canActive(
          'WorkflowAccountsRules',
          [],
          ['CompanyAdmins'],
        );
        break;

      case 'WorkflowNonFinancial':
        flag = this.canActive(
          'WorkflowNonFinancial',
          [],
          ['CompanyAdmins'],
        );
        break;

      case 'BusinessHubInvoicingDashboard':
        flag = this.canActive(
          'BusinessHubInvoicingDashboard',
          [],
          ['CompanyAdmins'],
        ) && this.hasAccess('BusinessHub');
        break;

      case 'BusinessHubEcommerceDashboard':
        flag = this.canActive(
          'BusinessHubEcommerceDashboard',
          [],
          ['CompanyAdmins'],
        ) && this.hasAccess('BusinessHub');
        break;

      case 'PosRequestMenu':
        flag = this.canActive(
          'PosRequestMenu',
          ['POS_MANAGEMENT_PRIVILEGE'],
          ['posManagementGroup'],
        );
        break;

      case 'MerchantPortal':
        flag = this.canActive(
          'MerchantPortal',
          ['POS_MANAGEMENT_PRIVILEGE'],
          [],
        );
        break;

      case 'POSMaintenanceManageRequest':
        flag = this.hasAccess('PosMaintenances') && this.canActive(
          'PosStatementList',
          ['POS_MANAGEMENT_PRIVILEGE'],
          ['posManagementGroup'],
        );
        break;

      case 'POSManagementMenu':
        flag = this.hasAccess('CRMMenu') && this.canActive(
          'POSManagementMenu',
          ['POS_MANAGEMENT_PRIVILEGE'],
          ['posManagementGroup'],
        );
        break;

      case 'CRMMenu':
        flag = this.canActive(
          'PosStatementTerminalStatement',
          ['POS_MANAGEMENT_PRIVILEGE'],
          ['posManagementGroup'],
        );
        break;

      case 'CRMStatusRequest':
        flag = this.hasAccess('CRMMenu') && this.canActive(
          'RequestsStatusBank',
          ['POS_MANAGEMENT_PRIVILEGE'],
          ['posManagementGroup'],
        );
        break;

      case 'PosReports':
        flag = this.canActive(
          'PosStatementMenu',
          [
            'POSSTATEMENT_PRIVILEGE',
            'CUSTOMIZE_REPORT_PRIVILEGE',
          ],
          [
            'PosStatementGroup',
            'CustomizeReportGroup',
          ],
        );
        break;

      case 'PosStatementList':
        flag = this.canActive(
          'PosStatementList',
          ['POSSTATEMENT_PRIVILEGE'],
          ['PosStatementGroup'],
        );
        break;

      case 'PosStatementTerminalStatement':
        flag = this.canActive(
          'PosStatementTerminalStatement',
          ['POSSTATEMENT_PRIVILEGE'],
          ['PosStatementGroup'],
        );
        break;

      case 'PosMaintenances':
        flag = this.canActive(
          'PosStatementMenu',
          ['POS_MANAGEMENT_PRIVILEGE'],
          ['posManagementGroup'],
        );
        break;

      case 'POSDashboard':
        flag = this.canActive(
          'POSDashboard',
          ['POS_MANAGEMENT_PRIVILEGE'],
          ['posManagementGroup'],
        );
        break;

      case 'ClaimsMenu':
        flag = this.canActive(
          'ClaimsMenu',
          ['POS_MANAGEMENT_PRIVILEGE'],
          ['posManagementGroup'],
        );
        break;

      case 'RMInformation':
        flag = this.canActive(
          'RMInformation',
          [],
          ['corporate'],
        );
        break;

      case 'ActivityLogs':
        flag = this.canActive(
          'ActivityLogs',
          [],
          ['corporate'],
        );
        break;

      case 'TransferFxRates':
        flag = this.canActive(
          'TransferFxRates',
          [],
          [],
        );
        break;

      case 'AlertsMenu':
        flag = this.canActive(
          'AlertsMenu',
          ['ALERTS_PRIVILEGE'],
          ['AlertsUserGroup'],
        );
        break;

      case 'NationalAddress':
        flag = this.canActive(
          'NationalAddress',
          [],
          ['CompanyAdmins']
        );
        break;

      default :
        flag = false;
    }
    if (!flag && !environment.production) {
      console.log("you aren't authorized to execute this service: " + service );
    }
    return flag
  }

}
