import { TranslateService } from "@ngx-translate/core";
import { FormModel } from "../../../@core/model/dto/formModel";
import { TitleControl } from "../../../@core/model/dto/control/title-control";
import { TableControl } from "../../../@core/model/dto/control/table-control";
import { ButtonModel } from "arb-design-library/model/button.model";
import { TextInputControl } from "../../../@core/model/dto/control/text-input-control";
import { ButtonControl } from "../../../@core/model/dto/control/button-control";
import { DropdownControl } from "../../../@core/model/dto/control/dropdown-control";
import { TableHeaderType } from "arb-design-library";
import { DateControl } from "app/@core/model/dto/control/date-control";


export function getTitleEndButtons(translate: TranslateService): ButtonModel[] {
  return [
    {
      id: 'AddNewClaim',
      text: 'claims.addNewClaim',
      type: 'secondary',
      isDisable: false,
    }
  ];
}

export function getSearchForm() {
  return new FormModel({
    id: 'formSearchClaims',
    controls: {
      "titleOpenSearchClaims": new TitleControl({
        columnCount: 12,
        order: 1,
        controlOptions: {
          id: "",
          title: 'claims.titleOpenSearchClaims',
          type: 'Section'
        },
      }),
      "claimID": new TextInputControl({
        label: 'claims.claimID',
        required: false,
        order: 2,
        columnCount: 4,
        value: ''
      }),
      "terminalNumber": new DropdownControl({
        label: 'claims.terminalNumber',
        required: false,
        order: 3,
        columnCount: 8,
        controlOptions: {
          columnId: "key",
          textField: 'value',
          hasSearch: false
        }
      }),
      "dateFrom": new DateControl({
        label: 'claims.dateFrom',
        required: false,
        order: 4,
        columnCount: 6,
        value: ''
      }),
      "dateTo": new DateControl({
        label: 'claims.dateTo',
        required: false,
        order: 5,
        columnCount: 6,
        value: ''
      }),
      "amountFrom": new TextInputControl({
        label: 'claims.amountFrom',
        required: false,
        order: 6,
        columnCount: 6,
        value: ''
      }),
      "amountTo": new TextInputControl({
        label: 'claims.amountTo',
        required: false,
        order: 7,
        columnCount: 6,
        value: ''
      }),
      "cancelButton": new ButtonControl({
        order: 8,
        columnCount: 4,
        controlOptions: {
          id: "cancel",
          type: 'secondary',
          text: "public.cancel"
        }
      }),
      "resetButton": new ButtonControl({
        order: 9,
        columnCount: 4,
        controlOptions: {
          id: "cancel",
          type: 'secondary',
          text: "claims.reset"
        }
      }),
      "searchButton": new ButtonControl({
        order: 10,
        columnCount: 4,
        controlOptions: {
          id: "search",
          type: 'primary',
          text: "public.search",
          prefixIcon: 'arb-icon-Search'
        }
      }),
    }
  })
}

export function selectClaimsForm(translate: TranslateService) {
  return new FormModel({
    id: 'allClaims',
    controls: {
      "claimsTable": new TableControl({
        columnCount: 12,
        order: 3,
        controlOptions: {
          exportFileName: "claims.title",
          headers: [
            { title: "claims.requestID", fieldName: "requestID", type: TableHeaderType.TEXT },
            { title: "claims.date", fieldName: "date", type: TableHeaderType.TEXT },
            { title: "claims.terminalNumber", fieldName: "terminalNumber", type: TableHeaderType.TEXT },
            { title: "claims.TransactionAcount", fieldName: "TransactionAcount", type: TableHeaderType.TEXT },
            { title: "claims.transactionDate", fieldName: "transactionDate", type: TableHeaderType.TEXT },
            { title: "claims.reconciliationAmount", fieldName: "reconciliationAmount", type: TableHeaderType.TEXT },
            { title: "claims.mobileNumber", fieldName: "mobileNumber", type: TableHeaderType.TEXT },
          ],
          columnId: "claimId",
          hasCheckbox: true,
          showSearch: true,
          showFilter: true,
          pageSizes: [10, 15],
          title: 'claims.terminalRequest'
        },
      }),
    }
  });
}

