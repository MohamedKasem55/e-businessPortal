import { TranslateService } from "@ngx-translate/core";
import { FormModel } from "../../../@core/model/dto/formModel";
import { TitleControl } from "../../../@core/model/dto/control/title-control";
import { TableControl } from "../../../@core/model/dto/control/table-control";
import { ButtonModel } from "arb-design-library/model/button.model";
import { TextInputControl } from "../../../@core/model/dto/control/text-input-control";
import { ButtonControl } from "../../../@core/model/dto/control/button-control";
import { DropdownControl } from "../../../@core/model/dto/control/dropdown-control";
import { TextControl } from "../../../@core/model/dto/control/text-control";
import { TableHeaderType } from "arb-design-library";


export function getTitleEndButtons(translate: TranslateService): ButtonModel[] {
  return [
    {
      id: "UserApprovalStatus",
      text: "transfer.beneficiary.user-approval-status",
      type: "secondary",
      isDisable: false,
    },
    {

      id: 'AddNewBeneficiary',
      text: 'transfer.beneficiary.add-new-beneficiary',
      type: 'primary',
      isDisable: false,
      prefixIcon: 'arb-icon-userAdd'
    }
  ];
}

export function getSearchForm() {
  return new FormModel({
    id: 'fromAccountForm',
    controls: {
      "beneficiaryType": new DropdownControl({
        label: 'Beneficiary Type',
        required: false,
        order: 1,
        columnCount: 12,
        controlOptions: {
          columnId: "key",
          textField: 'value',
          hasSearch: true,
        }
      }),
      "beneficiaryName": new TextInputControl({
        label: 'transfer.beneficiary-name',
        required: false,
        order: 2,
        columnCount: 12,
        value: ''
      }),
      "cancelButton": new ButtonControl({
        order: 3,
        columnCount: 4,
        controlOptions: {
          id: "cancel",
          type: 'secondary',
          text: "public.cancel"
        }
      }),
      "resetButton": new ButtonControl({
        order: 4,
        columnCount: 4,
        controlOptions: {
          id: "reset",
          type: 'secondary',
          text: "public.reset"
        }
      }),
      "searchButton": new ButtonControl({
        order: 5,
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

export function selectBeneficiariesForm(translate: TranslateService) {
  return new FormModel({
    id: 'allBeneficiaries',
    controls: {
      "selectedBeneficiariesTitle": new TitleControl({
        columnCount: 12,
        order: 2,
        controlOptions: {
          id: "",
          type: 'Section',

        },
      }),
      "beneficiariesTable": new TableControl({
        columnCount: 12,
        order: 3,
        controlOptions: {
          exportFileName: "Beneficiaries",
          headers: [
            { title: "transfer.beneficiary.beneficiary-title", fieldName: "beneficiaryFullName", type: TableHeaderType.BUTTON, controlOptions: { id: "beneficiaryFullName", text: "beneficiaryFullName" } },
            { title: "transfer.beneficiary.nickname", fieldName: "name", type: TableHeaderType.TEXT },
            { title: "transfer.beneficiary.beneficiary-type", fieldName: "type", type: TableHeaderType.TEXT },
            { title: "transfer.beneficiary.bank-name", fieldName: "bankName", type: TableHeaderType.TEXT },
            { title: "transfer.beneficiary.account-number", fieldName: "beneficiaryAccount.fullAccountNumber", type: TableHeaderType.TEXT },
            { title: "transfer.beneficiary.country", fieldName: "countryCode", type: TableHeaderType.TEXT },
            { title: "transfer.beneficiary.currency", fieldName: "beneficiaryCurrency", type: TableHeaderType.TEXT },
            // { title: "transfer.beneficiary.international.category", fieldName: "beneficiaryCategory", type: TableHeaderType.TEXT },
          ],
          columnId: "beneficiaryIdErn",
          hasCheckbox: true,
          showSearch: true,
          showFilter: true,
          pageSizes: [10, 15],
          title:'transfer.beneficiary.all-beneficiaries'
        },
      }),
    }
  });
}


export function getDeleteForm() {
  return new FormModel({
    id: 'fromAccountForm',
    controls: {
      "title": new TextControl({
        order: 1,
        columnCount: 12,
        label: 'transfer.beneficiary.delete-question',
        class: "text-start color-arb-primaryText font-h2-bold",
      }),
      "subTitle": new TextControl({
        order: 2,
        columnCount: 12,
        label: 'transfer.beneficiary.delete-message',
        class: "text-start color-arb-primaryText font-h2-light"
      }),
      "cancelButton": new ButtonControl({
        order: 3,
        columnCount: 6,
        controlOptions: {
          id: "cancel",
          type: 'secondary',
          text: "public.cancel"
        }
      }),
      "deleteButton": new ButtonControl({
        order: 4,
        columnCount: 6,
        controlOptions: {
          id: "delete",
          type: 'danger',
          text: "transfer.beneficiary.delete-beneficiary"
        }
      }),
    }
  })
}
