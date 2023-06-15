import {TableHeaderModel} from "arb-design-library/model/table-header.model";
import {FormModel} from "../../../../../@core/model/dto/formModel";
import {TableControl} from "../../../../../@core/model/dto/control/table-control";
import {TitleControl} from "../../../../../@core/model/dto/control/title-control";
import {ControlBase} from "../../../../../@core/model/dto/control/control.model";
import {NumberInputControl} from "../../../../../@core/model/dto/control/number-input-control";
import {TableHeaderType} from "arb-design-library";
import {TitleModel} from "arb-design-library/model/title.model";
import {UserDetailsRes} from "../../../../../@core/model/rest/company-admin/user-details/user-details-res";
import {ValidationsEnum} from "../../../../../@core/model/dto/validations-enum";

export const getAccountsLevelsTableHeaders = (currency: any): TableHeaderModel[] => {
  return [
    {
      title: "company-admin.user-accounts.nickname",
      type: TableHeaderType.TEXT,
      fieldName: 'alias'
    },
    {
      title: "company-admin.user-accounts.iban",
      type: TableHeaderType.TEXT,
      fieldName: 'ibanNumber'
    },
    {
      title: "company-admin.user-accounts.currency",
      type: TableHeaderType.TEXT,
      fieldName: 'currency',
      mapObject: currency
    },
    {
      title: "company-admin.user-accounts.levels",
      type: TableHeaderType.ACCOUNT_LEVELS,
      fieldName: 'accountLevels'
    }
  ]
}


export const getEditUserAccountsForm = (userDtls: UserDetailsRes | null, currency:any) => {
  let data: any[] | undefined = undefined;
  if (userDtls) {
    data = [];
    userDtls.checkaccountlist.forEach((account) => {
      let selectedAccount: any = {}
      selectedAccount = {
        ...account,
        accNum: account.fullAccountNumber,
        nickname: account.alias

      };
      account.accountLevels?.forEach((level, index) => {
        const levels = index + 1;
        selectedAccount['L' + levels] = level
      });
      if (data)
        data.push(selectedAccount);
    })
  }
  return new FormModel({
    id: 'EdituserAccountsForm',
    controls: {
      functionalityTable: new TableControl({
        columnCount: 12,
        order: 2,
        controlOptions: {
          title: 'company-admin.user-info.select-account',
          data: data,
          pageSizes: [50, 100],
          paginationValue: {
            page: 1,
            size: 50
          },
          headers: [
            {
              title: 'transfer.userApproval.acc-num',
              fieldName: "accNum",
              type: TableHeaderType.TEXT
            },
            {
              title: 'company-admin.user-info.nickname',
              fieldName: "nickname",
              type: TableHeaderType.TEXT
            },
            {
              title: 'company-admin.user-info.currency',
              fieldName: "currency",
              type: TableHeaderType.TEXT,
              mapObject: currency
            },
            {
              title: 'Inquiry',
              fieldName: "inquiry",
              type: TableHeaderType.CHECK_BOX
            },
            {
              title: 'L1',
              fieldName: "L1",
              type: TableHeaderType.CHECK_BOX
            },
            {
              title: 'L2',
              fieldName: "L2",
              type: TableHeaderType.CHECK_BOX
            },
            {
              title: 'L3',
              fieldName: "L3",
              type: TableHeaderType.CHECK_BOX
            },
            {
              title: 'L4',
              fieldName: "L4",
              type: TableHeaderType.CHECK_BOX
            },
            {
              title: 'L5',
              fieldName: "L5",
              type: TableHeaderType.CHECK_BOX
            },
          ],
          columnId: 'accNum'
        }
      }),
      activatedServices: new TitleControl({
        columnCount: 12,
        order: 2,
        controlOptions: {
          id: "personalInfoId",
          title: 'Activated Services'
        }
      })
    }
  })
}


export const getAccountListTitle = (): TitleModel => {
  return {
    id: ' accountsListTitle',
    type: 'Section',
    title: "company-admin.user-accounts.selectedAccount",
  }
}
export const getActivatedServicesTitle = (): TitleModel => {
  return {
    id: ' accountsListTitle2',
    type: 'Section',
    title: "company-admin.user-accounts.activatedServices",
  };
}

export const getGroupsLimitsControls = (): [string, ControlBase<any>][] => {
  return [

    ['limitsPrivileges', new TitleControl({
      columnCount: 12,
      order: 5,

      controlOptions: {
        id: "personalInfoId",
        title: 'company-admin.user-accounts.userLimits'
      }
    })],
    ['dailyTransfer', new NumberInputControl({
      label: "company-admin.user-accounts.dailyTransfer",
      order: 6,
      columnCount: 4,
      required: true,

      validationLabels: {
        required: "public.validations.required"
      },
      value: '0'
    })],
    ['localTransferQuickPaymentLimits', new NumberInputControl({
      label: 'company-admin.user-accounts.quickPayment',
      order: 11,
      required: true,
      disable: true,
      hidden: true,
      columnCount: 4,

      validationLabels: {
        required: "public.validations.required"
      },
      value: '0'
    })],
    ['ownACCTransfer', new NumberInputControl({
      label: 'company-admin.user-accounts.ownACCTransfer',
      order: 8,
      columnCount: 4,
      required: true,
      disable: true,
      hidden: true,
      validators:[{ validation: ValidationsEnum.MAX, options: '2500' }],
      validationLabels: {
        required: "public.validations.required",
        max:'company-admin.user-accounts.localTransferQuickPaymentLimitsValidation'
      },
      value: '0'
    })],
    ['withinTransfer', new NumberInputControl({
      label: 'company-admin.user-accounts.withinTransfer',
      order: 10,
      required: true,
      disable: true,
      hidden: true,
      columnCount: 4,
      validationLabels: {
        required: "public.validations.required"
      },
      value: '0'
    })],
    ['localTransfer', new NumberInputControl({
      label: 'company-admin.user-accounts.localTransfer',
      order: 11,
      required: true,
      disable: true,
      hidden: true,
      columnCount: 4,
      validationLabels: {
        required: "public.validations.required"
      },
      value: '0'
    })],
    ['internationalTransfer', new NumberInputControl({
      label: 'company-admin.user-accounts.internationalTransfer',
      order: 13,
      columnCount: 4,
      required: true,
      disable: true,
      hidden: true,
      validationLabels: {
        required: "public.validations.required"
      },
      value: '0'
    })],
    ['billPayment', new NumberInputControl({
      label: "company-admin.user-accounts.billPayment",
      order: 6,
      columnCount: 4,
      required: true,
      disable: true,
      hidden: true,
      validationLabels: {
        required: "public.validations.required"
      },
      value: '0'
    })],
    ['governmentPayment', new NumberInputControl({
      label: "company-admin.user-accounts.governmentPayment",
      order: 7,
      columnCount: 4,
      required: true,
      disable: true,
      hidden: true,
      value: '0'
    })],
    ['esalLimit', new NumberInputControl({
      label: 'company-admin.user-accounts.esalLimit',
      order: 9,
      required: true,
      disable: true,
      hidden: true,
      validationLabels: {
        required: "public.validations.required"
      },
      columnCount: 4,
      value: '0'
    })],
    ['bulkLimit', new NumberInputControl({
      label: 'company-admin.user-accounts.bulkLimit',
      order: 14,
      columnCount: 4,
      required: true,
      disable: true,
      hidden: true,
      validationLabels: {
        required: "public.validations.required"
      },
      value: '0'
    })]
  ]
}
export const getEditUserServicesForm = () => {
  return new FormModel({
    id: 'EdituserServicesForm',
    controls: {}
  })
}
/**
 * index 0 = control name
 * index 1 = selection group control name
 * index 2 = group name for backend
 *
 * */

export const getLimitsMatrix = (): [string, string, string][] => {
  return [
    ['withinTransfer', 'groupListTransfers', 'TfGroup'],
    ['localTransfer', 'groupListTransfers', 'TfLocalGroup'],
    ['localTransferQuickPaymentLimits', 'groupListTransfers', 'TfLocalGroup'],
    ['internationalTransfer', 'groupListTransfers', 'TfRemGroup'],
    ['ownACCTransfer', 'groupListTransfers', 'TfOwnGroup'],
    ['governmentPayment', 'groupListPayments', 'EgovGroup'],
    ['billPayment', 'groupListBills', 'BillPayGroup'],
    ['bulkLimit', 'groupListPayments', 'BulkPaymentsGroup'],
    ['esalLimit', 'groupListSadadInvoiceHub', 'SadadInvoiceHubGroup']
  ];
}
