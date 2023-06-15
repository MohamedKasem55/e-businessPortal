import {AbstractControl, ValidationErrors} from "@angular/forms";
import {AccountControl} from "app/@core/model/dto/control/account-control";
import {AmountControl} from "app/@core/model/dto/control/amount-control";
import {ButtonControl} from "app/@core/model/dto/control/button-control";
import {DateControl} from "app/@core/model/dto/control/date-control";
import {NumberInputControl} from "app/@core/model/dto/control/number-input-control";
import {TableControl} from "app/@core/model/dto/control/table-control";
import {TextInputControl} from "app/@core/model/dto/control/text-input-control";
import {TitleControl} from "app/@core/model/dto/control/title-control";
import {FormModel} from "app/@core/model/dto/formModel";
import {TableHeaderType} from "arb-design-library";

export function multiInvoicesForm(): FormModel {
  return new FormModel({
    id: 'multiInvoiceDetails',
    controls: {
      "accountDetailsTitle": new TitleControl({
        order: 1,
        controlOptions: {
          id: 'accountDetails',
          title: 'transfer.account-details',
          subTitle: '',
        },
        columnCount: 12,
      }),
      "fromAccount": new AccountControl({
        label: 'public.from',
        required: true,
        hidden: true,
        order: 2,
        value: null,
        columnCount: 6,
        validationLabels: {required: 'transfer.account-is-required'}
      }),
      "payerIdNumber": new NumberInputControl({
        label: 'payments.esal.payer-id-number',
        required: true,
        disable: true,
        order: 2,
        value: '',
        columnCount: 6,
      }),
      "selectedCountTitle": new TitleControl({
        columnCount: 12,
        order: 3,
        controlOptions: {
          id: "selectInvoiceCount",
          title: 'payments.esal.select-invoices',
          type: 'Section',
          chips: []
        },
      }),
      "invoiceTable": new TableControl({
        columnCount: 12,
        order: 5,
        required: true,
        value: [],
        controlOptions: {
          title: 'payments.esal.select-invoices',
          headers: [
            {title: "payments.esal.invoice-number", fieldName: "invoiceId", type: TableHeaderType.TEXT},
            {title: "payments.esal.nick-name", fieldName: "billerName", type: TableHeaderType.TEXT},
            {
              title: "payments.esal.due-date",
              fieldName: "dateDue",
              type: TableHeaderType.DATE_TEXT,
              controlOptions: {format: 'dd/MM/yyyy'}
            },
            {
              title: "public.total-amount",
              fieldName: "amountDue",
              type: TableHeaderType.AMOUNT_TEXT,
              controlOptions: {currency: "currency"}
            },
            {
              title: "payments.esal.amount-to-pay",
              fieldName: "amountDue",
              type: TableHeaderType.AMOUNT_INPUT,
              controlOptions: {currency: 'currency', min: 'amountRangeFrom', max: 'amountRangeTo'}
            },
          ],
          columnId: "invoiceId",
          hasCheckbox: true,
          showSearch: true,
          showFilter: true,
          pageSizes: [10, 25, 50],
          paginationValue: {page: 1, size: 10},
          exportFileName: "Esal Invoices"
        },
      }),
    },
  })
}

export function getSearchForm() {
  return new FormModel({
    id: 'fromAccountForm',
    controls: {
      "suplierName": new TextInputControl({
        label: 'payments.esal.supplier-name',
        order: 1,
        columnCount: 12,
        value: ''
      }),
      "fromDate": new DateControl({
        label: 'accounts.statement.fromDate',
        order: 2,
        columnCount: 6,
      }),
      "toDate": new DateControl({
        label: 'payments.esal.date-to',
        order: 2,
        columnCount: 6,
        controlOptions: {
          maxDate: {year: new Date().getFullYear(), month: new Date().getMonth(), day: new Date().getDay()}
        }
      }),
      "fromAmount": new AmountControl({
        label: 'payments.esal.amount-from',
        order: 3,
        columnCount: 6,
        value: ''
      }),
      "toAmount": new AmountControl({
        label: 'payments.esal.amount-to',
        order: 3,
        columnCount: 6,
        value: ''
      }),
      "closeButton": new ButtonControl({
        order: 9,
        columnCount: 4,
        controlOptions: {id: "close", type: 'secondary', text: "public.close"}
      }),
      "cancelButton": new ButtonControl({
        order: 9,
        columnCount: 4,
        controlOptions: {id: "reset", type: 'secondary', text: "public.reset"}
      }),
      "searchButton": new ButtonControl({
        order: 9,
        columnCount: 4,
        controlOptions: {id: "search", type: 'primary', text: "public.search"}
      }),
    },
    formValidator: [{
      validatorFunc: (controls: AbstractControl): ValidationErrors | null => {
        const fromAmount = controls.get('fromAmount')?.value;
        const toAmount = controls.get('toAmount')?.value;
        if (fromAmount && toAmount && Number(fromAmount) > Number(toAmount)) {
          return {invalidAmount: "invalidAmount"}
        } else {
          return null;
        }
      },

      errorName: 'invalidAmount',
      errorMessage: 'payments.esal.ammount-validation-message'
    },
      {
        validatorFunc: (controls: AbstractControl): ValidationErrors | null => {
          const fromDate = controls.get('fromDate')?.value;
          const toDate = controls.get('toDate')?.value;
          if (fromDate && toDate) {
            const fromDateObj = new Date(fromDate.year, fromDate.month, fromDate.day)
            const toDateObj = new Date(toDate.year, toDate.month, toDate.day)
            if (fromDateObj > toDateObj) {
              return {invalidDate: "invalidDate"}
            } else {
              return null;
            }
          } else {
            return null;
          }
        },
        errorName: 'invalidDate',
        errorMessage: 'payments.esal.date-validation-message'
      }
    ]
  })
}
