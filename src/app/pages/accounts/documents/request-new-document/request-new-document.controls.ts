import { FormModel, PageModel } from '../../../../@core/model/dto/formModel';
import { DropdownControl } from '../../../../@core/model/dto/control/dropdown-control';
import { SummaryModel } from 'arb-design-library/model/summary.model';
import { TitleModel } from 'arb-design-library/model/title.model';
import { AlertModel } from '../../../../@core/model/dto/alert.model';
import { DateControl } from '../../../../@core/model/dto/control/date-control';
import { TitleControl } from '../../../../@core/model/dto/control/title-control';
import { ButtonModel } from 'arb-design-library/model/button.model';
import { AccountControl } from '../../../../@core/model/dto/control/account-control';
import { TextInputControl } from '../../../../@core/model/dto/control/text-input-control';
import { ValidationsEnum } from '../../../../@core/model/dto/validations-enum';
import { NumberInputControl } from '../../../../@core/model/dto/control/number-input-control';
import { EmptyControl } from '../../../../@core/model/dto/control/empty-control';
import { TextControl } from '../../../../@core/model/dto/control/text-control';
import { ButtonControl } from '../../../../@core/model/dto/control/button-control';
import { KeyValueModel } from '../../../../@core/model/rest/common/key-value.model';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Utils } from '../../../../@core/utility/Utils';

/**
 *
 * Models
 *
 */
export const getRequestNewDocTitle = (): TitleModel => {
  return {
    id: 'requestNewDocTitle',
    type: 'Page',
    title: 'accounts.documents.requestNewDoc',
    showArrow: false,
    stepper: {
      steps: ['', '', ''],
      stepCounter: 1,
      stepText: 'public.step',
      ofText: 'public.of',
    },
  };
};
export const getPageModel = (): PageModel => {
  return new PageModel(
    1,
    new FormModel({
      id: 'requestNewDocForm',
      controls: {
        title: new TitleControl({
          order: 1,
          controlOptions: {
            id: 'string',
            type: 'Section',
            title: 'accounts.documents.new-doc',
          },
          columnCount: 12,
        }),
        docType: new DropdownControl({
          label: 'accounts.documents.docType.selectType',
          hidden: false,
          required: true,
          order: 1,
          controlOptions: {
            columnId: 'key',
            textField: 'value',
            options: getDocTypeObject(),
            hasSearch: true,
          },
          columnCount: 6,
          validationLabels: {
            required: 'public.validations.required',
          },
        }),
        accounts: new AccountControl({
          label: 'accounts.documents.select-account',
          hidden: true,
          required: true,
          order: 1,
          columnCount: 6,
          validationLabels: {
            required: 'public.validations.required',
          },
        }),
        docDetails: new TitleControl({
          hidden: true,
          order: 1,
          controlOptions: {
            id: 'string',
            type: 'Section',
            title: 'accounts.documents.doc-dtls',
          },
          columnCount: 12,
        }),
      },
    })
  );
};
export const getAlertModel = (): AlertModel => {
  return {
    id: 'doc-alert-model',
    type: 'Critical',
    title:
      'accounts.documents.document-fields-validation.doc-eligibility-alert-title',
    message: 'accounts.documents.document-fields-validation.doc-eligibility',
    showClose: true,
  };
};
/**
 *
 * Models end
 */

/**
 *
 * Forms
 *
 */

/**
 *
 * Bank Certificate
 *
 */
export const getBankCertificateControls = (): FormModel => {
  return new FormModel({
    id: 'bankCertificateForm',
    controls: {
      lang: new DropdownControl({
        label: 'accounts.documents.lang.name',
        required: true,
        order: 1,
        controlOptions: {
          columnId: 'key',
          textField: 'value',
          options: getLanguageObject(),
          hasSearch: true,
        },
        columnCount: 6,
        validationLabels: {
          required: 'public.validations.required',
        },
      }),
      date: new DateControl({
        label: 'accounts.documents.date',
        required: true,
        order: 2,
        columnCount: 6,
        validationLabels: {
          required: 'public.validations.required',
        },
      }),
    },
  });
};
/**
 *
 * Account Certificate
 *
 */
export const getAccountCertificateControls = (
  today: NgbDateStruct
): FormModel => {
  return new FormModel({
    id: 'accountStatementForm',
    controls: {
      lang: new DropdownControl({
        label: 'accounts.documents.lang.name',
        required: true,
        order: 1,
        controlOptions: {
          columnId: 'key',
          textField: 'value',
          options: getLanguageObject(),
          hasSearch: true,
        },
        columnCount: 6,
        validationLabels: {
          required: 'public.validations.required',
        },
      }),
      startDate: new DateControl({
        label: 'accounts.documents.startDate',
        required: true,
        order: 2,
        columnCount: 6,
        controlOptions: {
          maxDate: today,
        },
        validationLabels: {
          required: 'public.validations.required',
        },
      }),
      endDate: new DateControl({
        label: 'accounts.documents.endDate',
        required: true,
        order: 2,
        columnCount: 6,
        controlOptions: {
          maxDate: today,
        },
        validationLabels: {
          required: 'public.validations.required',
        },
      }),
    },
  });
};
/**
 *
 * IBAN Certificate
 *
 */
export const getIBANControls = (): FormModel => {
  return new FormModel({
    id: 'accountStatementForm',
    controls: {
      lang: new DropdownControl({
        label: 'accounts.documents.lang.name',
        required: true,
        order: 1,
        controlOptions: {
          columnId: 'key',
          textField: 'value',
          options: getLanguageObject(),
          hasSearch: true,
        },
        columnCount: 6,
        validationLabels: {
          required: 'public.validations.required',
        },
      }),
    },
  });
};
/**
 *
 * SWIFT Statement
 *
 */
export const getSWIFTStatementControls = (): FormModel => {
  return new FormModel({
    id: 'swiftStatementForm',
    controls: {
      empty: new EmptyControl({
        order: 1,
        columnCount: 12,
      }),
      title: new TitleControl({
        columnCount: 12,
        order: 2,
        controlOptions: {
          id: 'selectStatement',
          type: 'Section',
          title: 'accounts.documents.select-Statement',
        },
      }),
      empty1: new EmptyControl({
        columnCount: 12,
        order: 3,
      }),

      freqDaily: new TextControl({
        order: 4,
        columnCount: 2,
        label: 'accounts.swift-daily-file',
        class: 'text-start color-arb-primaryText ',
      }),
      daily: new DropdownControl({
        label: 'accounts.frequency',
        order: 5,
        disable: true,
        controlOptions: {
          columnId: 'key',
          textField: 'value',
          options: [],
          hasSearch: true,
        },
        columnCount: 6,
        validationLabels: {
          required: 'public.validations.required',
        },
      }),
      empty3: new EmptyControl({
        columnCount: 1,
        order: 6,
      }),
      downloadDaily: new ButtonControl({
        order: 6,
        columnCount: 3,
        controlOptions: {
          id: 'downloadDaily',
          type: 'primary',
          prefixIcon: 'arb-icon-arrowDownBox',
          text: 'public.download',
          isDisable: true,
        },
      }),
      empty2: new EmptyControl({
        columnCount: 12,
        order: 6,
      }),

      freqMonthly: new TextControl({
        order: 7,
        columnCount: 2,
        label: 'accounts.swift-monthly-file',
        class: 'text-start color-arb-primaryText ',
      }),
      monthly: new DropdownControl({
        label: 'accounts.frequency',
        hidden: false,
        required: true,
        disable: true,
        order: 8,
        controlOptions: {
          columnId: 'key',
          textField: 'value',
          options: [],
          hasSearch: true,
        },
        columnCount: 6,
        validationLabels: {
          required: 'public.validations.required',
        },
      }),
      empty4: new EmptyControl({
        columnCount: 1,
        order: 9,
      }),
      downloadMonthly: new ButtonControl({
        order: 9,
        columnCount: 3,
        controlOptions: {
          id: 'downloadMonthly',
          type: 'primary',
          prefixIcon: 'arb-icon-arrowDownBox',
          text: 'public.download',
          isDisable: true,
        },
      }),
    },
  });
};
/**
 *
 * Balance Certificate
 *
 */
export const getBalanceCertificateControls = (): FormModel => {
  return new FormModel({
    id: 'monthlyStatementForm',
    controls: {
      title: new TitleControl({
        columnCount: 12,
        order: 1,
        controlOptions: {
          id: 'certificateDtls',
          type: 'Section',
          title: 'accounts.documents.select-Statement',
        },
      }),
      city: new DropdownControl({
        columnCount: 6,
        order: 1,
        required: true,
        label: 'accounts.documents.balance-certificate.city',
        validationLabels: {
          required: 'public.validations.required',
        },
        controlOptions: {
          columnId: 'key',
          textField: 'value',
          hasSearch: true,
          options: [],
        },
      }),
      company: new TextInputControl({
        order: 1,
        columnCount: 6,
        required: true,
        validationLabels: {
          required: 'public.validations.required',
        },
        label: 'accounts.documents.balance-certificate.company',
        value: '',
      }),
      postalCode: new NumberInputControl({
        order: 1,
        columnCount: 6,
        required: true,
        validators: [
          { validation: ValidationsEnum.MAX_LENGTH, options: '5' },
          { validation: ValidationsEnum.DIGIT_ONLY },
        ],
        validationLabels: {
          required: 'public.validations.required',
        },
        label: 'accounts.documents.balance-certificate.postal-code',
        value: '',
      }),
    },
  });
};
/**
 * Requested Statement
 * */
export const getRequestedStatementControls = (): FormModel => {
  let maxDate = Utils.getToday();
  maxDate.month += 1;

  return new FormModel({
    id: 'request-statement-form',
    controls: {
      empty: new EmptyControl({}),
      lang: new DropdownControl({
        label: 'accounts.documents.request-statement.lang',
        order: 1,
        columnCount: 6,
        controlOptions: {
          columnId: 'key',
          textField: 'value',
          options: getLanguageObject(),
          hasSearch: true,
        },
        required: true,
        validationLabels: {
          required: 'public.validations.required',
        },
      }),
      type: new DropdownControl({
        label: 'accounts.documents.request-statement.do-type',
        order: 2,
        columnCount: 6,
        controlOptions: {
          columnId: 'key',
          textField: 'value',
          options: getFileTypeObject(),
          hasSearch: true,
        },
        required: true,
        validationLabels: {
          required: 'public.validations.required',
        },
      }),
      fromDate: new DateControl({
        label: 'accounts.documents.request-statement.fromDate',
        order: 3,
        columnCount: 6,
        controlOptions: {
          minDate: {
            day: 1,
            month: 1,
            year: 1900,
          },
          maxDate: maxDate,
        },
        class: 'text-start color-arb-primaryText ',
      }),
      toDate: new DateControl({
        label: 'accounts.documents.request-statement.toDate',
        order: 4,
        columnCount: 6,
        controlOptions: {
          minDate: {
            day: 1,
            month: 1,
            year: 1900,
          },
          maxDate: maxDate,
        },
        class: 'text-start color-arb-primaryText ',
      }),
      fromRange: new NumberInputControl({
        label: 'accounts.documents.request-statement.range-from',
        order: 5,
        columnCount: 6,
        class: 'text-start color-arb-primaryText ',
        value: '',
      }),
      toRange: new NumberInputControl({
        label: 'accounts.documents.request-statement.range-to',
        order: 6,
        columnCount: 6,
        class: 'text-start color-arb-primaryText ',
        value: '',
      }),
      transType: new DropdownControl({
        label: 'accounts.documents.request-statement.transaction-type',
        order: 7,
        columnCount: 6,
        controlOptions: {
          columnId: 'key',
          textField: 'value',
          options: getTransactionTypeObject(),
          hasSearch: true,
        },
        required: true,
        validationLabels: {
          required: 'public.validations.required',
        },
      }),
      filter: new DropdownControl({
        label: 'accounts.documents.request-statement.transaction-filter',
        order: 8,
        columnCount: 6,
        value: [],
        controlOptions: {
          textField: 'value',
          columnId: 'key',
          isCheckboxList: true,
          hasSearch: true,
        },
      }),
    },
  });
};
/**
 *
 * Forms
 *
 */

/**
 *
 * Controls
 *
 */
export const getStartButton = (): ButtonModel => {
  return {
    id: 'back',
    type: 'secondary',
    text: 'public.back',
    isDisable: false,
  };
};
export const getEndButton = (): ButtonModel => {
  return {
    id: 'next',
    type: 'primary',
    text: 'public.next',
    isDisable: true,
  };
};
export const getSummaryEndButton = (): ButtonModel[] => {
  return [
    {
      id: 'to-dashboard',
      type: 'secondary',
      text: 'accounts.documents.balance-certificate.to-dashboard',
    },
    {
      id: 'to-docs',
      type: 'primary',
      text: 'accounts.documents.balance-certificate.to-docs',
    },
  ];
};
/**
 *
 * Controls End
 *
 */

export const getDocTypeObject = (): KeyValueModel[] => {
  return [
    {
      key: '01',
      value: 'accounts.documents.docType.01',
    },
    {
      key: '02',
      value: 'accounts.documents.docType.02',
    },
    {
      key: '05',
      value: 'accounts.documents.docType.05',
    },
    //These keys are not referencing any backend keys
    {
      key: '101',
      value: 'accounts.documents.balance-certificate.name',
    },
    {
      key: '102',
      value: 'accounts.documents.swift',
    },
    {
      key: '103',
      value: 'accounts.documents.request-statement.name',
    },
  ];
};
export const getFileTypeObject = (): KeyValueModel[] => {
  return [
    {
      key: 'X',
      value: 'accounts.documents.request-statement.statementDocType.xls',
    },
    {
      key: 'P',
      value: 'accounts.documents.request-statement.statementDocType.pdf',
    },
  ];
};
export const getTransactionTypeObject = (): KeyValueModel[] => {
  return [
    {
      key: '0',
      value: 'accounts.documents.request-statement.all-trnx',
    },
    {
      key: '1',
      value: 'accounts.documents.request-statement.credit-trnx',
    },
    {
      key: '2',
      value: 'accounts.documents.request-statement.debit-trnx',
    },
  ];
};
export const getLanguageObject = (): KeyValueModel[] => {
  return [
    {
      key: 'AR',
      value: 'accounts.documents.lang.AR',
    },
    {
      key: 'EN',
      value: 'accounts.documents.lang.EN',
    },
  ];
};
export const getSummery = () => {
  const summaryModel: SummaryModel = {
    title: {
      id: 'summary-title',
      type: 'Section',
      title: 'Summary',
    },
    sections: [
      {
        items: [],
      },
    ],
  };
  return summaryModel;
};
