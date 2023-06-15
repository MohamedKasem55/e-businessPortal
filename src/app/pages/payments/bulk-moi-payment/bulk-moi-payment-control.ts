import { AccountControl } from 'app/@core/model/dto/control/account-control';
import { ButtonControl } from 'app/@core/model/dto/control/button-control';
import { EmptyControl } from 'app/@core/model/dto/control/empty-control';
import { LineCardControl } from 'app/@core/model/dto/control/line-card-control';
import { TitleControl } from 'app/@core/model/dto/control/title-control';
import { UploadControl } from 'app/@core/model/dto/control/upload-control';
import { FormModel } from 'app/@core/model/dto/formModel';
import { Account } from 'app/@core/model/rest/common/account';
import { TableHeaderType } from 'arb-design-library';
import { ButtonModel } from 'arb-design-library/model/button.model';
import { TableHeaderModel } from 'arb-design-library/model/table-header.model';

export function PaymentOptionsForm(): FormModel {
  return new FormModel({
    id: 'bulk-payment-options',
    showDivider: true,
    controls: {
      title: new TitleControl({
        columnCount: 12,
        order: 1,
        controlOptions: {
          id: '',
          title: 'payments.bulk-payment.payment-options',
        },
      }),
      cardInfo1: new LineCardControl({
        columnCount: 3,
        order: 1,
        controlOptions: {
          title: 'payments.bulk-payment.issue-new-iqama',
          icon: 'arb-icon-check color-arb-positiveText',
          weight: 'Bold',
        },
      }),
      cardInfo2: new LineCardControl({
        columnCount: 3,
        order: 2,
        controlOptions: {
          title: 'payments.bulk-payment.renew-iqama',
          icon: 'arb-icon-check color-arb-positiveText',
          weight: 'Bold',
        },
      }),
      cardInfo3: new LineCardControl({
        columnCount: 3,
        order: 3,
        controlOptions: {
          title: 'payments.bulk-payment.exit-re-entry-visa-single',
          icon: 'arb-icon-check color-arb-positiveText',
          weight: 'Bold',
        },
      }),
      cardInfo4: new LineCardControl({
        columnCount: 3,
        order: 4,
        controlOptions: {
          title: 'payments.bulk-payment.exit-re-entry-visa-multiple',
          icon: 'arb-icon-check color-arb-positiveText',
          weight: 'Bold',
        },
      }),
    },
  });
}

export function AccountsForm(accounts: Account[]): FormModel {
  return new FormModel({
    id: 'AccountsBulkMoiPaymentForm',
    showDivider: true,
    controls: {
      title: new TitleControl({
        columnCount: 12,
        order: 1,
        controlOptions: {
          id: 'accounts-bulk-payment-title',
          title: 'payments.bulk-payment.select-account',
        },
      }),
      fromAccount: new AccountControl({
        label: 'payments.bulk-payment.select-account',
        required: true,
        order: 1,
        value: null,
        controlOptions: {
          columnId: 'accountPk',
          textField: ['fullAccountNumber', 'alias'],
          hasSearch: true,
          endTextField: 'availableBalance',
          endTextCurrencyField: 'currency',
          options: accounts,
          disabledField: 'disabled',
        },
        columnCount: 9,
        validationLabels: {
          required: 'payments.bulk-payment.account-required',
        },
      }),
      downloadButton: new ButtonControl({
        order: 2,
        columnCount: 3,
        controlOptions: {
          id: 'download',
          type: 'secondary',
          text: 'payments.bulk-payment.download-template',
          prefixIcon: 'arb-icon-arrowDownBox',
        },
      }),
    },
  });
}

export function UploadBulkMoiPaymentTemplate(): FormModel {
  return new FormModel({
    id: 'upload-template-id',
    controls: {
      empty: new EmptyControl({
        columnCount: 6,
        order: 1,
      }),
      title: new TitleControl({
        columnCount: 12,
        order: 1,
        controlOptions: {
          id: 'upload-bulk-payment-title',
          title: 'payments.bulk-payment.upload',
        },
      }),
      bulkPaymentTemplate: new UploadControl({
        label: 'payments.bulk-payment.upload',
        hidden: false,
        required: true,
        value: '',
        order: 1,
        columnCount: 12,
        controlOptions: { acceptedTypes: ['.xlsx'] },
        validationLabels: {
          required: 'payments.bulk-payment.file-upload-required',
        },
      }),
      note: new LineCardControl({
        columnCount: 12,
        order: 2,
        controlOptions: {
          title: 'payments.bulk-payment.note',
          subTitle: '',
          icon: 'arb-icon-exclamationBorder',
          weight: 'Regular',
        },
      }),
    },
  });
}

export const summaryHeaders = (
  appType: { key: string; value: string }[],
  jobCategory: { key: string; value: string }[]
): TableHeaderModel[] => {
  return [
    {
      title: 'payments.bulk-payment.applications-type',
      type: TableHeaderType.TEXT,
      fieldName: 'applicationsType',
      mapObject: appType,
    },
    {
      title: 'payments.bulk-payment.account',
      type: TableHeaderType.TEXT,
      fieldName: 'account',
    },
    {
      title: 'payments.bulk-payment.iqama-id-border-number',
      type: TableHeaderType.TEXT,
      fieldName: 'iqamaId',
    },
    {
      title: 'payments.bulk-payment.visa-iqama-duration',
      type: TableHeaderType.TEXT,
      fieldName: 'visaDuration',
    },
    {
      title: 'payments.bulk-payment.sponsor-id',
      type: TableHeaderType.TEXT,
      fieldName: 'sponsorId',
    },
    {
      title: 'payments.bulk-payment.job-category',
      type: TableHeaderType.TEXT,
      fieldName: 'jobCategory',
      mapObject: jobCategory,
    },
    {
      title: 'payments.bulk-payment.amount',
      type: TableHeaderType.AMOUNT_TEXT,
      fieldName: 'amount',
      controlOptions: {
        currency: 'currency',
      },
    },
  ];
};

export const getEndButtons = (): ButtonModel[] => {
  return [
    {
      id: 'cancel',
      text: 'public.cancel',
      type: 'secondary',
      isDisable: false,
    },
    {
      id: 'goToDashboard',
      type: 'secondary',
      text: 'payments.bulk-payment.go-to-dashboard',
    },
    {
      id: 'createNewBulkPayment',
      type: 'primary',
      text: 'payments.bulk-payment.create-new-bul-payment',
    },
    {
      id: 'Confirm',
      text: 'public.confirm',
      type: 'primary',
      isDisable: false,
    },
  ];
};
