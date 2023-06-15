import {ButtonModel} from "arb-design-library/model/button.model";
import {TranslateService} from "@ngx-translate/core";
import {FormModel} from "../../../@core/model/dto/formModel";
import {TableControl} from "../../../@core/model/dto/control/table-control";
import {BoxModel} from "arb-design-library/model/box.model";
import {TableHeaderType} from "arb-design-library";
import {PopupInputModel} from "../../../@core/model/dto/popup.model";
import {ButtonControl} from "../../../@core/model/dto/control/button-control";
import {TextInputControl} from "../../../@core/model/dto/control/text-input-control";
import {DropdownControl} from "../../../@core/model/dto/control/dropdown-control";
import {KeyValueModel} from "../../../@core/model/rest/common/key-value.model";
import { TitleControl } from "app/@core/model/dto/control/title-control";
import { NumberInputControl } from "app/@core/model/dto/control/number-input-control";
import { ValidationsEnum } from "app/@core/model/dto/validations-enum";
import {AuthenticationUtils} from "../../../@core/utility/authentication-utils";

export const getPageTitleButton = (): ButtonModel[] => {
  const buttons: ButtonModel[] = [];
  buttons.push({
    id: "open-new-acc",
    type: 'primary',
    text: "accounts.open-new-acc",
    isDisable: !AuthenticationUtils.isCompanyAdmin
  });
  return buttons;
}

export const getTableTitle = (): ButtonModel[] => {
  return [  ]
}

export const getAccountsTable = (): FormModel => {
  return new FormModel({
    id: 'selectAccount',
    controls: {
      accounts: new TableControl({
        columnCount: 12,
        order: 1,
        controlOptions: {
          headers: [
            {
              title: "accounts.accountNum",
              fieldName: "fullAccountNumber",
              type: TableHeaderType.BUTTON,
              controlOptions: {
                id: "fullAccountNumber",
                text: "fullAccountNumber"
              }
            },
            {
              title: "accounts.acc-name",
              fieldName: "alias",
              type: TableHeaderType.TEXT
            },

            {
              title: "accounts.balance",
              fieldName: "availableBalance",
              type: TableHeaderType.AMOUNT_TEXT,
              controlOptions: {
                currency: "currency"
              }
            },
            {
              title: "accounts.unclearedBalance",
              fieldName: "unclearedBalance",
              type: TableHeaderType.AMOUNT_TEXT,
              controlOptions: {
                currency: "currency"
              }
            },
            {
              title: "accounts.currency",
              fieldName: "currency",
              type: TableHeaderType.TEXT,
            }
          ],
          columnId: "accountPk",
          hasCheckbox: false,
          showSearch: true,
          showFilter: true,
          exportFileName:"Accounts",
          pageSizes: [5, 10, 20],
          paginationValue: {page: 1, size: 10},
          title:"accounts.allAcc"
        },
      })
    }

  })
}
export const getBoxes = (): BoxModel[] => {

  return [
    {
      id: "documents",
      text: "accounts.docs",
      icon: "arb-icon-document",
      isDisabled: !AuthenticationUtils.hasAccess('documents')
    }
    ,
    {
      id: "vat",
      text: "accounts.vat",
      icon: "arb-icon-cardCashArrow",
      isDisabled: !AuthenticationUtils.hasAccess('TaxInvoice')
    },
    {
      id: "cheques",
      text: "accounts.cheques.title",
      icon: "arb-icon-cheque",
      isDisabled: !AuthenticationUtils.hasAccess('ChequeManagement')
    },

  ]
}

export const getAccountListFilterPopupModel = (translateService: TranslateService, currencies: KeyValueModel[], branches: KeyValueModel[]): PopupInputModel => {
  let form: FormModel = new FormModel({
    id: 'trnxDtlsPopup',
    controls: {
      nickname: new TextInputControl({
        order: 1,
        columnCount: 12,
        label: "accounts.nickname",
        value: ""
      }),
      currency: new DropdownControl({
        order: 1,
        columnCount: 12,
        label: "accounts.currency",
        controlOptions: {
          columnId: "key",
          textField: "value",
          options: currencies,
          hasSearch: true
        }
      }),
      branch: new DropdownControl({
        order: 1,
        columnCount: 12,
        label: "accounts.branch",
        controlOptions: {
          columnId: "key",
          textField: "value",
          options: branches,
          hasSearch: true
        }
      }),
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
          type: 'primary',
          text: "public.search",
        }
      }),
    }
  })
  return {
    form: form
  }
}

export function vatPopupForm() {
  return new FormModel({
    id: 'vatPopupForm',
    controls: {
      "vatTitle": new TitleControl({
        columnCount: 12,
        order: 1,
        controlOptions: {
          id: "vatTitle",
          title: 'accounts.vat-reg',
          subTitle:'accounts.vat-message'
        }
      }),
      "vatNumber": new NumberInputControl({
        label: 'accounts.vat-number',
        required: true,
        order: 2,
        value: '',
        columnCount: 12,
        validationLabels: {
            minLength:  'accounts.vat-min-length',
            maxLength:  'accounts.vat-max-length'
        },
        validators: [
            { validation: ValidationsEnum.MIN_LENGTH, options: "15" },
            { validation: ValidationsEnum.MAX_LENGTH, options: "15" },
            { validation: ValidationsEnum.DIGIT_ONLY },
        ]
    }),
      "closeButton": new ButtonControl({
        columnCount: 4,
        order: 3,
        controlOptions: {
          id: "close",
          type: 'secondary',
          text: "accounts.remind-later"
        }
      }),
      "notEligibleButton": new ButtonControl({
        columnCount: 4,
        order: 3,
        controlOptions: {
          id: "notEligible",
          type: 'secondary',
          text: "accounts.not-eligible"
        }
      }),
      "proceedButton": new ButtonControl({
        columnCount: 4,
        order: 3,
        disable: true,
        controlOptions: {
          id: "proceed",
          type: 'primary',
          text: "public.proceed"
        }
      }),
    }
  })
}

export function vatSucessPopupForm() {
  return new FormModel({
    id: 'vatSucessPopupForm',
    controls: {
      "vatSucessTitle": new TitleControl({
        columnCount: 12,
        order: 1,
        controlOptions: {
          id: "vatSucessTitle",
          title: 'accounts.vat-registered',
          subTitle:'accounts.vat-sucess'
        }
      }),
      "closeButton": new ButtonControl({
        columnCount: 6,
        order: 2,
        controlOptions: {
          id: "close",
          type: 'secondary',
          text: "public.close"
        }
      }),
      "finishButton": new ButtonControl({
        columnCount: 6,
        order: 2,
        controlOptions: {
          id: "finish",
          type: 'primary',
          text: "accounts.vat-finish"
        }
      }),
    }
  })
}
