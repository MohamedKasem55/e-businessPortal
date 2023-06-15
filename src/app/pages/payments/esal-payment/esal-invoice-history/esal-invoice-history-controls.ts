import { AccountControl } from 'app/@core/model/dto/control/account-control';
import { AmountControl } from 'app/@core/model/dto/control/amount-control';
import { ButtonControl } from 'app/@core/model/dto/control/button-control';
import { DateControl } from 'app/@core/model/dto/control/date-control';
import { DropdownControl } from 'app/@core/model/dto/control/dropdown-control';
import { EmptyControl } from 'app/@core/model/dto/control/empty-control';
import { TextInputControl } from 'app/@core/model/dto/control/text-input-control';
import { FormModel } from 'app/@core/model/dto/formModel';
import { PopupInputModel } from 'app/@core/model/dto/popup.model';

export interface EsalParamsReq {
  invoiceNumber: string | null;
  billerName: string | null;
  payDateFrom: string | null;
  payDateTo: string | null;
  amountFrom: number | null;
  amountTo: number | null;
  page: number | null;
  rows: number | null;
}

export function getEsalInvoiceHistoryForm(): FormModel {
  return new FormModel({
    id: 'esalinvoice-historyForm',
    controls: {
      invoiceNumber: new TextInputControl({
        label: 'payments.esal.invoice-history.invoice-number',
        required: false,
        order: 1,
        columnCount: 6,
        value: '',
      }),
      supplierName: new TextInputControl({
        label: 'payments.esal.invoice-history.supplier-name',
        required: false,
        order: 2,
        columnCount: 6,
        value: '',
      }),
      supplierId: new TextInputControl({
        label: 'payments.esal.supplier-id',
        required: false,
        order: 3,
        columnCount: 6,
        value: '',
      }),
      buyerName: new TextInputControl({
        label: 'payments.esal.invoice-history.buyer-name',
        required: false,
        order: 4,
        columnCount: 6,
        value: '',
      }),
      bankName: new TextInputControl({
        label: 'payments.esal.invoice-history.bank-name',
        required: false,
        order: 5,
        columnCount: 6,
        value: '',
      }),
      accountNumber: new AccountControl({
        label: 'payments.esal.invoice-history.account-number',
        required: false,
        order: 6,
        value: null,
        controlOptions: {
          columnId: 'text',
          textField: 'value',
          options: [],
        },
        columnCount: 6,
      }),
      amount: new AmountControl({
        columnCount: 2,
        required: true,
        label: 'payments.esal.invoice-history.amount',
        order: 7,
        disable: true,
        value: '',
      }),
      status: new DropdownControl({
        label: 'payments.esal.invoice-history.status',
        required: false,
        order: 8,
        columnCount: 4,
        controlOptions: {
          columnId: '',
          textField: 'value',
          hasSearch: true,
        },
      }),
      cancelButton: new ButtonControl({
        order: 9,
        columnCount: 4,
        controlOptions: {
          id: 'cancel',
          type: 'secondary',
          text: 'public.cancel',
        },
      }),
      resetButton: new ButtonControl({
        order: 10,
        columnCount: 4,
        controlOptions: {
          id: 'reset',
          type: 'secondary',
          text: 'payments.bill-processed.reset',
        },
      }),
      searchButton: new ButtonControl({
        order: 11,
        columnCount: 4,
        controlOptions: {
          id: 'search',
          type: 'primary',
          text: 'public.search',
        },
      }),
    },
  });
}

export const getTrnxFilterPopup = (): PopupInputModel => {
  let form: FormModel = new FormModel({
    id: 'trnxFilterPopup',
    controls: {
      invoiceNumber: new TextInputControl({
        order: 1,
        columnCount: 12,
        class: 'text-start color-arb-primaryText ',
        label: 'payments.esal.invoice-history.invoice-number',
        value: '',
      }),
      billerName: new TextInputControl({
        order: 1,
        columnCount: 12,
        class: 'text-start color-arb-primaryText ',
        label: 'payments.esal.invoice-history.supplier-name',
        value: '',
      }),
      amountFrom: new TextInputControl({
        order: 1,
        columnCount: 12,
        label: 'accounts.statement.amountFrom',
        class: 'text-start color-arb-primaryText',
        value: '',
      }),
      amountTo: new TextInputControl({
        label: 'accounts.statement.amountTo',
        order: 1,
        columnCount: 12,
        class: 'text-start color-arb-primaryText ',
        value: '',
      }),
      payDateFrom: new DateControl({
        order: 1,
        columnCount: 12,
        label: 'accounts.statement.fromDate',
        class: 'text-start color-arb-primaryText ',
      }),
      payDateTo: new DateControl({
        order: 1,
        columnCount: 12,
        class: 'text-start color-arb-primaryText ',
        label: 'accounts.statement.toDate',
      }),

      empty: new EmptyControl({}),

      close: new ButtonControl({
        order: 2,
        columnCount: 4,
        controlOptions: {
          id: 'close',
          type: 'secondary',
          text: 'public.close',
        },
      }),
      reset: new ButtonControl({
        order: 2,
        columnCount: 4,
        controlOptions: {
          id: 'reset',
          type: 'secondary',
          text: 'public.reset',
        },
      }),
      search: new ButtonControl({
        order: 2,
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
