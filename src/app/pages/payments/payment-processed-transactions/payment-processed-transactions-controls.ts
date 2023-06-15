import { AccountControl } from 'app/@core/model/dto/control/account-control';
import { ButtonControl } from 'app/@core/model/dto/control/button-control';
import { DateControl } from 'app/@core/model/dto/control/date-control';
import { DropdownControl } from 'app/@core/model/dto/control/dropdown-control';
import { NumberInputControl } from 'app/@core/model/dto/control/number-input-control';
import { SummaryItemControl } from 'app/@core/model/dto/control/sumery-item-control';
import { TextInputControl } from 'app/@core/model/dto/control/text-input-control';
import { PopupInputModel } from 'app/@core/model/dto/popup.model';
import { FormModel } from "../../../@core/model/dto/formModel";

export const getDetailForm = (): PopupInputModel =>{
  let form: FormModel = new FormModel({
    id: 'fromAccountForm',
    controls: {
      "date": new SummaryItemControl({
        columnCount: 6,
        order: 2,
        label: "payments.userApproval.date",
        value: ""
      }),
      "amount": new SummaryItemControl({
        columnCount: 6,
        order: 3,
        label: "payments.userApproval.amount",
        value: ""
      }),
      "sponsorId": new SummaryItemControl({
        columnCount: 6,
        order: 4,
        label: "payments.userApproval.govStatus.sponsorId",
        value: ""
      }),
      "account": new SummaryItemControl({
        columnCount: 6,
        order: 5,
        label: "payments.userApproval.account",
        value: "3049299adm-4"
      })
    }
  })
  return {
    form: form
  }
}

export function getBillSearchForm() {
  return new FormModel({
    id: 'fromAccountForm',
    controls: {
      "billers": new DropdownControl({
        label: 'payments.bill-processed.billers',
        required: false,
        order: 1,
        columnCount: 6,
        controlOptions: {
          columnId: "billCode",
          textField: 'addDescriptionEn',
          hasSearch: true,
        }
      }),
      "billRef": new TextInputControl({
        label: 'payments.bill-processed.bill-reference',
        required: false,
        order: 2,
        columnCount: 6,
        value: ''
      }),
      "account": new AccountControl({
        label: 'payments.bill-processed.account',
        required: false,
        order: 3,
        value: null,
        controlOptions: {
          columnId: "key",
          textField: 'value',
          options: []
        },
        columnCount: 6,
      }),
      "billNickname": new TextInputControl({
        label: 'payments.bill-processed.bill-nickname',
        required: false,
        order: 4,
        columnCount: 6,
        value: ''
      }),
      "paidFrom": new NumberInputControl({
        label: 'payments.bill-processed.paid-amount-from',
        required: false,
        order: 5,
        columnCount: 4,
        value: ''
      }),
      "paidTo": new NumberInputControl({
        label: 'payments.bill-processed.paid-amount-to',
        required: false,
        order: 6,
        columnCount: 4,
        value: ''
      }),
      "status": new DropdownControl({
        label: 'payments.bill-processed.status',
        required: false,
        order: 7,
        columnCount: 4,
        controlOptions: {
          columnId: "key",
          textField: 'value',
          hasSearch: true,
        }
      }),
      "initiatedFrom": new DateControl({
        label: 'payments.bill-processed.initiated-date-from',
        required: false,
        order: 8,
        columnCount: 6,
        value: ''
      }),
      "initiatedTo": new DateControl({
        label: 'payments.bill-processed.initiated-date-to',
        required: false,
        order: 9,
        columnCount: 6,
        value: ''
      }),
      "executedFrom": new DateControl({
        label: 'payments.bill-processed.executed-date-from',
        required: false,
        order: 10,
        columnCount: 6,
        value: ''
      }),
      "executedTo": new DateControl({
        label: 'payments.bill-processed.executed-date-to',
        required: false,
        order: 11,
        columnCount: 6,
        value: ''
      }),
      "initiatedBy": new DropdownControl({
        label: 'payments.bill-processed.initiated-by',
        required: false,
        order: 12,
        columnCount: 6,
        controlOptions: {
          columnId: "key",
          textField: 'value',
          hasSearch: true,
        }
      }),
      "approvedBy": new DropdownControl({
        label: 'payments.bill-processed.approved-by',
        required: false,
        order: 13,
        columnCount: 6,
        controlOptions: {
          columnId: "key",
          textField: 'value',
          hasSearch: true,
        }
      }),
      "cancelButton": new ButtonControl({
        order: 14,
        columnCount: 4,
        controlOptions: {
          id: "cancel",
          type: 'secondary',
          text: "public.cancel"
        }
      }),
      "resetButton": new ButtonControl({
        order: 15,
        columnCount: 4,
        controlOptions: {
          id: "reset",
          type: 'secondary',
          text: "payments.bill-processed.reset"
        }
      }),
      "searchButton": new ButtonControl({
        order: 16,
        columnCount: 4,
        controlOptions: {
          id: "search",
          type: 'primary',
          text: "public.search"
        }
      }),
    }
  })
}

export function getGovSearchForm() {
  return new FormModel({
    id: 'fromAccountForm',
    controls: {
      "serviceType": new DropdownControl({
        label: 'payments.government-processed.serviceType',
        order: 1,
        required: false,
        controlOptions: {
          columnId: "key",
          textField: 'value',
          options: [],
          hasSearch: true,
        },
        columnCount: 6,
        hidden: false
      }),
      "applicationType": new DropdownControl({
        label: 'payments.government-processed.subserviceType',
        order: 2,
        required: false,
        controlOptions: {columnId: "key", textField: 'value',
          hasSearch: true,},
        columnCount: 6,
        hidden: false,
      }),
      "account": new AccountControl({
        label: 'payments.government-processed.accountNumber',
        required: false,
        order: 3,
        value: null,
        controlOptions: {
          columnId:"",
          textField: 'value',
          options: []
        },
        columnCount: 6,
      }),
      "idNumber": new TextInputControl({
        label: 'payments.government-processed.idNumber',
        required: false,
        order: 2,
        columnCount: 6,
        value: ''
      }),
      "paidFrom": new NumberInputControl({
        label: 'payments.government-processed.paid-amount-from',
        required: false,
        order: 5,
        columnCount: 4,
        value: ''
      }),
      "paidTo": new NumberInputControl({
        label: 'payments.government-processed.paid-amount-to',
        required: false,
        order: 6,
        columnCount: 4,
        value: ''
      }),
      "status": new DropdownControl({
        label: 'payments.government-processed.status',
        required: false,
        order: 7,
        columnCount: 4,
        controlOptions: {
          columnId:"",
          textField: 'value',
        hasSearch: true,
        }
      }),
      "initiatedFrom": new DateControl({
        label: 'payments.government-processed.initiated-date-from',
        required: false,
        order: 8,
        columnCount: 6,
        value: ''
      }),
      "initiatedTo": new DateControl({
        label: 'payments.government-processed.initiated-date-to',
        required: false,
        order: 9,
        columnCount: 6,
        value: ''
      }),
      "executedFrom": new DateControl({
        label: 'payments.government-processed.executed-date-from',
        required: false,
        order: 10,
        columnCount: 6,
        value: ''
      }),
      "executedTo": new DateControl({
        label: 'payments.government-processed.executed-date-to',
        required: false,
        order: 11,
        columnCount: 6,
        value: ''
      }),
      "initiatedBy": new DropdownControl({
        label: 'payments.government-processed.initiated-by',
        required: false,
        order: 12,
        columnCount: 6,
        controlOptions: {
          columnId:"",
          textField: 'value',
          hasSearch: true,
        }
      }),
      "approvedBy": new DropdownControl({
        label: 'payments.government-processed.approved-by',
        required: false,
        order: 13,
        columnCount: 6,
        controlOptions: {
          columnId:"",
          textField: 'value',
          hasSearch: true,
        }
      }),
      "cancelButton": new ButtonControl({
        order: 14,
        columnCount: 4,
        controlOptions: {
          id: "cancel",
          type: 'secondary',
          text: "public.cancel"
        }
      }),
      "resetButton": new ButtonControl({
        order: 15,
        columnCount: 4,
        controlOptions: {
          id: "reset",
          type: 'secondary',
          text: "payments.government-processed.reset"
        }
      }),
      "searchButton": new ButtonControl({
        order: 16,
        columnCount: 4,
        controlOptions: {
          id: "search",
          type: 'primary',
          text: "public.search"
        }
      }),
    }
  })
}

export function getEsalSearchForm() {
  return new FormModel({
    id: 'fromAccountForm',
    controls: {
      "invoiceNumber": new TextInputControl({
        label: 'payments.esal-processed.invoiceNumber',
        required: false,
        order: 1,
        columnCount: 6,
        value: ''
      }),
      "supplierId": new TextInputControl({
        label: 'payments.esal-processed.supplierID',
        required: false,
        order: 1,
        columnCount: 6,
        value: ''
      }),
      "supplierName": new TextInputControl({
        label: 'payments.esal-processed.supplierName',
        required: false,
        order: 1,
        columnCount: 6,
        value: ''
      }),
      "buyerName": new TextInputControl({
        label: 'payments.esal-processed.buyerName',
        required: false,
        order: 1,
        columnCount: 6,
        value: ''
      }),
      "account": new AccountControl({
        label: 'payments.esal-processed.accountNumber',
        required: false,
        order: 3,
        value: null,
        controlOptions: {
          columnId: 'value',
          textField: 'value',
          options: []
        },
        columnCount: 6,
      }),
      "status": new DropdownControl({
        label: 'payments.esal-processed.status',
        required: false,
        order: 5,
        columnCount: 6,
        controlOptions: {
          columnId: 'value',
          textField: 'value',
          hasSearch: true,
        }
      }),
      "paidFrom": new NumberInputControl({
        label: 'payments.esal-processed.paid-amount-from',
        required: false,
        order: 6,
        columnCount: 6,
        value: ''
      }),
      "paidTo": new NumberInputControl({
        label: 'payments.esal-processed.paid-amount-to',
        required: false,
        order: 7,
        columnCount: 6,
        value: ''
      }),
      "initiatedFrom": new DateControl({
        label: 'payments.esal-processed.initiated-date-from',
        required: false,
        order: 8,
        columnCount: 6,
        value: ''
      }),
      "initiatedTo": new DateControl({
        label: 'payments.esal-processed.initiated-date-to',
        required: false,
        order: 9,
        columnCount: 6,
        value: ''
      }),
      "executedFrom": new DateControl({
        label: 'payments.esal-processed.executed-date-from',
        required: false,
        order: 10,
        columnCount: 6,
        value: ''
      }),
      "executedTo": new DateControl({
        label: 'payments.esal-processed.executed-date-to',
        required: false,
        order: 11,
        columnCount: 6,
        value: ''
      }),
      "initiatedBy": new DropdownControl({
        label: 'payments.esal-processed.initiated-by',
        required: false,
        order: 12,
        columnCount: 6,
        controlOptions: {
          columnId: 'value',
          textField: 'value',
          hasSearch: true,
        }
      }),
      "approvedBy": new DropdownControl({
        label: 'payments.esal-processed.approved-by',
        required: false,
        order: 13,
        columnCount: 6,
        controlOptions: {
          columnId: 'value',
          textField: 'value',
          hasSearch: true,
        }
      }),
      "cancelButton": new ButtonControl({
        order: 14,
        columnCount: 4,
        controlOptions: {
          id: "cancel",
          type: 'secondary',
          text: "public.cancel"
        }
      }),
      "resetButton": new ButtonControl({
        order: 15,
        columnCount: 4,
        controlOptions: {
          id: "reset",
          type: 'secondary',
          text: "payments.esal-processed.reset"
        }
      }),
      "searchButton": new ButtonControl({
        order: 16,
        columnCount: 4,
        controlOptions: {
          id: "search",
          type: 'primary',
          text: "public.search"
        }
      }),
    }
  })
}


