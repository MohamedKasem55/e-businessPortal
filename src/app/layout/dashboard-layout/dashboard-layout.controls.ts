import {AuthenticationUtils} from "../../@core/utility/authentication-utils";
import {POS} from "../../@core/constants/pages-urls-constants";
import {ListItemModel} from "arb-design-library/model/list-item.model";
import {DropdownOptionsModel} from "arb-design-library/model/dropdown-options.model";


export function dashboardLayoutControls(): ListItemModel[] {
  return [
    {
      url: '/dashboard',
      id: 'Dashboard',
      text: 'public.dashboard',
      icon: 'arb-icon-Home',
      isLightMenu: true,
    },
    {
      url: '/accounts',
      id: 'public.account',
      text: 'public.accounts',
      isHidden: !(AuthenticationUtils.serviceIsActive('AccountsManagement') || AuthenticationUtils.serviceIsActive('ChequeManagement')),
      icon: 'arb-icon-userInfo',
      isLightMenu: true,
    },
    {
      url: '/transfer',
      id: 'Transfers',
      text: 'transfer.transfer',
      icon: 'arb-icon-Two-Arrows',
      isHidden: !AuthenticationUtils.serviceIsActive('TransfersManagement'),
      isLightMenu: true,
    },
    {
      url: '/payments',
      id: 'Payments',
      text: 'payments.payment',
      icon: 'arb-icon-Bill',
      isHidden: !(AuthenticationUtils.serviceIsActive('PaymentsManagement') || AuthenticationUtils.serviceIsActive('SadadManagement')),
      isLightMenu: true,
    },
    {
      url: '/cards',
      id: 'Cards',
      text: 'cards.cards',
      icon: 'arb-icon-card',
      isHidden: !AuthenticationUtils.serviceIsActive('CardsManagement'),
      isLightMenu: true,
    },
    {
      url: '/payroll',
      id: 'Payroll',
      text: 'payroll.main-page-name',
      icon: 'arb-icon-documentWithCurrencySR',
      isHidden: !AuthenticationUtils.serviceIsActive('PayrollManagement'),
      isLightMenu: true,
    },
    {
      url: '/' + POS,
      id: 'Point of Sale',
      text: 'pos.dashboard.title',
      icon: 'arb-icon-Store',
      isHidden: !AuthenticationUtils.serviceIsActive('CollectionsManagement'),
      isLightMenu: true,
    },
    // {
    //   url: '/finance',
    //   id: 'Finance',
    //   text: 'Finance',
    //   icon: 'arb-icon-lineChart',
    //   isHidden: !AuthenticationUtils.serviceIsActive('FinanceProduct'),
    //   isLightMenu: true,
    // },
    {
      url: '/accounts/bfm',
      id: 'BusinessFinanceManager',
      text: 'accounts.bfm',
      icon: 'arb-icon-barChart',
      isHidden: !AuthenticationUtils.serviceIsActive('BusinessFinanceManagement'),
      isLightMenu: true,
    },
    {
      url: '/gold-wallet',
      id: 'Gold Wallet',
      text: 'gold-wallet.title',
      icon: 'arb-icon-gold',
      isHidden: !AuthenticationUtils.serviceIsActive('GoldWallet'),
      isLightMenu: true,
    },
    {
      url: '/payments/aramco-payment',
      id: 'payments.boxes.aramco-payment.title',
      text: 'payments.boxes.aramco-payment.title',
      icon: 'arb-icon-logoAramco',
      isHidden: !AuthenticationUtils.hasAccess('AramcoPaymentMenu'),
      isLightMenu: false,
    },
    {
      url: "/business-hub",
      id: "BusinessHub",
      text: "businessHub.businessHubTitle",
      icon: "arb-icon-briefcase",
      isHidden: !AuthenticationUtils.hasAccess('BusinessHub'),
      isLightMenu: true,
    },
    {
      url: '/representatives',
      id: 'Representatives',
      text: 'representatives.title',
      icon: 'arb-icon-smallUserLargeUser',
      isHidden: !AuthenticationUtils.serviceIsActive('RepresentativesManagement'),
      isLightMenu: false,
    },
    {
      url: 'company-admin',
      id: 'companyadmin',
      text: 'company-admin.name',
      icon: 'arb-icon-building',
      isHidden: !AuthenticationUtils.hasAccess('AdminManagement'),
      isLightMenu: true,
    },
    {
      url: '/cash-management-products',
      id: 'Financial Products',
      text: 'financial-products.title',
      icon: 'arb-icon-cart',
      isHidden: !AuthenticationUtils.serviceIsActive('CashManagementProducts'),
      isLightMenu: false,
    },

    {
      url: '/help',
      id: 'Help',
      text: 'help.title',
      icon: 'arb-icon-chatCircle',
      isLightMenu: true,
    },
    /*{
  url: "application-agreement",
  id: "Application & agreement",
  text: "Application & agreement",
  icon: "arb-icon-document",
  },
  {
  url: "fees-information",
  id: "Fees information",
  text: "Fees information",
  icon: "arb-icon-exclamation",
  },
  {
  url: "letter-guarantee",
  id: "Letter Guarantee",
  text: "Letter Guarantee",
  icon: "arb-icon-documentShield",
  },
  {
  url: "collection-management",
  id: "Collection Management",
  text: "Collection Management",
  icon: "arb-icon-billAmount",
  } ,
  {
   url: "self-on-boarding",
   id: "Self onBoarding",
   text: "Self onBoarding",
   icon: "arb-icon-flagCurved",
  },*/
  ];
}


export function profileMenuItemsControls(): DropdownOptionsModel[] {
  return [
    {
      id: 'user-profile',
      disabled: false,
      text: 'manage-alerts.userProfile',
      icon: 'arb-icon-userInsideBorder',
    },
    {
      id: 'manageAlerts',
      disabled: false,
      text: 'manage-alerts.title',
      icon: 'arb-icon-bell',
    },
    {
      id: 'changePassword',
      disabled: false,
      text: 'public.changePassword',
      icon: 'arb-icon-keyPrivate',
    },
    {
      id: 'relationship',
      disabled: false,
      text: 'preferences.relationshipManager',
      icon: 'arb-icon-userGroup',
    },
    {
      id: 'organizationDetails',
      disabled: false,
      text: 'organizationDetails.title',
      icon: 'arb-icon-building',
    },
    {
      id: 'activityLogs',
      disabled: false,
      text: 'activityLogs.activitylogsTitle',
      icon: 'arb-icon-Document-Status',
    },
    {
      id: 'fxRates',
      disabled: false,
      text: 'public.fxRatesTitle',
      icon: 'arb-icon-Two-Arrows',
      hasBorder: true
    },
    {
      id: 'theme',
      disabled: false,
      text: '',
      icon: 'arb-icon-circle3Dots',
    },

    {
      id: 'Lang',
      disabled: false,
      text: 'public.lang',
      icon: 'arb-icon-world',
      hasBorder: true
    },

    {
      id: 'Logout',
      disabled: false,
      isDanger: true,
      text: 'public.logout',
      icon: 'arb-icon-arrowLeftLine',
    },
  ];
}
