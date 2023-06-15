import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {AuthenticationUtils} from 'app/@core/utility/authentication-utils';
import {SearchListOptionsModel} from 'arb-design-library/model/dropdown-options.model';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  globalSearchList!: SearchListOptionsModel[];

  constructor(private translateService: TranslateService) {
  }

  translate(keys: string[]): string[] {
    return Object.values(this.translateService.instant(keys));
  }

  getGlobalSearchItems() {
    this.globalSearchList = [
      ...this.addAccountManagementItems(),
      ...this.addCardsItems(),
      ...this.addTransfersItems(),
      ...this.addPaymentsItems(),
      ...this.addPayrollItems(),
      ...this.addCompanyAdminItems(),
      ...this.addRepresentativesItems(),
      ...this.addBusinessHubItems(),
      ...this.addPointOfSaleItems(),
      ...this.addGoldWalletItems(),
      ...this.addFinancialProductsItems(),
      ...this.addHelpItems(),
      ...this.addFinanceItems(),
      ...this.addProfileItems(),
    ];

    return this.globalSearchList;
  }

  addProfileItems(): SearchListOptionsModel[] {
    return [
      {
        id: 'user-profile-fx-rates',
        text: this.translate([
          'manage-alerts.userProfile',
          'public.fxRatesTitle',
        ]),
        url: '/user-profile/fx-rates',
        hidden: false,
      },
      {
        id: 'user-profile-change-password',
        text: this.translate([
          'manage-alerts.userProfile',
          'public.changePassword',
        ]),
        url: '/user-profile/change-password',
        hidden: false,
      },
    ];
  }

  addFinanceItems(): SearchListOptionsModel[] {
    //TODO: add search items for this module
    return [];
  }

  addHelpItems(): SearchListOptionsModel[] {
    return [
      {
        id: 'help-faq',
        icon: 'arb-icon-chatCircle',
        text: this.translate(['help.title', 'help.Faq-box-text']),
        url: '/help',
        hidden: false,
      },
      {
        id: 'help-ask-rajhi',
        icon: 'arb-icon-chatCircle',
        text: this.translate(['help.title', 'help.ask-alrajhi']),
        url: '/help',
        hidden: false,
      },
    ];
  }

  addFinancialProductsItems(): SearchListOptionsModel[] {
    if (!AuthenticationUtils.serviceIsActive('CashManagementProducts'))
      return [];

    return [
      {
        id: 'financial-products-virtual-account',
        icon: 'arb-icon-cart',
        text: this.translate([
          'financial-products.title',
          'search.virtual-account',
        ]),
        url: '/cash-management-products?type=accounts',
        hidden: false,
      },
      {
        id: 'financial-products-escrow-account',
        icon: 'arb-icon-cart',
        text: this.translate([
          'financial-products.title',
          'search.escrow-account',
        ]),
        url: '/cash-management-products?type=accounts',
        hidden: false,
      },
      {
        id: 'financial-products-credit-cards',
        icon: 'arb-icon-cart',
        text: this.translate([
          'financial-products.title',
          'search.credit-cards',
        ]),
        url: '/cash-management-products?type=cards',
        hidden: false,
      },
      {
        id: 'financial-products-e-prepaid-cards',
        icon: 'arb-icon-cart',
        text: this.translate([
          'financial-products.title',
          'search.e-prepaid-cards',
        ]),
        url: '/cash-management-products?type=cards',
        hidden: false,
      },
      {
        id: 'financial-products-payroll-cards',
        icon: 'arb-icon-cart',
        text: this.translate([
          'financial-products.title',
          'payroll.payroll-cards.name',
        ]),
        url: '/cash-management-products?type=cards',
        hidden: false,
      },
      {
        id: 'financial-products-cash-24',
        icon: 'arb-icon-cart',
        text: this.translate(['financial-products.title', 'search.cash-24']),
        url: '/cash-management-products?type=cash',
        hidden: false,
      },
      {
        id: 'financial-products-point-of-sale',
        icon: 'arb-icon-cart',
        text: this.translate([
          'financial-products.title',
          'pos.dashboard.title',
        ]),
        url: '/cash-management-products?type=cash',
        hidden: false,
      },
      {
        id: 'financial-products-cash-pick-up',
        icon: 'arb-icon-cart',
        text: this.translate([
          'financial-products.title',
          'search.cash-pick-up',
        ]),
        url: '/cash-management-products?type=cash',
        hidden: false,
      },
      {
        id: 'financial-products-dividend-distribution',
        icon: 'arb-icon-cart',
        text: this.translate([
          'financial-products.title',
          'search.dividend-distribution',
        ]),
        url: '/cash-management-products?type=cash',
        hidden: false,
      },
      {
        id: 'financial-products-cash-deposit-machines',
        icon: 'arb-icon-cart',
        text: this.translate([
          'financial-products.title',
          'search.cash-deposit-machines',
        ]),
        url: '/cash-management-products?type=cash',
        hidden: false,
      },
      {
        id: 'financial-products-business-2-business',
        icon: 'arb-icon-cart',
        text: this.translate([
          'financial-products.title',
          'search.business-2-business',
        ]),
        url: '/cash-management-products?type=business',
        hidden: false,
      },
      {
        id: 'financial-products-e-commerce',
        icon: 'arb-icon-cart',
        text: this.translate([
          'financial-products.title',
          'pos.dashboard.boxes.e-commerce',
        ]),
        url: '/cash-management-products?type=business',
        hidden: false,
      },
    ];
  }

  addGoldWalletItems(): SearchListOptionsModel[] {
    //TODO: add search items for this module
    return [];
  }

  addPointOfSaleItems(): SearchListOptionsModel[] {
    if (!AuthenticationUtils.serviceIsActive('CollectionsManagement'))
      return [];

    return [
      {
        id: 'point-of-sales-add-new-request',
        icon: 'arb-icon-Store',
        text: this.translate(['pos.dashboard.title', 'pos.new-request.title']),
        url: '/pos/new-request',
        hidden: !AuthenticationUtils.hasAccess('PosRequestMenu'),
      },
      {
        id: 'point-of-sales-point-of-sale-e-commerce',
        icon: 'arb-icon-Store',
        text: ['Point of Sales', 'E-Commerce', 'Point of Sale E-Commerce'],
        url: '', // not existing
        hidden: true,
      },
      {
        id: 'point-of-sales-maintenance',
        icon: 'arb-icon-Store',
        text: this.translate([
          'pos.dashboard.title',
          'pos.dashboard.boxes.maintenance',
        ]),
        url: '/pos/pos-maintenance',
        hidden: !AuthenticationUtils.hasAccess('PosMaintenances'),
      },
      {
        id: 'point-of-sales-claims',
        icon: 'arb-icon-Store',
        text: ['Point of Sales', 'Claims'],
        url: '', // not existing
        hidden: true,
      },
      {
        id: 'point-of-sales-pos-managemet',
        icon: 'arb-icon-Store',
        text: this.translate([
          'pos.dashboard.title',
          'pos.dashboard.boxes.pos-management.pos-management',
        ]),
        url: '/pos/pos-management',
        hidden: false,
      },
    ];
  }

  addBusinessHubItems(): SearchListOptionsModel[] {
    if (!AuthenticationUtils.hasAccess('BusinessHub')) return [];

    return [
      {
        id: 'business-hub-qoyod',
        icon: 'arb-icon-briefcase',
        text: this.translate([
          'businessHub.businessHubTitle',
          'businessHub.qoyod',
        ]),
        url: '/business-hub',
        hidden: !AuthenticationUtils.hasAccess('BusinessHubInvoicingDashboard'),
      },
      {
        id: 'business-hub-zid',
        icon: 'arb-icon-briefcase',
        text: this.translate([
          'businessHub.businessHubTitle',
          'businessHub.zid',
        ]),
        url: '/business-hub',
        hidden: !AuthenticationUtils.hasAccess('BusinessHubEcommerceDashboard'),
      },
      {
        id: 'business-hub-my-products',
        icon: 'arb-icon-briefcase',
        text: this.translate([
          'businessHub.businessHubTitle',
          'businessHub.myProducts',
        ]),
        url: '/business-hub',
        hidden: !(
          AuthenticationUtils.hasAccess('BusinessHubEcommerceDashboard') ||
          AuthenticationUtils.hasAccess('BusinessHubInvoicingDashboard')
        ),
      },
    ];
  }

  addRepresentativesItems(): SearchListOptionsModel[] {
    if (!AuthenticationUtils.hasAccess('RepresentativesManagement')) return [];

    return [
      {
        id: 'representatives-add-representative',
        icon: 'arb-icon-smallUserLargeUser',
        text: this.translate([
          'representatives.title',
          'representatives.add.title',
        ]),
        url: '/representatives/addRepresentative',
        hidden: false,
      },
      {
        id: 'representatives-id-number',
        icon: 'arb-icon-smallUserLargeUser',
        text: this.translate([
          'representatives.title',
          'representatives.add.id-number',
        ]),
        url: '/representatives',
        hidden: false,
      },
      {
        id: 'representatives-name',
        icon: 'arb-icon-smallUserLargeUser',
        text: this.translate([
          'representatives.title',
          'representatives.table.name',
        ]),
        url: '/representatives',
        hidden: false,
      },
    ];
  }

  addCompanyAdminItems(): SearchListOptionsModel[] {
    if (!AuthenticationUtils.hasAccess('AdminManagement')) return [];

    return [
      {
        id: 'company-admin-user-management-add-user',
        icon: 'arb-icon-building',
        text: this.translate([
          'search.company-admin',
          'company-admin.users-list.title1',
          'company-admin.users-list.addUser',
        ]),
        url: '/company-admin/alrajhi-user-details',
        hidden: !(
          AuthenticationUtils.hasAccess('UsersMenu') ||
          AuthenticationUtils.serviceIsActive('UsersMenu')
        ),
      },
      {
        id: 'company-admin-user-management-login-id',
        icon: 'arb-icon-building',
        text: this.translate([
          'search.company-admin',
          'company-admin.users-list.title1',
          'company-admin.users-list.loginID',
        ]),
        url: '/company-admin/alrajhi-user-management',
        hidden: !(
          AuthenticationUtils.hasAccess('UsersMenu') ||
          AuthenticationUtils.serviceIsActive('UsersMenu')
        ),
      },
      {
        id: 'company-admin-user-management-national-id-number',
        icon: 'arb-icon-building',
        text: this.translate([
          'search.company-admin',
          'company-admin.users-list.title1',
          'company-admin.users-list.nationalID',
        ]),
        url: '/company-admin/alrajhi-user-management',
        hidden: !(
          AuthenticationUtils.hasAccess('UsersMenu') ||
          AuthenticationUtils.serviceIsActive('UsersMenu')
        ),
      },
      {
        id: 'company-admin-fees-information-general-fees',
        icon: 'arb-icon-building',
        text: this.translate([
          'search.company-admin',
          'company-admin.fees.title',
          'company-admin.fees.tabs.general',
        ]),
        url: '/company-admin/fees-management',
        hidden: !(
          AuthenticationUtils.hasAccess('FeesAdminMenu') ||
          AuthenticationUtils.serviceIsActive('FeesAdminMenu')
        ),
      },
      {
        id: 'company-admin-fees-information-payroll-fees',
        icon: 'arb-icon-building',
        text: this.translate([
          'search.company-admin',
          'company-admin.fees.title',
          'company-admin.fees.tabs.payroll',
        ]),
        url: '/company-admin/fees-management',
        hidden: !(
          AuthenticationUtils.hasAccess('FeesAdminMenu') ||
          AuthenticationUtils.serviceIsActive('FeesAdminMenu')
        ),
      },
      {
        id: 'company-admin-fees-information-payroll-card-fees',
        icon: 'arb-icon-building',
        text: this.translate([
          'search.company-admin',
          'company-admin.fees.title',
          'company-admin.fees.tabs.payroll-card',
        ]),
        url: '/company-admin/fees-management',
        hidden: !(
          AuthenticationUtils.hasAccess('FeesAdminMenu') ||
          AuthenticationUtils.serviceIsActive('FeesAdminMenu')
        ),
      },
      {
        id: 'company-admin-fees-information-bulk-transfer-fee',
        icon: 'arb-icon-building',
        text: this.translate([
          'search.company-admin',
          'company-admin.fees.title',
          'company-admin.fees.tabs.bulk',
        ]),
        url: '/company-admin/fees-management',
        hidden: !(
          AuthenticationUtils.hasAccess('FeesAdminMenu') ||
          AuthenticationUtils.serviceIsActive('FeesAdminMenu')
        ),
      },
      {
        id: 'company-admin-alert-management-sms-alert-privilege',
        icon: 'arb-icon-building',
        text: this.translate([
          'search.company-admin',
          'company-admin.alert-management.alert-management-name',
          'company-admin.alert-management.alert-privilage',
        ]),
        url: '/company-admin/alert-management?type=subscribed',
        hidden: !(
          AuthenticationUtils.hasAccess('AlertsAdminMenu') ||
          AuthenticationUtils.serviceIsActive('AlertsAdminMenu')
        ),
      },
      {
        id: 'company-admin-alert-management-max-sms-count',
        icon: 'arb-icon-building',
        text: this.translate([
          'search.company-admin',
          'company-admin.alert-management.alert-management-name',
          'company-admin.alert-management.max-sms-count',
        ]),
        url: '/company-admin/alert-management?type=subscribed',
        hidden: !(
          AuthenticationUtils.hasAccess('AlertsAdminMenu') ||
          AuthenticationUtils.serviceIsActive('AlertsAdminMenu')
        ),
      },
      {
        id: 'company-admin-alert-management-sms-reached',
        icon: 'arb-icon-building',
        text: this.translate([
          'search.company-admin',
          'company-admin.alert-management.alert-management-name',
          'company-admin.alert-management.sms-reached',
        ]),
        url: '/company-admin/alert-management?type=subscribed',
        hidden: !(
          AuthenticationUtils.hasAccess('AlertsAdminMenu') ||
          AuthenticationUtils.serviceIsActive('AlertsAdminMenu')
        ),
      },
      {
        id: 'company-admin-company-configuration-reset-password-notification',
        icon: 'arb-icon-building',
        text: this.translate([
          'search.company-admin',
          'company-admin.company-configuration.title',
          'company-admin.company-configuration.resetPasswordSelection',
        ]),
        url: '/company-admin/company-configuration',
        hidden: !(
          AuthenticationUtils.hasAccess('CustomProperties') ||
          AuthenticationUtils.serviceIsActive('CustomProperties')
        ),
      },
      {
        id: 'company-admin-company-configuration-company-workflow-type',
        icon: 'arb-icon-building',
        text: this.translate([
          'search.company-admin',
          'company-admin.company-configuration.title',
          'company-admin.company-configuration.companyWorkFlowType',
        ]),
        url: '/company-admin/company-configuration',
        hidden: !(
          AuthenticationUtils.hasAccess('CustomProperties') ||
          AuthenticationUtils.serviceIsActive('CustomProperties')
        ),
      },
      {
        id: 'company-admin-company-configuration-vat-registration-number',
        icon: 'arb-icon-building',
        text: this.translate([
          'search.company-admin',
          'company-admin.company-configuration.title',
          'company-admin.company-configuration.vatRegistrationNumber',
        ]),
        url: '/company-admin/company-configuration',
        hidden: !(
          AuthenticationUtils.hasAccess('CustomProperties') ||
          AuthenticationUtils.serviceIsActive('CustomProperties')
        ),
      },
      {
        id: 'company-admin-company-configuration-company-limit',
        icon: 'arb-icon-building',
        text: this.translate([
          'search.company-admin',
          'company-admin.company-configuration.title',
          'search.company-limit',
        ]),
        url: '/company-admin/company-configuration',
        hidden: !(
          AuthenticationUtils.hasAccess('CustomProperties') ||
          AuthenticationUtils.serviceIsActive('CustomProperties')
        ),
      },
      {
        id: 'company-admin-token-management-token-serial-number',
        icon: 'arb-icon-building',
        text: this.translate([
          'search.company-admin',
          'company-admin.token-management.name',
          'company-admin.token-management.token-serial',
        ]),
        url: '/company-admin/token-management',
        hidden: !(
          AuthenticationUtils.hasAccess('TokensManagementAdmin') ||
          AuthenticationUtils.serviceIsActive('TokensManagementAdmin')
        ),
      },
      {
        id: 'company-admin-token-management-token-type',
        icon: 'arb-icon-building',
        text: this.translate([
          'search.company-admin',
          'company-admin.token-management.name',
          'company-admin.token-management.token-type',
        ]),
        url: '/company-admin/token-management',
        hidden: !(
          AuthenticationUtils.hasAccess('TokensManagementAdmin') ||
          AuthenticationUtils.serviceIsActive('TokensManagementAdmin')
        ),
      },
      {
        id: 'company-admin-token-management-order-new-token',
        icon: 'arb-icon-building',
        text: this.translate([
          'search.company-admin',
          'company-admin.token-management.name',
          'company-admin.token-management.order-new-token',
        ]),
        url: '/company-admin/token-management/order-token',
        hidden: !(
          AuthenticationUtils.hasAccess('TokensManagementAdmin') ||
          AuthenticationUtils.serviceIsActive('TokensManagementAdmin')
        ),
      },
      {
        id: 'company-admin-activity-logs',
        icon: 'arb-icon-building',
        text: this.translate([
          'search.company-admin',
          'activityLogs.activitylogsTitle',
        ]),
        url: '/user-profile/activity-logs',
        hidden: !(
          AuthenticationUtils.hasAccess('ActivityLogsAdmin') ||
          AuthenticationUtils.serviceIsActive('ActivityLogsAdmin')
        ),
      },
      {
        id: 'company-admin-activity-logs-operation',
        icon: 'arb-icon-building',
        text: this.translate([
          'search.company-admin',
          'activityLogs.activitylogsTitle',
          'activityLogs.operation',
        ]),
        url: '/user-profile/activity-logs',
        hidden: !(
          AuthenticationUtils.hasAccess('ActivityLogsAdmin') ||
          AuthenticationUtils.serviceIsActive('ActivityLogsAdmin')
        ),
      },
      {
        id: 'company-admin-activity-logs-requested-files-requested',
        icon: 'arb-icon-building',
        text: this.translate([
          'search.company-admin',
          'activityLogs.activitylogsTitle',
          'activityLogs.requestedFiles',
          'activityLogs.requested',
        ]),
        url: '/user-profile/activity-logs',
        hidden: !(
          AuthenticationUtils.hasAccess('ActivityLogsAdmin') ||
          AuthenticationUtils.serviceIsActive('ActivityLogsAdmin')
        ),
      },
      {
        id: 'company-admin-update-cr',
        icon: 'arb-icon-building',
        text: this.translate(['search.company-admin', 'update-cr.title']),
        url: '/company-admin/update-cr',
        hidden: !(
          AuthenticationUtils.hasAccess('UpdateCR') ||
          AuthenticationUtils.serviceIsActive('UpdateCR')
        ),
      },
      {
        id: 'company-admin-workflow-management-account-rules',
        icon: 'arb-icon-building',
        text: this.translate([
          'search.company-admin',
          'workflow.workflowManagement',
          'workflow.account-rules',
        ]),
        url: '/company-admin/workflow-management',
        hidden: !(
          AuthenticationUtils.hasAccess('WorkflowMenu') ||
          AuthenticationUtils.serviceIsActive('WorkflowMenu')
        ),
      },
      {
        id: 'company-admin-workflow-management-non-financial',
        icon: 'arb-icon-building',
        text: this.translate([
          'search.company-admin',
          'workflow.workflowManagement',
          'workflow.non-financial',
        ]),
        url: '/company-admin/workflow-management',
        hidden: !(
          AuthenticationUtils.hasAccess('WorkflowMenu') ||
          AuthenticationUtils.serviceIsActive('WorkflowMenu')
        ),
      },
    ];
  }

  addPayrollItems(): SearchListOptionsModel[] {
    if (!AuthenticationUtils.serviceIsActive('PayrollManagement')) return [];

    return [
      {
        id: 'payroll-payroll-wps-add-new-employee',
        icon: 'arb-icon-documentWithCurrencySR',
        text: this.translate([
          'payroll.main-page-name',
          'payroll.payroll-wps.name',
          'payroll.payroll-wps.add-employee.page-name',
        ]),
        url: '/payroll/add-employee/wps',
        hidden: false,
      },
      {
        id: 'payroll-payroll-wps-employee-management',
        icon: 'arb-icon-documentWithCurrencySR',
        text: this.translate([
          'payroll.main-page-name',
          'payroll.payroll-wps.name',
          'search.employee-management',
        ]),
        url: '/payroll/employee/list/wps',
        hidden: false,
      },
      {
        id: 'payroll-payroll-wps-payroll-payments-salray',
        icon: 'arb-icon-documentWithCurrencySR',
        text: this.translate([
          'payroll.main-page-name',
          'payroll.payroll-wps.name',
          'search.payroll-payment',
        ]),
        url: '/payroll/employee/list/wps',
        hidden: false,
      },
      {
        id: 'payroll-payroll-wps-upload-file',
        icon: 'arb-icon-documentWithCurrencySR',
        text: this.translate([
          'payroll.main-page-name',
          'payroll.payroll-wps.name',
          'public.uploadFile',
        ]),
        url: '/payroll/upload-file/wps',
        hidden: false,
      },
      {
        id: 'payroll-payroll-wps-plus',
        icon: 'arb-icon-documentWithCurrencySR',
        text: this.translate([
          'payroll.main-page-name',
          'payroll.payroll-wps-plus.page-name', // missing Payroll WPS Plus
        ]),
        url: '/payroll/employee/list/wps-plus',
        hidden: false,
      },
      {
        id: 'payroll-payroll-cards',
        icon: 'arb-icon-documentWithCurrencySR',
        text: this.translate([
          'payroll.main-page-name',
          'payroll.payroll-cards.name',
        ]),
        url: '/payroll',
        hidden: false,
      },
      {
        id: 'payroll-payroll-wms',
        icon: 'arb-icon-documentWithCurrencySR',
        text: this.translate([
          'payroll.main-page-name',
          'payroll.payroll-wms.name',
        ]),
        url: '/payroll',
        hidden: false,
      },
    ];
  }

  addPaymentsItems(): SearchListOptionsModel[] {
    if (
      !(
        AuthenticationUtils.serviceIsActive('PaymentsManagement') ||
        AuthenticationUtils.serviceIsActive('SadadManagement')
      )
    )
      return [];

    return [
      {
        id: 'payments-bill-payment-add-bill',
        icon: 'arb-icon-Bill',
        text: this.translate([
          'payments.payment',
          'payments.bill-payment.name',
          'payments.bill-payment.add-bill',
        ]),
        url: '/payments/add-bill',
        hidden: !AuthenticationUtils.hasAccess('BillPaymentsMenu'),
      },
      {
        id: 'payments-bill-payment-biller-name',
        icon: 'arb-icon-Bill',
        text: this.translate([
          'payments.payment',
          'payments.bill-payment.name',
          'payments.bill-payment.table-header.biller-name',
        ]),
        url: '/payments/bill-payment',
        hidden: !AuthenticationUtils.hasAccess('BillPaymentsMenu'),
      },
      {
        id: 'payments-government-payment-configure-moi-refund',
        icon: 'arb-icon-Bill',
        text: this.translate([
          'payments.payment',
          'payments.government.title-payment',
          'payments.government.configure-payment',
        ]),
        url: '/payments/government-payment',
        hidden: !AuthenticationUtils.hasAccess('MOIPaymentMenu'),
      },
      {
        id: 'payments-government-payment-service-type',
        icon: 'arb-icon-Bill',
        text: this.translate([
          'payments.payment',
          'payments.government.title-payment',
          'payments.service-type',
        ]),
        url: '/payments/government-payment',
        hidden: !AuthenticationUtils.hasAccess('MOIPaymentMenu'),
      },
      {
        id: 'payments-government-payment-application-type',
        icon: 'arb-icon-Bill',
        text: this.translate([
          'payments.payment',
          'payments.government.title-payment',
          'payments.application-type',
        ]),
        url: '/payments/government-payment',
        hidden: !AuthenticationUtils.hasAccess('MOIPaymentMenu'),
      },
      {
        id: 'payments-esal-single-esal-invoice',
        icon: 'arb-icon-Bill',
        text: this.translate([
          'payments.payment',
          'payments.boxes.esal-payment.title',
          'payments.esal.single-invoice',
        ]),
        url: '/payments/esal-payment/single-payment',
        hidden: !AuthenticationUtils.hasAccess('EsalMenu'),
      },
      {
        id: 'payments-esal-multiple-esal-invoice',
        icon: 'arb-icon-Bill',
        text: this.translate([
          'payments.payment',
          'payments.boxes.esal-payment.title',
          'payments.esal.multi-invoice',
        ]),
        url: '/payments/esal-payment/multi-payment',
        hidden: !AuthenticationUtils.hasAccess('EsalMenu'),
      },
      {
        id: 'payments-esal-invoice-history',
        icon: 'arb-icon-Bill',
        text: this.translate([
          'payments.payment',
          'payments.boxes.esal-payment.title',
          'payments.esal.invoice-history.invoice-history',
        ]),
        url: '/payments/esal-payment/invoice-history',
        hidden: !AuthenticationUtils.hasAccess('EsalMenu'),
      },
      {
        id: 'payments-aramco-payment-aramco-beneficiary-list',
        icon: 'arb-icon-Bill',
        text: this.translate([
          'payments.payment',
          'payments.aramco-payment.title',
          'payments.aramco-payment.selectedBeneficiaryTitle',
        ]),
        url: '/payments/aramco-payment',
        hidden: !AuthenticationUtils.hasAccess('AramcoPaymentMenu'),
      },
      {
        id: 'payments-aramco-payment-aramco-pass-number',
        icon: 'arb-icon-Bill',
        text: this.translate([
          'payments.payment',
          'payments.aramco-payment.title',
          'payments.aramco-payment.tableHeader.aramcoPassNumber',
        ]),
        url: '/payments/aramco-payment',
        hidden: !AuthenticationUtils.hasAccess('AramcoPaymentMenu'),
      },
      {
        id: 'payments-one-time-payment-subscription-number',
        icon: 'arb-icon-Bill',
        text: this.translate([
          'payments.payment',
          'payments.oneTimeBillPayment.title',
          'payments.oneTimeBillPayment.subscriptionNumber',
        ]),
        url: '/payments/one-time-payment',
        hidden: !AuthenticationUtils.hasAccess('OneTimePayment'),
      },
      {
        id: 'payments-one-time-payment',
        icon: 'arb-icon-Bill',
        text: this.translate([
          'payments.payment',
          'payments.oneTimeBillPayment.title',
        ]),
        url: '/payments/one-time-payment',
        hidden: !AuthenticationUtils.hasAccess('OneTimePayment'),
      },
      {
        id: 'payments-bulk-payment-sub-to-bulk-transfers',
        icon: 'arb-icon-Bill',
        text: this.translate([
          'payments.payment',
          'payments.bulkPayment.title',
          'payments.bulkPayment.sub-bulk-transfer',
        ]),
        url: '', // do not know route
        hidden: true,
      },
    ];
  }

  addTransfersItems(): SearchListOptionsModel[] {
    if (!AuthenticationUtils.serviceIsActive('TransfersManagement')) return [];

    return [
      {
        id: 'transfers-al-rajhi-transfer',
        icon: 'arb-icon-Two-Arrows',
        text: this.translate([
          'pending-actions.transfer-title',
          'transfer.alrajhi-transfer',
        ]),
        url: '/transfer/alrajhi-transfer',
        hidden: !AuthenticationUtils.hasAccess('AlRajhiTransfer'),
      },
      {
        id: 'transfers-al-rajhi-transfer-beneficiary',
        icon: 'arb-icon-Two-Arrows',
        text: this.translate([
          'pending-actions.transfer-title',
          'transfer.alrajhi-transfer',
          'transfer.standingOrder.ben',
        ]),
        url: '/transfer/alrajhi-transfer',
        hidden: !AuthenticationUtils.hasAccess('AlRajhiTransfer'),
      },
      {
        id: 'transfers-al-rajhi-transfer-nickname',
        icon: 'arb-icon-Two-Arrows',
        text: this.translate([
          'pending-actions.transfer-title',
          'transfer.alrajhi-transfer',
          'transfer.standingOrder.nickname',
        ]),
        url: '/transfer/alrajhi-transfer',
        hidden: !AuthenticationUtils.hasAccess('AlRajhiTransfer'),
      },
      {
        id: 'transfers-al-rajhi-transfer-account',
        icon: 'arb-icon-Two-Arrows',
        text: this.translate([
          'pending-actions.transfer-title',
          'transfer.alrajhi-transfer',
          'transfer.standingOrder.account',
        ]),
        url: '/transfer/alrajhi-transfer',
        hidden: !AuthenticationUtils.hasAccess('AlRajhiTransfer'),
      },
      {
        id: 'transfers-beneficiaries-add-new-beneficiary',
        icon: 'arb-icon-Two-Arrows',
        text: this.translate([
          'pending-actions.transfer-title',
          'public.beneficiaries',
          'transfer.add-new-beneficiary',
        ]),
        url: '/transfer/add-beneficiaries',
        hidden: !AuthenticationUtils.hasAccess('Beneficiaries'),
      },
      {
        id: 'transfers-beneficiaries-beneficiary-name',
        icon: 'arb-icon-Two-Arrows',
        text: this.translate([
          'pending-actions.transfer-title',
          'public.beneficiaries',
          'transfer.beneficiary-name',
        ]),
        url: '/transfer/beneficiaries',
        hidden: !AuthenticationUtils.hasAccess('Beneficiaries'),
      },
      {
        id: 'transfers-local-transfer',
        icon: 'arb-icon-Two-Arrows',
        text: this.translate([
          'pending-actions.transfer-title',
          'transfer.local-transfer.title',
        ]),
        url: '/transfer/local-transfer',
        hidden: !AuthenticationUtils.hasAccess('LocalTransfer'),
      },
      {
        id: 'transfers-local-transfer-beneficiary-name',
        icon: 'arb-icon-Two-Arrows',
        text: this.translate([
          'pending-actions.transfer-title',
          'transfer.local-transfer.title',
          'transfer.beneficiary-name',
        ]),
        url: '/transfer/local-transfer',
        hidden: !AuthenticationUtils.hasAccess('LocalTransfer'),
      },
      {
        id: 'transfers-local-transfer-nickname',
        icon: 'arb-icon-Two-Arrows',
        text: this.translate([
          'pending-actions.transfer-title',
          'transfer.local-transfer.title',
          'transfer.standingOrder.nickname',
        ]),
        url: '/transfer/local-transfer',
        hidden: !AuthenticationUtils.hasAccess('LocalTransfer'),
      },
      {
        id: 'transfers-local-transfer-account',
        icon: 'arb-icon-Two-Arrows',
        text: this.translate([
          'pending-actions.transfer-title',
          'transfer.local-transfer.title',
          'transfer.standingOrder.account',
        ]),
        url: '/transfer/local-transfer',
        hidden: !AuthenticationUtils.hasAccess('LocalTransfer'),
      },
      {
        id: 'transfers-local-transfer-bank-name',
        icon: 'arb-icon-Two-Arrows',
        text: this.translate([
          'pending-actions.transfer-title',
          'transfer.local-transfer.title',
          'public.bank-name',
        ]),
        url: '/transfer/local-transfer',
        hidden: !AuthenticationUtils.hasAccess('LocalTransfer'),
      },
      {
        id: 'transfers-international-transfer',
        icon: 'arb-icon-Two-Arrows',
        text: this.translate([
          'pending-actions.transfer-title',
          'transfer.international-transfer',
        ]),
        url: '/transfer/international-transfer',
        hidden: !AuthenticationUtils.hasAccess('InternationalTransfer'),
      },
      {
        id: 'transfers-international-transfer-beneficiary-name',
        icon: 'arb-icon-Two-Arrows',
        text: this.translate([
          'pending-actions.transfer-title',
          'transfer.international-transfer',
          'transfer.beneficiary-name',
        ]),
        url: '/transfer/international-transfer',
        hidden: !AuthenticationUtils.hasAccess('InternationalTransfer'),
      },
      {
        id: 'transfers-international-transfer-nickname',
        icon: 'arb-icon-Two-Arrows',
        text: this.translate([
          'pending-actions.transfer-title',
          'transfer.international-transfer',
          'transfer.standingOrder.nickname',
        ]),
        url: '/transfer/international-transfer',
        hidden: !AuthenticationUtils.hasAccess('InternationalTransfer'),
      },
      {
        id: 'transfers-international-transfer-account',
        icon: 'arb-icon-Two-Arrows',
        text: this.translate([
          'pending-actions.transfer-title',
          'transfer.international-transfer',
          'transfer.standingOrder.account',
        ]),
        url: '/transfer/international-transfer',
        hidden: !AuthenticationUtils.hasAccess('InternationalTransfer'),
      },
      {
        id: 'transfers-international-transfer-bank-name',
        icon: 'arb-icon-Two-Arrows',
        text: this.translate([
          'pending-actions.transfer-title',
          'transfer.international-transfer',
          'public.bank-name',
        ]),
        url: '/transfer/international-transfer',
        hidden: !AuthenticationUtils.hasAccess('InternationalTransfer'),
      },
      {
        id: 'transfers-international-transfer-country',
        icon: 'arb-icon-Two-Arrows',
        text: this.translate([
          'pending-actions.transfer-title',
          'transfer.international-transfer',
          'public.country',
        ]),
        url: '/transfer/international-transfer',
        hidden: !AuthenticationUtils.hasAccess('InternationalTransfer'),
      },
      {
        id: 'transfers-international-transfer-currency',
        icon: 'arb-icon-Two-Arrows',
        text: this.translate([
          'pending-actions.transfer-title',
          'transfer.international-transfer',
          'public.currency',
        ]),
        url: '/transfer/international-transfer',
        hidden: !AuthenticationUtils.hasAccess('InternationalTransfer'),
      },
      {
        id: 'transfers-quick-transfer',
        icon: 'arb-icon-Two-Arrows',
        text: this.translate([
          'pending-actions.transfer-title',
          'transfer.quick-transfer.title',
        ]),
        url: '/transfer/quick-transfer',
        hidden: !AuthenticationUtils.hasAccess('QuickTransfer'),
      },
      {
        id: 'transfers-between-accounts-from-account',
        icon: 'arb-icon-Two-Arrows',
        text: this.translate([
          'pending-actions.transfer-title',
          'transfer.own-transfer.between-accounts',
          'transfer.from-account',
        ]),
        url: '/transfer/between-accounts',
        hidden: !AuthenticationUtils.hasAccess('BetweenAccounts'),
      },
      {
        id: 'transfers-standing-orders-add-new-standing-order',
        icon: 'arb-icon-Two-Arrows',
        text: this.translate([
          'pending-actions.transfer-title',
          'pending-actions.standingOrders',
          'transfer.standingOrder.add-new',
        ]),
        url: '/transfer/standing-orders',
        hidden: !AuthenticationUtils.hasAccess('StandingOrders'),
      },
      {
        id: 'transfers-bulk-transfer-sub-to-bulk-transfers',
        icon: 'arb-icon-Two-Arrows',
        text: this.translate([
          'pending-actions.transfer-title',
          'transfer.bulk-payment',
          'transfer.blkPmtTns.new-payment',
        ]),
        url: '/transfer/standing-orders/add',
        hidden: !AuthenticationUtils.hasAccess('BulkPaymentsMenu'),
      },
      {
        id: 'transfers-urpay-transfer',
        icon: 'arb-icon-Two-Arrows',
        text: this.translate([
          'pending-actions.transfer-title',
          'transfer.urpay-transfer.title',
        ]),
        url: '/transfer/urpay-transfer',
        hidden: !AuthenticationUtils.hasAccess('UrpayTransfer'),
      },
      {
        id: 'transfers-charity-transfer-single-charity-transfer',
        icon: 'arb-icon-Two-Arrows',
        text: this.translate([
          'pending-actions.transfer-title',
          'transfer.charity.title',
          'transfer.charity.single-charity-transfer',
        ]),
        url: '/transfer/single-charity-transfer',
        hidden: !AuthenticationUtils.hasAccess('CharityTransfer'),
      },
      {
        id: 'transfers-charity-transfer-charity-organization',
        icon: 'arb-icon-Two-Arrows',
        text: this.translate([
          'pending-actions.transfer-title',
          'transfer.charity.title',
          'transfer.charity.charity-organization',
        ]),
        url: '/transfer/charity-transfer',
        hidden: !AuthenticationUtils.hasAccess('CharityTransfer'),
      },
      {
        id: 'transfers-charity-transfer-charity-categories',
        icon: 'arb-icon-Two-Arrows',
        text: this.translate([
          'pending-actions.transfer-title',
          'transfer.charity.title',
          'transfer.charity.charity-categories',
        ]),
        url: '/transfer/charity-transfer',
        hidden: !AuthenticationUtils.hasAccess('CharityTransfer'),
      },
      {
        id: 'transfers-alias-management-alias-name',
        icon: 'arb-icon-Two-Arrows',
        text: this.translate([
          'pending-actions.transfer-title',
          'transfer.alias-management',
          'alias-management.aliasName',
        ]),
        url: '/transfer/alias-management',
        hidden: !AuthenticationUtils.hasAccess('AliasManagement'),
      },
      {
        id: 'transfers-alias-management-link',
        icon: 'arb-icon-Two-Arrows',
        text: this.translate([
          'pending-actions.transfer-title',
          'transfer.alias-management',
          'alias-management.link',
        ]),
        url: '/transfer/alias-management',
        hidden: !AuthenticationUtils.hasAccess('AliasManagement'),
      },
      {
        id: 'transfers-alias-management-unlink',
        icon: 'arb-icon-Two-Arrows',
        text: this.translate([
          'pending-actions.transfer-title',
          'transfer.alias-management',
          'alias-management.unlink',
        ]),
        url: '/transfer/alias-management',
        hidden: !AuthenticationUtils.hasAccess('AliasManagement'),
      },
    ];
  }

  addCardsItems(): SearchListOptionsModel[] {
    if (!AuthenticationUtils.serviceIsActive('CardsManagement')) return [];

    return [
      {
        id: 'cards-business-cards-cancel-card',
        icon: 'arb-icon-card',
        text: this.translate([
          'cards.cards',
          'cards.business-cards',
          'cards.cancel.title',
        ]),
        url: '/cards/business-block',
        hidden: !(
          AuthenticationUtils.hasAccess('BlockBusinessCards') &&
          AuthenticationUtils.isSolePropertyCompany
        ),
      },
      {
        id: 'cards-business-cards-view-card',
        icon: 'arb-icon-card',
        text: this.translate([
          'cards.cards',
          'cards.business-cards',
          'search.view-card',
        ]),
        url: '/cards',
        hidden: !AuthenticationUtils.hasAccess('DisplayBusinessCards'),
      },
      {
        id: 'cards-mada-cards-cancel-card',
        icon: 'arb-icon-card',
        text: this.translate([
          'cards.cards',
          'cards.debit-cards',
          'cards.cancel.title',
        ]),
        url: '/cards/mada-suspend',
        hidden: !AuthenticationUtils.hasAccess('CancelDebitCards'),
      },
      {
        id: 'cards-mada-cards-view-card',
        icon: 'arb-icon-card',
        text: this.translate([
          'cards.cards',
          'cards.debit-cards',
          'search.view-card',
        ]),
        url: '/cards',
        hidden: !AuthenticationUtils.hasAccess('DisplayDebitCards'),
      },
      {
        id: 'cards-prepaid-cards-cancel-card',
        icon: 'arb-icon-card',
        text: this.translate([
          'cards.cards',
          'cards.prepaid-cards',
          'cards.cancel.title',
        ]),
        url: '/cards/prepaid-cancel',
        hidden: !AuthenticationUtils.hasAccess(
          'PrepaidCardsClosureRequestReplacement'
        ),
      },
      {
        id: 'cards-prepaid-cards-view-card',
        icon: 'arb-icon-card',
        text: this.translate([
          'cards.cards',
          'cards.prepaid-cards',
          'search.view-card',
        ]),
        url: '/cards',
        hidden: !AuthenticationUtils.hasAccess('DisplayPrepaidCards'),
      },
      {
        id: 'cards-apply-for-new-card',
        icon: 'arb-icon-card',
        text: this.translate(['cards.cards', 'cards.apply-for-new-card']),
        url: '/cards/apply-new-card',
        hidden: !(
          AuthenticationUtils.hasAccess('RequestNewPrepaidCard') ||
          AuthenticationUtils.hasAccess('RequestNewDebitCard')
        ),
      },
      {
        id: 'cards-card-number',
        icon: 'arb-icon-card',
        text: this.translate(['cards.cards', 'cards.card-number']),
        url: '/cards',
        hidden: false,
      },
    ];
  }

  addAccountManagementItems(): SearchListOptionsModel[] {
    if (
      !(
        AuthenticationUtils.serviceIsActive('AccountsManagement') ||
        AuthenticationUtils.serviceIsActive('ChequeManagement')
      )
    )
      return [];

    return [
      {
        id: 'account-management-my-document-user-approval-status',
        icon: 'arb-icon-userInfo',
        text: this.translate([
          'search.account-management',
          'accounts.documents.name',
          'public.approvalStatus',
        ]),
        url: '/accounts/documents/balanceCertificate/request-status',
        hidden: !AuthenticationUtils.hasAccess('documents'),
      },
      {
        id: 'account-management-my-document-request-new-document',
        icon: 'arb-icon-userInfo',
        text: this.translate([
          'search.account-management',
          'accounts.documents.name',
          'accounts.documents.requestNewDoc',
        ]),
        url: '/accounts/documents/request-new',
        hidden: !AuthenticationUtils.hasAccess('documents'),
      },
      {
        id: 'account-management-vat-invoice-vat-statement',
        icon: 'arb-icon-userInfo',
        text: this.translate([
          'search.account-management',
          'accounts.vat-title',
          'accounts.vat-statement',
        ]),
        url: '/accounts/vat',
        hidden: !AuthenticationUtils.hasAccess('TaxInvoice'),
      },
      {
        id: 'account-management-cheques-request-new-chequeBook',
        icon: 'arb-icon-userInfo',
        text: this.translate([
          'search.account-management',
          'accounts.cheques.title',
          'accounts.cheques.reqNewChequeBook',
        ]),
        url: '/cheques/create',
        hidden: !AuthenticationUtils.hasAccess('ChequeManagement'),
      },
      {
        id: 'account-management-cheques-stop-chequebook',
        icon: 'arb-icon-userInfo',
        text: this.translate([
          'search.account-management',
          'accounts.cheques.title',
          'accounts.cheques.stop-type.stop',
        ]),
        url: '/cheques/delete',
        hidden: !AuthenticationUtils.hasAccess('ChequeManagement'),
      },
      {
        id: 'account-management-cheques-cheque-number',
        icon: 'arb-icon-userInfo',
        text: this.translate([
          'search.account-management',
          'accounts.cheques.title',
          'accounts.cheques.chequeNo',
        ]),
        url: '/cheques',
        hidden: !AuthenticationUtils.hasAccess('ChequeManagement'),
      },
      {
        id: 'account-management-open-additional-account',
        icon: 'arb-icon-userInfo',
        text: this.translate([
          'search.account-management',
          'accounts.open-new-acc',
        ]),
        url: '/accounts/add-account',
        hidden: !AuthenticationUtils.hasAccess('companyAdmin'),
      },
      {
        id: 'account-management-account-number-online-statements-nickname',
        icon: 'arb-icon-userInfo',
        text: this.translate([
          'search.account-management',
          'accounts.accountNum',
          'accounts.online-statement',
          'accounts.account-nickname',
        ]),
        url: '/accounts/statement',
        hidden: !AuthenticationUtils.hasAccess('AccountsMenu'),
      },
      {
        id: 'account-management-account-number-online-statements-number',
        icon: 'arb-icon-userInfo',
        text: this.translate([
          'search.account-management',
          'accounts.accountNum',
          'accounts.online-statement',
          'accounts.accountNum',
        ]),
        url: '/accounts/statement',
        hidden: !AuthenticationUtils.hasAccess('AccountsMenu'),
      },
      {
        id: 'account-management-account-number-online-statements-iban',
        icon: 'arb-icon-userInfo',
        text: this.translate([
          'search.account-management',
          'accounts.accountNum',
          'accounts.online-statement',
          'accounts.IBAN',
        ]),
        url: '/accounts/statement',
        hidden: !AuthenticationUtils.hasAccess('AccountsMenu'),
      },
      {
        id: 'account-management-accounts',
        icon: 'arb-icon-userInfo',
        text: this.translate(['search.account-management', 'accounts.acc']),
        url: '/accounts',
        hidden: !AuthenticationUtils.hasAccess('AccountsMenu'),
      },
      {
        id: 'account-management-balance',
        icon: 'arb-icon-userInfo',
        text: this.translate(['search.account-management', 'accounts.balance']),
        url: '/accounts',
        hidden: !AuthenticationUtils.hasAccess('AccountsMenu'),
      },
    ];
  }
}
