import {TranslateService} from "@ngx-translate/core";
import {ButtonControl} from "app/@core/model/dto/control/button-control";
import {DropdownControl} from "app/@core/model/dto/control/dropdown-control";
import {TableControl} from "app/@core/model/dto/control/table-control";
import {TextInputControl} from "app/@core/model/dto/control/text-input-control";
import {TitleControl} from "app/@core/model/dto/control/title-control";
import {FormModel} from "app/@core/model/dto/formModel";
import {TableHeaderType} from "arb-design-library";
import {ButtonModel} from "arb-design-library/model/button.model";

export function getTitleEndButtons(translate: TranslateService): ButtonModel[] {
  return [
    {
      id: "singleCharityTransfer",
      text: "transfer.charity.single-charity-transfer",
      type: "secondary",
      isDisable: false,
    }
  ];
}

export function getSearchForm() {
  return new FormModel({
    id: 'charityTransferSearch',
    controls: {
      "charityCategoriesType": new DropdownControl({
        label: 'transfer.charity.charity-categories',
        required: false,
        order: 1,
        columnCount: 12,
        controlOptions: {
          columnId: "key",
          textField: 'value.value.description',
          hasSearch: true,
        },
      }),
      "charityOrganization": new DropdownControl({
        label: 'transfer.charity.charity-organization',
        required: false,
        order: 2,
        columnCount: 12,
        controlOptions: {
          columnId: "groupId",
          textField: 'description',
          hasSearch: true,
        }
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

export function singleCharityForm(translate: TranslateService) {
  return new FormModel({
    id: 'transactionHistory',
    controls: {
      "charityTransferTable": new TableControl({
        columnCount: 12,
        order: 2,
        controlOptions: {
          exportFileName: "SingleCharity",
          headers: [
            {title: "transfer.charity.transfer-date", fieldName: "transferDate", type: TableHeaderType.TEXT},
            {
              title: "transfer.charity.transfer-amount",
              fieldName: "amount",
              type: TableHeaderType.AMOUNT_TEXT,
              controlOptions: {currency: 'currency'}
            },
            {title: "transfer.charity.charity-categories", fieldName: "categoryDescription", type: TableHeaderType.TEXT},
            {title: "transfer.charity.charity-organization", fieldName: "groupDescription", type: TableHeaderType.TEXT},
            {title: "transfer.charity.remarks", fieldName: "remarks", type: TableHeaderType.TEXT},
          ],
          columnId: "categoryPk",
          hasCheckbox: false,
          showSearch: true,
          showFilter: true,
          pageSizes: [20, 30, 50, 100],
          paginationValue: {page: 1, size: 20},
          title: 'transfer.charity.transaction-history'
        },
      }),
    }
  });
}

export interface searchData {
  maxRecs?: number,
  offset?: number,
  charityCategoryPk?: string | null;
  charityGroupId?: string | null;
}
