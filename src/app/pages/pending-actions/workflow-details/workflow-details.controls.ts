import {AccountControl} from "app/@core/model/dto/control/account-control";
import {TableControl} from "app/@core/model/dto/control/table-control";
import {TabsControl} from "app/@core/model/dto/control/tabs-control";
import {TitleControl} from "app/@core/model/dto/control/title-control";
import {FormModel} from "app/@core/model/dto/formModel";
import {TableHeaderType} from "arb-design-library";
import {TableHeaderModel} from "arb-design-library/model/table-header.model";
import {TitleModel} from "arb-design-library/model/title.model";

export const workflowDetailsFrom = (): FormModel => {
  return new FormModel({
    id: 'workflowDetailsFrom',
    controls: {
      title: new TitleControl({
        columnCount: 12,
        order: 1,
        controlOptions: {
          id: "selectAccount",
          type: "Section",
          title: "accounts.accountSelect"
        }
      }),
      selectAccount: new AccountControl({
        label: 'accounts.selectAccount',
        required: true,
        order: 2,
        columnCount: 6,
        controlOptions: {
          columnId: 'accountPk',
          textField: ['alias', 'fullAccountNumber'],
          hasSearch: false,
          endTextField: 'availableBalance',
          endTextCurrencyField: 'currency',
          options: [],
          disabledField: "disabled",
        },
        validationLabels: {required: 'pending-actions.account-is-required'}
      }),
      tabsControl: new TabsControl({
        columnCount: 12,
        order: 4,
        value: "0",
        controlOptions: {
          id: "tabs",
          tabs: []
        }
      }),
      tableLevels: new TableControl({
        columnCount: 12,
        order: 5,
        disable: true,
        controlOptions: {
          headers: [],
          columnId: "accountPk",
          hasCheckbox: false,
          showSearch: false,
          data: [],
          showFilter: false,
          exportFileName: "workflowDetailsFile",
          pageSizes: [5, 10, 20],
          paginationValue: {page: 1, size: 10},
          title: "accounts.accountSelect"
        },
      })
    }
  })
}

export const getPageTitle = () => {
  const pageTitle: TitleModel = {
    id: "",
    title: "",
    stepper: undefined,
    showArrow: true,
    endButtons: []
  };
  return pageTitle;
}

export function getHeaders(isFinancial: boolean): TableHeaderModel[] {
  return isFinancial ? [
    {title: "pending-actions.min-amount", fieldName: "amountMin", type: TableHeaderType.TEXT_INPUT},
    {title: "pending-actions.max-amount", fieldName: "amountMax", type: TableHeaderType.TEXT_INPUT},
    {title: "pending-actions.l1", fieldName: "L1", type: TableHeaderType.CHECK_BOX},
    {title: "pending-actions.l2", fieldName: "L2", type: TableHeaderType.CHECK_BOX},
    {title: "pending-actions.l3", fieldName: "L3", type: TableHeaderType.CHECK_BOX},
    {title: "pending-actions.l4", fieldName: "L4", type: TableHeaderType.CHECK_BOX},
    {title: "pending-actions.l5", fieldName: "L5", type: TableHeaderType.CHECK_BOX},
  ] : [
    {title: "pending-actions.l1", fieldName: "L1", type: TableHeaderType.CHECK_BOX},
    {title: "pending-actions.l2", fieldName: "L2", type: TableHeaderType.CHECK_BOX},
    {title: "pending-actions.l3", fieldName: "L3", type: TableHeaderType.CHECK_BOX},
    {title: "pending-actions.l4", fieldName: "L4", type: TableHeaderType.CHECK_BOX},
    {title: "pending-actions.l5", fieldName: "L5", type: TableHeaderType.CHECK_BOX},
  ];
}
