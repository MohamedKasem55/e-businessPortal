import {ButtonModel} from "arb-design-library/model/button.model";
import {FormModel} from "../../../@core/model/dto/formModel";
import {TableControl} from "../../../@core/model/dto/control/table-control";
import {AccountControl} from "../../../@core/model/dto/control/account-control";
import {TableHeaderType} from "arb-design-library";
import {PopupInputModel} from "../../../@core/model/dto/popup.model";
import {TextControl} from "../../../@core/model/dto/control/text-control";
import {EmptyControl} from "../../../@core/model/dto/control/empty-control";
import {ButtonControl} from "../../../@core/model/dto/control/button-control";
import {TextInputControl} from "../../../@core/model/dto/control/text-input-control";
import {DateControl} from "../../../@core/model/dto/control/date-control";
import {DropdownControl} from "../../../@core/model/dto/control/dropdown-control";
import {getTransactionTypeObject} from "../documents/request-new-document/request-new-document.controls";
import { SummaryItemControl } from "app/@core/model/dto/control/sumery-item-control";

export const getPageTitle = (): ButtonModel[] => {
  return [{
    id: "payments",
    type: 'secondary',
    prefixIcon: "arb-icon-Bill",
    text: "accounts.payment"
  },
  {
    id: "nickname",
    type: 'secondary',
    prefixIcon: "arb-icon-edit",
    text: "accounts.account-nickname"
  },
    {
      id: "transfers",
      type: 'secondary',
      prefixIcon: "arb-icon-Two-Arrows",
      text: "accounts.transfer"
    }
  ]
}

export const getSelectAccountControl = () => {
  return new FormModel({
    id: 'selectAccount',
    controls: {
      selectAccount: new AccountControl({
        label: 'accounts.selectAccount',
        required: true,
        order: 2,
        columnCount: 12,
      })
    }
  })
}

export const getTableTitle = (): ButtonModel[] => {
  return [
    {
      id: "download",
      type: 'secondary',
      prefixIcon: "arb-icon-arrowDownBox",
      text: "accounts.download"
    }
  ]
}

export const getStatementTable = (): FormModel => {
  return new FormModel({
    id: 'accountStatement',
    controls: {
      accountStatement: new TableControl({
        columnCount: 12,
        order: 1,
        controlOptions: {
          headers: [
            {
              title: "accounts.dateTime",
              fieldName: "date",
              type: TableHeaderType.DATE_TEXT,
              controlOptions: {
                format: "dd-MMM-yy h:mm:ss a"
              }
            },
            {
              title: "accounts.amount",
              fieldName: "amount",
              type: TableHeaderType.AMOUNT_TEXT,
              controlOptions: {
                currency: "currency"   /*Account Currency*/
              }
            },

            {
              title: "accounts.balance",
              fieldName: "balance",
              type: TableHeaderType.TEXT
            },
            {
              title: "accounts.channel",
              fieldName: "channelType",
              type: TableHeaderType.TEXT
            },
            {
              title: "accounts.detail",
              fieldName: "description",
              type: TableHeaderType.BUTTON,
              controlOptions: {
                id: "description",
                text: "description"
              }
            },
            {
              title: "accounts.remark",
              fieldName: "remarks",
              type: TableHeaderType.TEXT
            }
          ],
          columnId: "txId",

          hasCheckbox: false,
          showSearch: true,
          showFilter: true,
          pageSizes: [5, 10, 20],
          paginationValue: {page: 1, size: 10},
          title:'accounts.online-statement'
        },
      })
    }

  })
}

export const getTrnxDtlsPopup = (): PopupInputModel => {
  let form: FormModel = new FormModel({
    id: 'trnxDtlsPopup',
    controls: {
      remarks: new SummaryItemControl({
        order: 1,
        columnCount: 12,
        label: '',
      }),
    }
  })
  return {
    form: form
  }
}

export const getTrnxFilterPopup = (): PopupInputModel => {
  let form: FormModel = new FormModel({
    id: 'trnxFilterPopup',
    controls: {
      amountFrom: new TextInputControl({
        order: 1,
        columnCount: 12,
        label: "accounts.statement.amountFrom",
        class: "text-start color-arb-primaryText",
        value: "",
      }),
      amountTo: new TextInputControl({
        label: "accounts.statement.amountTo",
        order: 1,
        columnCount: 12,
        class: "text-start color-arb-primaryText ",
        value: ""
      }),
      fromDate: new DateControl({
        order: 1,
        columnCount: 12,
        label: "accounts.statement.fromDate",
        class: "text-start color-arb-primaryText ",
      }),
      toDate: new DateControl({
        order: 1,
        columnCount: 12,
        class: "text-start color-arb-primaryText ",
        label: "accounts.statement.toDate",
      }),
      searchBy: new DropdownControl({
        order: 1,
        columnCount: 12,
        class: "text-start color-arb-primaryText ",
        label: "accounts.statement.searchBy",
        controlOptions: {
          columnId: "key",
          textField: "value"
        }
      }),
      transType: new DropdownControl({
        order: 1,
        columnCount: 12,
        label: "accounts.statement.transType",
        class: "text-start color-arb-primaryText ",
        controlOptions: {
          columnId: "key",
          textField: "value",
          options: getTransactionTypeObject(),
          hasSearch: true,
        }
      }),

      empty: new EmptyControl({}),

      close: new ButtonControl({
        order: 2,
        columnCount: 4,
        controlOptions: {
          id: "close",
          type: 'secondary',
          text: "public.close",
        }
      }),
      reset: new ButtonControl({
        order: 2,
        columnCount: 4,
        controlOptions: {
          id: "reset",
          type: 'secondary',
          text: "public.reset",
        }
      }),
      search: new ButtonControl({
        order: 2,
        columnCount: 4,
        controlOptions: {
          id: "search",
          type: 'secondary',
          text: "public.search",
        }
      }),
    }
  })
  return {
    form: form
  }
}
