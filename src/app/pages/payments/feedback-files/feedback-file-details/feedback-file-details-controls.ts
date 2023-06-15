import { TranslateService } from '@ngx-translate/core';
import { AccountControl } from 'app/@core/model/dto/control/account-control';
import { AmountControl } from 'app/@core/model/dto/control/amount-control';
import { ButtonControl } from 'app/@core/model/dto/control/button-control';
import { DropdownControl } from 'app/@core/model/dto/control/dropdown-control';
import { TextInputControl } from 'app/@core/model/dto/control/text-input-control';
import { FormModel } from 'app/@core/model/dto/formModel';
import { TextControl } from '../../../../@core/model/dto/control/text-control';
import { EmptyControl } from '../../../../@core/model/dto/control/empty-control';
import { PopupInputModel } from '../../../../@core/model/dto/popup.model';

export function getFeedbackFileDetailsForm(): FormModel {
  return new FormModel({
    id: 'feedbackFileDetailsForm',
    controls: {
      billName: new TextInputControl({
        label: 'payments.feedback-files.file-details.bill-name',
        required: false,
        order: 1,
        columnCount: 6,
        value: '',
      }),
      accountFrom: new AccountControl({
        label: 'payments.feedback-files.file-details.account-from',
        required: false,
        order: 2,
        value: null,
        controlOptions: {
          columnId: 'key',
          textField: 'value',
          options: [],
        },
        columnCount: 6,
      }),
      billRef: new TextInputControl({
        label: 'payments.feedback-files.file-details.bill-reference',
        required: false,
        order: 3,
        columnCount: 6,
        value: '',
      }),
      amount: new AmountControl({
        columnCount: 2,
        required: true,
        label: 'payments.feedback-files.file-details.amount',
        order: 4,
        disable: true,
        value: '',
      }),
      process: new DropdownControl({
        label: 'payments.feedback-files.file-details.process',
        required: false,
        order: 5,
        columnCount: 6,
        controlOptions: {
          columnId: 'process',
          textField: 'value',
          hasSearch: true,
        },
      }),
      status: new DropdownControl({
        label: 'payments.feedback-files.file-details.status',
        required: false,
        order: 6,
        columnCount: 4,
        controlOptions: {
          columnId: 'status',
          textField: 'value',
          hasSearch: true,
        },
      }),
      accountNumber: new AccountControl({
        label: 'payments.feedback-files.file-details.account-number',
        required: false,
        order: 2,
        value: null,
        controlOptions: {
          columnId: 'key',
          textField: 'value',
          options: [],
        },
        columnCount: 6,
      }),
      civilianId: new TextInputControl({
        label: 'payments.feedback-files.file-details.civilian-id',
        required: false,
        order: 3,
        columnCount: 6,
        value: '',
      }),
      type: new DropdownControl({
        label: 'payments.feedback-files.file-details.type',
        required: false,
        order: 4,
        columnCount: 6,
        controlOptions: {
          columnId: 'type',
          textField: 'value',
          hasSearch: true,
        },
        value: '',
      }),
      beneficiaryName: new TextInputControl({
        label: 'payments.feedback-files.file-details.beneficiary-name',
        required: false,
        order: 5,
        columnCount: 6,
        value: '',
      }),
      cancelButton: new ButtonControl({
        order: 7,
        columnCount: 4,
        controlOptions: {
          id: 'cancel',
          type: 'secondary',
          text: 'public.cancel',
        },
      }),
      resetButton: new ButtonControl({
        order: 8,
        columnCount: 4,
        controlOptions: {
          id: 'reset',
          type: 'secondary',
          text: 'payments.bill-processed.reset',
        },
      }),
      searchButton: new ButtonControl({
        order: 9,
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

export const deleteFileDetailsPopUp = (): PopupInputModel => {
  return {
    title: 'payments.feedback-files.file-details.title',
    image: 'assets/img/warning.svg',
    form: new FormModel({
      id: 'deleteFileDetailsPopUpForm',
      controls: {
        text: new TextControl({
          order: 1,
          columnCount: 12,
          label:
            'payments.feedback-files.file-details.delete.delete-confirm-message',
          class: 'color-arb-primaryText font-h2-bold align-items-center',
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
