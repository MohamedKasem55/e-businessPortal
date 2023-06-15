import { TabModel } from 'arb-design-library/model/tab.model';
import { TitleModel } from 'arb-design-library/model/title.model';
import { TableHeaderType } from 'arb-design-library';
import { TableHeaderModel } from 'arb-design-library/model/table-header.model';
import { AccountsConstants } from '../../../@core/service/accounts/accounts-constants';
import { PopupInputModel } from '../../../@core/model/dto/popup.model';
import { FormModel } from '../../../@core/model/dto/formModel';
import { DropdownControl } from '../../../@core/model/dto/control/dropdown-control';
import { ButtonControl } from '../../../@core/model/dto/control/button-control';
import { TextControl } from '../../../@core/model/dto/control/text-control';
import { EmptyControl } from '../../../@core/model/dto/control/empty-control';
import { AccountControl } from '../../../@core/model/dto/control/account-control';
import { TextInputControl } from '../../../@core/model/dto/control/text-input-control';
import { AuthenticationUtils } from '../../../@core/utility/authentication-utils';

export const getDocumentTitle = (): TitleModel => {
  return {
    id: 'document-title',
    type: 'Page',
    title: 'accounts.documents.name',
    showArrow: true,
    endButtons: [
      {
        id: 'UserApprovalStatus',
        text: 'transfer.beneficiary.user-approval-status',
        type: 'secondary',
        isDisable: false,
      },
      {
        id: 'request-new',
        type: 'primary',
        text: 'accounts.documents.requestNewDoc',
        isDisable: !AuthenticationUtils.hasAccess('request-documents'),
      },
    ],
  };
};

export const getDocumentTabs = (): TabModel[] => {
  return [
    {
      text: 'accounts.documents.accStatement',
      value: 'accStatement',
    },
    {
      text: 'accounts.documents.docType.01',
      value: 'bnkCertificate',
    },
    {
      text: 'accounts.documents.ibanCertificate',
      value: 'ibanCertificate',
    },
    {
      text: 'accounts.documents.balance-certificate.name',
      value: 'balanceCertificate',
    },
    {
      text: 'accounts.documents.monthlyStatement',
      value: 'monthlyStatement',
    },
    {
      text: 'accounts.documents.requestedStatement',
      value: 'requestedStatement',
    },
  ];
};

export const getDocumentsTableHeaders = (): TableHeaderModel[] => {
  return [
    {
      title: 'accounts.documents.creationDate',
      fieldName: 'creationDate',
      type: TableHeaderType.DATE_TEXT,
      controlOptions: {
        format: 'YYYY-MM-dd hh:mm:ss',
      },
    },
    {
      title: 'accounts.documents.status.name',
      fieldName: 'docReqStatus',
      type: TableHeaderType.BUTTON,
      mapObject: AccountsConstants.DOCUMENTS_STATUS['status'],
      controlOptions: {
        id: 'docReqStatus',
        text: 'docReqStatus',
        disableCondition: !'01',
      },
    },
  ];
};

export const getMonthlyStatementTableHeaders = (): TableHeaderModel[] => {
  return [
    {
      title: 'accounts.documents.monthlyStatement',
      fieldName: 'date',
      type: TableHeaderType.DATE_TEXT,
      controlOptions: {
        format: 'MMMM YYYY',
      },
    },
    {
      title: 'public.download',
      fieldName: 'month',
      type: TableHeaderType.BUTTON,
      controlOptions: {
        id: 'download-id',
        text: 'public.download',
        prefixIcon: 'arb-icon-arrowDownBox',
        columnId: 'month',
      },
    },
  ];
};

export const getBalanceCertificateTableHeaders = (): TableHeaderModel[] => {
  return [
    {
      title: 'accounts.documents.balance-certificate.req-date',
      fieldName: 'requestDate',
      type: TableHeaderType.TEXT,
    },
    {
      title: 'accounts.acc',
      fieldName: 'account',
      type: TableHeaderType.TEXT,
    },
    {
      title: 'accounts.documents.balance-certificate.company',
      fieldName: 'company',
      type: TableHeaderType.TEXT,
    },
    {
      title: 'accounts.documents.balance-certificate.city',
      fieldName: 'city',
      type: TableHeaderType.TEXT,
    },
    {
      title: 'accounts.documents.balance-certificate.postal-code',
      fieldName: 'postalCode',
      type: TableHeaderType.TEXT,
    },
  ];
};

export const getRequestedStatementTableHeaders = (): TableHeaderModel[] => {
  return [
    {
      title: 'accounts.documents.requestStatementFiles',
      fieldName: 'fileName',
      type: TableHeaderType.BUTTON,
      controlOptions: {
        id: 'download-req-stat-id',
        text: 'fileName',
        columnId: 'fileName',
      },
    },
    {
      title: 'public.delete',
      fieldName: '',
      type: TableHeaderType.BUTTON,
      controlOptions: {
        id: 'delete-id',
        text: 'public.delete',
        prefixIcon: 'arb-icon-Trash',
        columnId: 'fileName',
      },
    },
  ];
};

export const getRequestedStatementPopUpDetails = (): PopupInputModel => {
  return {
    title: 'accounts.documents.requestedStatement',
    form: new FormModel({
      id: 'requestStatementPopupForm',
      controls: {
        text: new TextControl({
          order: 1,
          columnCount: 12,
          label: 'accounts.documents.requestedStatementDeleteQuestion',
          class: 'color-arb-primaryText font-h2-bold',
        }),
        empty: new EmptyControl({
          order: 2,
          columnCount: 12,
        }),
        close: new ButtonControl({
          order: 3,
          columnCount: 6,
          controlOptions: {
            id: 'close',
            type: 'secondary',
            text: 'public.close',
          },
        }),
        delete: new ButtonControl({
          label: 'public.delete',
          order: 4,
          columnCount: 6,
          controlOptions: {
            id: 'delete',
            type: 'danger',
            isDisable: false,
            prefixIcon: 'arb-icon-Trash',
            text: 'public.delete',
          },
        }),
      },
    }),
  };
};

export const getMonthlyStatementPopUpDetails = (): PopupInputModel => {
  return {
    title: 'accounts.documents.monthly-statement-pop-title',
    form: new FormModel({
      id: 'MonthlyStatementPopupForm',
      controls: {
        docType: new DropdownControl({
          label: 'accounts.documents.docType.selectType',
          hidden: false,
          required: true,
          order: 1,
          controlOptions: {
            columnId: 'key',
            textField: 'value',
            options: getMonthlyStatementTypesObject(),
            hasSearch: true,
          },
          columnCount: 12,
          validationLabels: {
            required: 'accounts.documents.monthly-statement-docType-validation',
          },
        }),
        close: new ButtonControl({
          order: 2,
          columnCount: 4,
          controlOptions: {
            id: 'close',
            type: 'secondary',
            text: 'public.close',
          },
        }),
        print: new ButtonControl({
          order: 3,
          columnCount: 4,
          controlOptions: {
            id: 'print',
            type: 'secondary',
            isDisable: true,
            prefixIcon: 'arb-icon-Printer',
            text: 'public.print',
          },
        }),
        download: new ButtonControl({
          label: 'accounts.documents.docType.selectType',
          order: 4,
          columnCount: 4,
          controlOptions: {
            id: 'download',
            type: 'primary',
            isDisable: true,
            prefixIcon: 'arb-icon-pdf',
            text: 'public.download',
          },
        }),
      },
    }),
  };
};

export const getMonthlyStatementTypesObject = (): any[] => {
  return [
    {
      key: 'pdf',
      value: 'accounts.documents.monthlyStatementDocType.pdf',
    },
    {
      key: 'xls',
      value: 'accounts.documents.monthlyStatementDocType.xls',
    },
  ];
};

export const getDocumentFilterPopup = (): PopupInputModel => {
  let form: FormModel = new FormModel({
    id: 'trnxFilterPopup',
    controls: {
      docStatus: new DropdownControl({
        order: 1,
        columnCount: 6,
        class: 'text-start color-arb-primaryText ',
        label: 'accounts.documents.docStatus',
        controlOptions: {
          columnId: 'key',
          textField: 'value',
          hasSearch: true,
        },
      }),
      accounts: new AccountControl({
        order: 2,
        columnCount: 6,
        label: 'accounts.accountSelect',
        class: 'text-start color-arb-primaryText ',
      }),
      requesterId: new TextInputControl({
        order: 2,
        columnCount: 6,
        label: 'accounts.documents.requesterId',
        class: 'text-start color-arb-primaryText ',
        value: '',
      }),
      empty: new EmptyControl({
        order: 3,
        columnCount: 12,
      }),
      empty1: new EmptyControl({
        order: 3,
        columnCount: 12,
      }),
      close: new ButtonControl({
        order: 4,
        columnCount: 4,
        controlOptions: {
          id: 'close',
          type: 'secondary',
          text: 'public.close',
        },
      }),
      reset: new ButtonControl({
        order: 5,
        columnCount: 4,
        controlOptions: {
          id: 'reset',
          type: 'secondary',
          text: 'public.reset',
        },
      }),
      search: new ButtonControl({
        order: 6,
        columnCount: 4,
        controlOptions: {
          id: 'search',
          type: 'secondary',
          text: 'public.search',
        },
      }),
    },
  });
  return {
    form: form,
  };
};
