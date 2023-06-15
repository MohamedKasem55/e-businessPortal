import {FormModel} from "../../../@core/model/dto/formModel";
import {AccountControl} from "../../../@core/model/dto/control/account-control";
import {TableControl} from "../../../@core/model/dto/control/table-control";
import {TableHeaderType} from "arb-design-library";
import {ButtonModel} from "arb-design-library/model/button.model";
import {TitleControl} from "../../../@core/model/dto/control/title-control";
import {EmptyControl} from "../../../@core/model/dto/control/empty-control";
import {PopupInputModel} from "../../../@core/model/dto/popup.model";
import {DateControl} from "../../../@core/model/dto/control/date-control";
import {DropdownControl} from "../../../@core/model/dto/control/dropdown-control";
import {ButtonControl} from "../../../@core/model/dto/control/button-control";
import {KeyValueModel} from "../../../@core/model/rest/common/key-value.model";
import {NumberInputControl} from "../../../@core/model/dto/control/number-input-control";

export const chequeLanding = (): FormModel => {
  return new FormModel({
    id: 'chequeLanding',
    controls: {
      title: new TitleControl({
        columnCount: 6,
        order: 1,
        controlOptions: {
          id: "selectAccount",
          type: "Section",
          title: "accounts.cheques.chooseAcc"
        }
      }),
      empty: new EmptyControl({
        columnCount: 6,
        order: 2,
        label: "public.account"
      }),
      account: new AccountControl({
        columnCount: 6,
        order: 3,
        label: "public.account",
        required: true,
        class: "mt-2",
        validationLabels: {
          required: "public.validations.required",
        }
      }),
      chequeTable: new TableControl({
        columnCount: 12,
        order: 4,
        controlOptions: {
          data: [],
          headers: [
            {
              title: "accounts.cheques.chequeNo",
              fieldName: "checkNumber",
              type: TableHeaderType.TEXT
            },
            {
              title: "accounts.cheques.account",
              fieldName: "accountNumber",
              type: TableHeaderType.TEXT
            },
            {
              title: "accounts.cheques.benName",
              fieldName: "beneficiaryName",
              type: TableHeaderType.TEXT
            },
            {
              title: "accounts.cheques.chequeAmt",
              fieldName: "checkAmount",
              type: TableHeaderType.TEXT
            },
            {
              title: "accounts.cheques.status",
              fieldName: "status", type:
              TableHeaderType.TEXT
            },
            {
              title: "accounts.cheques.chequeDate",
              fieldName: "checkWithdrawingDate",
              type: TableHeaderType.TEXT
            },


          ],
          columnId: "beneficiaryId",
          hasCheckbox: false,
          showSearch: true,
          showFilter: true,
          isExternalSort: true,
          pageSizes: [10, 15],
          title:"accounts.cheques.title"
        },
      }),
      empty1: new EmptyControl({columnCount: 10})
    },
  })
}

export const EndTitleButton = (showPendingActions: boolean): ButtonModel[] => {

  let groups: any = JSON.parse(sessionStorage.getItem("groups")!);

  let buttons: ButtonModel[] = []
  if (!showPendingActions) {
    if (groups!.items.StopCheckBookGroup) {
      buttons.push({
        id: "delete",
        type: "danger",
        text: "accounts.cheques.stop-type.stop",
        prefixIcon: "arb-icon-Trash",
      })
    }
    if (groups!.items.RequestCheckBookGroup) {
      buttons.push({
        id: "create",
        type: "primary",
        text: "accounts.cheques.landingReqNew"
      })
    }
  } else {
    buttons = [{
      id: "requestStatus",
      type: "secondary",
      text: "public.approvalStatus",
    }]
    if (groups!.items.StopCheckBookGroup) {
      buttons.push({
        id: "delete",
        type: "danger",
        text: "accounts.cheques.stop-type.stop",
        prefixIcon: "arb-icon-Trash",
      })
    }
    if (groups!.items.RequestCheckBookGroup) {
      buttons.push({
        id: "create",
        type: "primary",
        text: "accounts.cheques.landingReqNew"
      })
    }
  }
  return buttons;
}

export const getFilterPopup = (): PopupInputModel => {
  let form: FormModel = new FormModel({
    id: 'filterPopup',
    controls: {
      searchBy: new DropdownControl({
        order: 1,
        columnCount: 12,
        label: "accounts.cheques.searchBy",
        class: "text-start color-arb-primaryText ",
        controlOptions: {
          columnId: "key",
          textField: "value",
          options: getFilterTypeObject()
        }
      }),
      fromDate: new DateControl({
        order: 2,
        columnCount: 6,
        label: "accounts.cheques.fromDate",
        class: "mt-2 color-arb-primaryText",
      }),
      toDate: new DateControl({
        order: 3,
        columnCount: 6,
        class: "mt-2 color-arb-primaryText",
        label: "accounts.cheques.toDate",
      }),
      chequeNo: new NumberInputControl({
        order: 4,
        columnCount: 12,
        class: "text-start color-arb-primaryText ",
        label: "accounts.cheques.chequeNo",
        value: ""
      }),

      empty: new EmptyControl({}),

      close: new ButtonControl({
        order: 5,
        columnCount: 4,
        class: "mt-2",
        controlOptions: {
          id: "close",
          type: 'secondary',
          text: "public.close",
        }
      }),
      reset: new ButtonControl({
        order: 6,
        columnCount: 4,
        class: "mt-2",
        controlOptions: {
          id: "reset",
          type: 'secondary',
          text: "public.reset",
        }
      }),
      search: new ButtonControl({
        order: 7,
        columnCount: 4,
        class: "mt-2",
        controlOptions: {
          id: "search",
          type: 'primary',
          text: "public.search"
        }
      }),
    }
  })
  return {
    form: form
  }
}

export const getFilterTypeObject = (): KeyValueModel[] => {
  return [
    {
      key: "0",
      value: "accounts.cheques.date",
    },
    {
      key: "1",
      value: "accounts.cheques.chequeNo",
    }
  ]
}
