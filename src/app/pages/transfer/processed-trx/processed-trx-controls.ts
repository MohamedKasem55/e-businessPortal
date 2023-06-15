import {ButtonControl} from "app/@core/model/dto/control/button-control";
import {DateControl} from "app/@core/model/dto/control/date-control";
import {DropdownControl} from "app/@core/model/dto/control/dropdown-control";
import {TextInputControl} from "app/@core/model/dto/control/text-input-control";
import {FormModel} from "app/@core/model/dto/formModel";
import {TableHeaderType} from "arb-design-library";
import {TableHeaderModel} from "arb-design-library/model/table-header.model";
import {TitleModel} from "arb-design-library/model/title.model";

export function getSearchForm() {
  return new FormModel({
    id: 'fromAccountForm',
    controls: {
      "paymentType": new DropdownControl({
        label: 'Payment Type',
        order: 1,
        columnCount: 6,
        controlOptions:
          {
            columnId: "key",
            textField: "value",
            hasSearch: true,
          },
        value: ''
      }),
      "debitAccount": new DropdownControl({
        label: 'Debit Account',
        order: 2,
        columnCount: 6,
        controlOptions:
          {
            columnId: "key",
            textField: "value",
            hasSearch: true,
          },
        value: ''
      }),
      "country": new DropdownControl({
        label: 'Country',
        order: 3,
        columnCount: 6,
        controlOptions:
          {
            columnId: "key",
            textField: "value",
            hasSearch: true,
          },
        value: ''
      }),
      "beneficiaryBank": new DropdownControl({
        label: 'Beneficiary Bank',
        order: 4,
        columnCount: 6,
        controlOptions: {
          columnId: "key",
          textField: "value",
          hasSearch: true,
        },
        value: ''
      }),
      "amountRangeFrom": new TextInputControl({
        label: 'Amount Range From',
        order: 5,
        columnCount: 6,
        value: ''
      }),
      "amountRangeTo": new TextInputControl({
        label: 'Amount Range To',
        order: 6,
        columnCount: 6, value: ''
      }),
      "currency": new DropdownControl({
        label: 'Currency', order: 7,
        columnCount: 6,
        controlOptions: {
          columnId: "key",
          textField: "value",
          hasSearch: true,
        }, value: ''
      }),
      "status": new DropdownControl({
        label: 'Status', order: 8,
        columnCount: 6,
        controlOptions: {
          columnId: "key",
          textField: "value",
          hasSearch: true,
        }, value: ''
      }),
      "lastApprovalDateFrom": new DateControl({
        label: 'Last Approval Date From',
        order: 9,
        value: '',
        columnCount: 6
      }),
      "lastApprovalDateTo": new DateControl({
        label: 'Last Approval Date To',
        order: 10,
        value: '',
        columnCount: 6
      }),
      "initiatedBy": new DropdownControl({
        label: 'Initiated By',
        order: 11,
        columnCount: 6,
        controlOptions:
          {
            columnId: "key",
            textField: "value",
            hasSearch: true,
          },
        value: ''
      }),
      "ApprovedBy": new DropdownControl({
        label: 'Approved By',
        order: 12,
        columnCount: 6,
        controlOptions:
          {
            columnId: "key",
            textField: "value",
            hasSearch: true,
          },
        value: ''
      }),
      "cancelButton": new ButtonControl({
        order: 13,
        columnCount: 4,
        controlOptions:
          {
            id: "cancel",
            type: 'secondary',
            text: "public.cancel"
          }
      }),
      "reset": new ButtonControl({
        order: 13,
        columnCount: 4,
        controlOptions:
          {
            id: "reset",
            type: 'secondary',
            text: "public.reset"
          }
      }),
      "searchButton": new ButtonControl({
        order: 14,
        columnCount: 4,
        controlOptions:
          {
            id: "search",
            type: 'primary',
            text: "public.search"
          }
      }),
    }
  })
}

export const getProcessedTrxTableHeader = (transferType: any, countryCode: any, errorTable: any): TableHeaderModel[] => {
  return [{
    title: 'transfer.processedTrnx.pmt-type',
    type: TableHeaderType.TEXT,
    fieldName: 'transferType',
    mapObject: transferType
  },
    {
      title: 'transfer.processedTrnx.beneficiary',
      type: TableHeaderType.BUTTON,
      fieldName: 'beneficiaryName',
      controlOptions: {text: "beneficiaryName", id: "saveNickName",}
    },
    {
      title: 'transfer.processedTrnx.beneficiaryAcc',
      type: TableHeaderType.TEXT,
      fieldName: 'beneficiaryAccount'
    },
    {
      title: 'transfer.processedTrnx.beneficiaryBnk',
      type: TableHeaderType.TEXT,
      fieldName: 'beneficiaryBank'
    },
    {
      title: 'transfer.processedTrnx.country',
      type: TableHeaderType.TEXT,
      fieldName: 'country',
      mapObject: countryCode
    },
    {
      title: 'transfer.processedTrnx.debit-Account',
      type: TableHeaderType.TEXT,
      fieldName: 'accountFrom.ibanNumber'
    },
    {
      title: 'transfer.processedTrnx.debit-Account-Nickname',
      type: TableHeaderType.TEXT,
      fieldName: 'accountFrom.alias'
    },
    {
      title: 'transfer.processedTrnx.debit-Amount',
      type: TableHeaderType.AMOUNT_TEXT,
      fieldName: 'sarAmount',
      controlOptions: {currency: 'sarCurrency'}
    }, {
      title: 'transfer.processedTrnx.transferAmount',
      fieldName: 'amount',
      type: TableHeaderType.AMOUNT_TEXT,
      controlOptions: {currency: 'currency'}
    }, {
      title: 'transfer.processedTrnx.Fees',
      type: TableHeaderType.AMOUNT_TEXT,
      controlOptions: {currency: 'feesCurrency'},
      fieldName: 'feesAmount'
    },
    {
      title: 'transfer.processedTrnx.exRate',
      type: TableHeaderType.TEXT,
      fieldName: 'exchangeRate'
    },
    {
      title: 'public.status', type: TableHeaderType.TEXT,
      fieldName: 'beStatus',
      mapObject: errorTable
    },
    {
      title: 'transfer.processedTrnx.initiationBy', type: TableHeaderType.TEXT,
      fieldName: 'initiatedBy'
    }, {
      title: 'transfer.processedTrnx.initiationDate',
      type: TableHeaderType.DATE_TEXT,
      fieldName: 'initiationDate',
      controlOptions: {format: 'dd/MM/yyyy HH:mm'}
    }, {
      title: 'transfer.processedTrnx.approvalBy', type: TableHeaderType.TEXT,
      fieldName: 'approvedBy'
    }, {
      title: 'transfer.processedTrnx.approvedDate',
      type: TableHeaderType.DATE_TEXT,
      fieldName: 'approvedDate',
      controlOptions: {format: 'dd/MM/yyyy HH:mm'}
    }]
}

export const getProcessedTrxTitleModel = (): TitleModel => {
  return {
    id: ' ProcessedTransactions1',
    type: 'Page',
    title: 'transfer.processedTrnx.name',
    endButtons: [
      {id: 'UserApprovalStatus', type: 'secondary', text: 'payments.userApproval.title'},
    ],
  }
};

export const getProcessedTrxSectionTitleModel = (): TitleModel => {
  return {
    id: ' ProcessedTransactions1',
    type: 'Section',
    title: 'transfer.processedTrnx.allTrnx',
  }
};
