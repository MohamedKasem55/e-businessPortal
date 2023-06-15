import {DateControl} from 'app/@core/model/dto/control/date-control';
import {FormModel} from "../../../@core/model/dto/formModel";
import {TitleControl} from "../../../@core/model/dto/control/title-control";
import {EmptyControl} from "../../../@core/model/dto/control/empty-control";
import {TableControl} from "../../../@core/model/dto/control/table-control";
import {TranslateService} from "@ngx-translate/core";
import {TableHeaderType} from "arb-design-library";
import {ButtonControl} from "app/@core/model/dto/control/button-control";
import {TextInputControl} from "app/@core/model/dto/control/text-input-control";
import {DropdownControl} from "app/@core/model/dto/control/dropdown-control";
import {AmountControl} from "app/@core/model/dto/control/amount-control";
import {TextControl} from 'app/@core/model/dto/control/text-control';

export function buildBillPaymentForm(translate: TranslateService) {
  return new FormModel({
    id: 'billPayment',
    controls: {
      "detailsTitle": new TitleControl({
        columnCount: 12,
        order: 1,
        controlOptions: {
          id: "detailsSectionId",
          title: 'public.details',
          type: 'Section',
          endButtons: [
            {
              id: "add-bill",
              text: "payments.bill-payment.add-bill",
              type: "secondary",
              prefixIcon: " arb-icon-add"
            }
          ]
        },

      }),
      "empty": new EmptyControl({
        columnCount: 12,
        order: 2,
      }),
      "billTable": new TableControl({
        columnCount: 12,
        order: 4,
        value: [],
        required: true,
        controlOptions: {
          headers: [
            {
              title: "payments.bill-payment.table-header.biller-name",
              fieldName: "addDescriptionEn",
              type: TableHeaderType.LINE_CARD,
              controlOptions: {
                image: 'logo'
              }
            },
            {
              title: "payments.bill-payment.table-header.bill-reference",
              fieldName: "billRef",
              type: TableHeaderType.TEXT
            },
            {
              title: 'payments.bill-payment.table-header.nick-name',
              fieldName: "nickname",
              type: TableHeaderType.TEXT_INPUT
            },
            {
              title: 'payments.bill-payment.table-header.original-amount',
              fieldName: "amount",
              type: TableHeaderType.AMOUNT_TEXT,
              controlOptions: {currency: ''}
            },
            {
              title: 'payments.bill-payment.table-header.updated-amount',
              fieldName: "amount",
              type: TableHeaderType.AMOUNT_INPUT,
              controlOptions: {currency: ''}
            },
            {title: 'payments.bill-payment.table-header.due-date', fieldName: "dueDate", type: TableHeaderType.TEXT},
            {title: "Status", fieldName: "status", type: TableHeaderType.TEXT},
          ],
          columnId: "billRef",
          hasCheckbox: true,
          showSearch: true,
          showFilter: true,
          title: 'public.details'
        },
      })
    }

  })
}


export const filterControls = [
  'billerName',
  'amountFrom',
  'amountTo',
  'referenceNumber',
  'nickname',
  'dateFrom',
  'dateTo',
];

export function getFilterBillsForm(translate: TranslateService) {
  return new FormModel({
    id: 'filterBillsForm',
    controls: {
      "filterBillsTitle": new TitleControl({
        columnCount: 12,
        order: 1,
        controlOptions: {
          id: 'filterBillsTitle',
          title: 'payments.bill-payment.filter.filter-bills',
        },
      }),
      "empty": new EmptyControl({
        columnCount: 12,
        order: 2,
      }),
      "billerName": new DropdownControl({
        label: 'payments.bill-payment.table-header.biller-name',
        required: false,
        order: 3,
        columnCount: 12,
        controlOptions: {
          columnId: 'billCode',
          textField: translate.currentLang == 'en' ? 'addDescriptionEn' : 'addDescriptionAr',
          hasSearch: true,
        },
        value: ''
      }),
      "empty2": new EmptyControl({
        columnCount: 12,
        order: 4,
      }),
      "amountFrom": new AmountControl({
        label: 'payments.bill-payment.filter.amount-from',
        required: false,
        order: 5,
        columnCount: 6,
        value: ''
      }),
      "amountTo": new AmountControl({
        label: 'payments.bill-payment.filter.amount-to',
        required: false,
        order: 6,
        columnCount: 6,
        value: ''
      }),
      "empty3": new EmptyControl({
        columnCount: 12,
        order: 7,
      }),
      "referenceNumber": new TextInputControl({
        label: 'payments.bill-payment.table-header.bill-reference',
        required: false,
        order: 8,
        columnCount: 6,
        value: ''
      }),
      "empty4": new EmptyControl({
        columnCount: 12,
        order: 9,
      }),
      "nickname": new TextInputControl({
        label: 'payments.bill-payment.filter.nickname',
        required: false,
        order: 10,
        columnCount: 6,
        value: ''
      }),
      "empty5": new EmptyControl({
        columnCount: 12,
        order: 11,
      }),
      "dateFrom": new DateControl({
        label: 'payments.bill-payment.filter.date-from',
        required: false,
        order: 12,
        columnCount: 6,
        value: ''
      }),
      "dateTo": new DateControl({
        label: 'payments.bill-payment.filter.date-to',
        required: false,
        order: 13,
        columnCount: 6,
        value: ''
      }),
      "empty6": new EmptyControl({
        columnCount: 12,
        order: 14,
      }),
      "cancelButton": new ButtonControl({
        order: 15,
        columnCount: 4,
        controlOptions: {
          id: 'cancel',
          type: 'secondary',
          text: "public.cancel"
        }
      }),
      "resetButton": new ButtonControl({
        order: 16,
        columnCount: 4,
        controlOptions: {
          id: "reset",
          type: 'secondary',
          text: "public.reset"
        }
      }),
      "filterButton": new ButtonControl({
        order: 17,
        columnCount: 4,
        controlOptions: {
          id: 'filterBills',
          type: 'primary',
          text: "payments.bill-payment.filter.filter-btn"
        }
      }),
    }
  })
}

export function getDeleteBillsForm() {
  return new FormModel({
    id: 'billDeleteForm',
    controls: {
      "title": new TextControl({
        order: 1,
        columnCount: 12,
        label: 'payments.delete-bill.confirm',
        class: "color-arb-primaryText justify-content-center font-h2-bold"
      }),
      "cancelButton": new ButtonControl({
        order: 2,
        columnCount: 6,
        controlOptions: {
          id: "cancel",
          type: 'secondary',
          text: 'public.cancel'
        }
      }),
      "deleteButton": new ButtonControl({
        order: 3,
        columnCount: 6,
        controlOptions: {
          id: "delete",
          type: 'primary',
          text: 'public.confirm'
        }
      }),
    }
  })
}
