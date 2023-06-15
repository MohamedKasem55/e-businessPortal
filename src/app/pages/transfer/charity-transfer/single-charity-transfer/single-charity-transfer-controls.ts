import { TranslateService } from "@ngx-translate/core";
import { AccountControl } from "app/@core/model/dto/control/account-control";
import { DropdownControl } from "app/@core/model/dto/control/dropdown-control";
import { TextInputControl } from "app/@core/model/dto/control/text-input-control";
import { FormModel } from "app/@core/model/dto/formModel";
import { Account } from "app/@core/model/rest/common/account";
import { ButtonModel } from "arb-design-library/model/button.model";

export function charityForm(translate: TranslateService, accounts: Account[]): FormModel {
    return new FormModel({
        id: 'charityForm',
        showDivider: true,
        controls: {

            fromAccount: new AccountControl({
                label: 'transfer.charity.from-account',
                required: true,
                order: 1,
                value: null,
                controlOptions: {
                    columnId: "accountPk",
                    textField: ['fullAccountNumber','alias'],
                    hasSearch: true,
                    endTextField: 'availableBalance',
                    endTextCurrencyField: 'currency',
                    options: accounts,
                    disabledField: "disabled",
                },
                columnCount: 6,
                validationLabels: { required: 'transfer.charity.from-account-is-required' }
            }),

            amount: new TextInputControl({
                label: 'transfer.charity.amount',
                required: true,
                order: 2,
                columnCount: 6,
                value: '',
                validationLabels: { required: 'transfer.charity.amount-is-required' }
            }),

            remarks: new TextInputControl({
                label: 'transfer.charity.remarks',
                required: false,
                order: 6,
                columnCount: 6,
                value: '',
            }),

            charityCategories: new DropdownControl({
                label: 'transfer.charity.charity-categories',
                order: 3,
                required: true,
                controlOptions: {
                    columnId: "key",
                    textField: 'value.description',
                    options: [],
                  hasSearch: true,
                },
                columnCount: 6,
                validationLabels: { required: 'transfer.charity.charity-categories-is-required' },
                hidden: false
            }),
            charityOrganization: new DropdownControl({
                label: 'transfer.charity.charity-organization',
                order: 4,
                required: true,
                controlOptions: { columnId: "groupId", textField: 'description',
                  hasSearch: true, },
                columnCount: 6,
                validationLabels: { required: 'transfer.charity.charity-organization-is-required' },
                hidden: false
            }),
            toBeneficiaryAccount: new AccountControl({
                label: 'transfer.charity.to-beneficiary-account',
                required: true,
                order: 5,
                value: null,
                controlOptions: {
                    columnId: "account",
                    textField: ['account', 'description'],
                    // endTextField: 'availableBalance',
                    // endTextCurrencyField: 'currency',
                    options: []
                },
                columnCount: 6,
                validationLabels: { required: 'transfer.charity.to-beneficiary-account-is-required' }
            })
        }
    });
}

export const getEndButtons = (): ButtonModel[] => {
    return [{
      id: "goToDashboard",
      type: 'secondary',
      text: "transfer.charity.go-to-dashboard"
    },
      {
        id: "goToCommunityServices",
        type: 'primary',
        text: "transfer.charity.go-to-charity-transfer"
      }
    ]
  }
