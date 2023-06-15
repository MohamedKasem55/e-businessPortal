import {FormModel} from "../../../../@core/model/dto/formModel";
import {TabsControl} from "../../../../@core/model/dto/control/tabs-control";
import {TableControl} from "../../../../@core/model/dto/control/table-control";
import {TitleModel} from "arb-design-library/model/title.model";
import {TableHeaderModel} from "arb-design-library/model/table-header.model";
import {TableHeaderType} from "arb-design-library";
import {StepperModel} from "arb-design-library/model/stepper.model";
import {TitleControl} from "../../../../@core/model/dto/control/title-control";
import {ButtonModel} from "arb-design-library/model/button.model";
import {DropdownControl} from "../../../../@core/model/dto/control/dropdown-control";
import {TextInputControl} from "../../../../@core/model/dto/control/text-input-control";
import {SelectionControl} from "../../../../@core/model/dto/control/selection-control";
import {ButtonControl} from "../../../../@core/model/dto/control/button-control";
import {AccountControl} from "../../../../@core/model/dto/control/account-control";
import {AlertModel} from "../../../../@core/model/dto/alert.model";
import {TabModel} from "arb-design-library/model/tab.model";

export const getPageTitle = (): TitleModel => {
  return {
    id: 'workflowManagement',
    type: "Page",
    title: 'workflow.workflowManagement',
    showArrow: true,
  };
}

export const getAccountRulesPageTitle = (): TitleModel => {
  return {
    id: 'account-rules',
    type: "Page",
    title: 'workflow.account-rules',
    showArrow: true,
    stepper: undefined,
  };
}

export const getNonFinancialPageTitle = (): TitleModel => {
  return {
    id: 'non-financial',
    type: "Page",
    title: 'workflow.non-financial',
    showArrow: true,
    stepper: undefined,
  };
}

export const getETradePageTitle = (): TitleModel => {
  return {
    id: 'e-trade',
    type: "Page",
    title: 'workflow.e-trade-rules',
    showArrow: true,
    stepper: undefined,
  };
}

export const getAccountRulesForm = (mapObjects: any, eTrade: boolean): FormModel => {
  return new FormModel({
    id: 'workflowForm',
    controls: {
      accountTitle: new TitleControl({
        hidden: true,
        columnCount: 12,
        order: 2,
        controlOptions: {
          id: "",
          type: "Section",
          title: 'public.account',
          subTitle: ''
        },
      }),
      workflowTabs: getWorkflowTabs(eTrade),
      workflowTable: getAccountsTableControl(mapObjects),
    }
  })

}

export const getWorkflowTabs = (eTrade: boolean): TabsControl => {
  let tabsArray: TabModel[] = [
    {text: "workflow.account-rules", value: "account-rules"},
    {text: "workflow.non-financial", value: "non-financial"}
  ]
  if (eTrade) {
    tabsArray.push({text: "workflow.e-trade-rules", value: "e-trade-rules"})
  }
  return new TabsControl({
    columnCount: 12,
    order: 3,
    controlOptions: {
      id: 'workflowTabs',
      tabs: tabsArray,
    }
  })
}

export const getAccountsTableControl = (mapObjects: any): TableControl => {
  return new TableControl({
    columnCount: 12,
    order: 4,
    required: true,
    hidden: false,
    controlOptions: {
      showSortAndPin: false,
      columnId: 'account.accountPk',
      headers: getAccountsTableHeaders(mapObjects),
      showFilter: true,
      showSearch: true,
    }
  });
}

export const getAccountsTableHeaders = (mapObjects: any): TableHeaderModel[] => {
  let headers: TableHeaderModel[] = [];
  headers.push({
    title: "public.account",
    type: TableHeaderType.BUTTON,
    fieldName: "account.fullAccountNumber",
    controlOptions: {
      id: '',
      text: "account.fullAccountNumber",
    }
  });
  headers.push({
    title: "public.nickname",
    type: TableHeaderType.TEXT,
    fieldName: "account.alias",
  });
  headers.push({
    type: TableHeaderType.TEXT,
    title: "public.currency",
    fieldName: "account.currency",
    mapObject: mapObjects.currency
  });
  headers.push({
    type: TableHeaderType.TEXT,
    title: "public.branch",
    fieldName: "account.branchid",
    mapObject: mapObjects.branchRbs5
  });
  headers.push({
    type: TableHeaderType.TEXT,
    title: "public.status",
    fieldName: "account.status",
    mapObject: mapObjects.WorkflowAccountStatus,
  });
  headers.push({
    type: TableHeaderType.TEXT,
    title: "workflow.lastActionBy",
    fieldName: "userUpdate",
    mapObject: 'account.userUpdate',
  });
  headers.push({
    type: TableHeaderType.DATE_TEXT,
    title: "workflow.lastActionDate",
    fieldName: "dateUpdate",
    controlOptions: {format: "dd/MM/yyyy"},
    mapObject: 'account.dateUpdate',
  });
  return headers;
}

export const getAccountRulesTitleControl = (text: string, buttonId: string, titleId: string): TitleControl => {
  return new TitleControl({
    columnCount: 12,
    controlOptions: {
      id: titleId,
      title: text,
      type: "Section",
      endButtons: [{
        text: "workflow.add-account-rules",
        id: buttonId,
        type: "secondary",
        prefixIcon: "arb-icon-circlePlus",
        isDisable: true,
      }],
      stepper: undefined,
    }
  });
}

export const getDeleteButtonHeader = (): TableHeaderModel => {
  return {
    title: '', fieldName: "delete", type: TableHeaderType.BUTTON, controlOptions: {
      id: "delete",
      prefixIcon: "arb-icon-Trash color-arb-negativeText",
      disableCondition: '0',
    },
  };
}

export const getAccountRulesTableControl = (): TableControl => {
  return new TableControl({
    columnCount: 12,
    required: true,
    hidden: false,
    disable: true,
    class: 'pb-3',
    controlOptions: {
      columnId: 'col',
      showSortAndPin: false,
      headers: [
        {
          title: "workflow.min-amount", fieldName: "amountMin", type: TableHeaderType.AMOUNT_TEXT,
          controlOptions: {currency: ''}
        },
        {
          title: 'workflow.max-amount', fieldName: "amountMax", type: TableHeaderType.AMOUNT_INPUT,
          controlOptions: {currency: '', min: "amountMin",}
        },
        {title: 'L1', fieldName: "L1", type: TableHeaderType.CHECK_BOX},
        {title: 'L2', fieldName: "L2", type: TableHeaderType.CHECK_BOX},
        {title: 'L3', fieldName: "L3", type: TableHeaderType.CHECK_BOX},
        {title: 'L4', fieldName: "L4", type: TableHeaderType.CHECK_BOX},
        {title: 'L5', fieldName: "L5", type: TableHeaderType.CHECK_BOX},
      ],
    }
  });
}

export const getStepper = (): StepperModel => {
  return {
    steps: ['', '', ''],
    stepCounter: 1,
    stepText: 'public.step',
    ofText: 'public.of',
  }
}

export const getNonFinancialForm = (eTrade: boolean): FormModel => {
  return new FormModel({
    id: 'workflowForm',
    controls: {
      workflowTabs: getWorkflowTabs(eTrade),
      emptyTable: new TableControl({
        columnCount: 12,
        controlOptions: {
          showSortAndPin: false,
          headers: [{title: '', fieldName: '', type: TableHeaderType.TEXT}],
          columnId: ''
        }
      })
    }
  })
}

export const getNonFinancialTitleControl = (text: string, titleId: string): TitleControl => {
  return new TitleControl({
    columnCount: 12,
    controlOptions: {
      id: titleId,
      title: text,
      type: "Section",
      stepper: undefined,
    }
  });
}

export const getNonFinancialTableControl = (titleText: string): TableControl => {
  return new TableControl({
    columnCount: 12,
    required: true,
    hidden: false,
    disable: true,
    class: 'pb-3',
    controlOptions: {
      title: titleText,
      columnId: 'privilege',
      showSortAndPin: false,
      headers: [
        {title: titleText, fieldName: "privilege", type: TableHeaderType.TEXT, widthRem: 15},
        {title: 'L1', fieldName: "L1", type: TableHeaderType.CHECK_BOX},
        {title: 'L2', fieldName: "L2", type: TableHeaderType.CHECK_BOX},
        {title: 'L3', fieldName: "L3", type: TableHeaderType.CHECK_BOX},
        {title: 'L4', fieldName: "L4", type: TableHeaderType.CHECK_BOX},
        {title: 'L5', fieldName: "L5", type: TableHeaderType.CHECK_BOX},
      ],
    }
  });
}

export const getNonFinancialSummaryTableControl = (): TableControl => {
  return new TableControl({
    columnCount: 12,
    required: true,
    hidden: false,
    disable: true,
    class: 'pb-3',
    controlOptions: {
      columnId: 'privilege',
      showSortAndPin: false,
      headers: [
        {title: 'L1', fieldName: "L1", type: TableHeaderType.CHECK_BOX},
        {title: 'L2', fieldName: "L2", type: TableHeaderType.CHECK_BOX},
        {title: 'L3', fieldName: "L3", type: TableHeaderType.CHECK_BOX},
        {title: 'L4', fieldName: "L4", type: TableHeaderType.CHECK_BOX},
        {title: 'L5', fieldName: "L5", type: TableHeaderType.CHECK_BOX},
      ],
    }
  });
}

export const getCompanyAdminButton = (): ButtonModel => {
  return {
    id: "goToCA",
    text: "workflow.go-to-company-admin",
    type: "primary",
  };
}

export const getWorkflow = (): ButtonModel => {
  return {
    id: "goToWorkflow",
    text: "workflow.go-to-workflow",
    type: "secondary",
  };
}

export const getETradeForm = (): FormModel => {
  return new FormModel({
    id: 'eTradeForm',
    controls: {
      workflowTabs: getWorkflowTabs(true),
    }
  })
}

export const getETradeTitleControl = (text: string, titleId: string): TitleControl => {
  return new TitleControl({
    columnCount: 12,
    controlOptions: {
      id: titleId,
      title: text,
      type: "Section",
      stepper: undefined,
    }
  });
}

export const getETradeTableControl = (titleText: string): TableControl => {
  return new TableControl({
    columnCount: 12,
    required: true,
    hidden: false,
    disable: true,
    class: 'pb-3',
    controlOptions: {
      columnId: 'col',
      showSortAndPin: false,
      title: titleText,
      headers: [
        {
          title: 'workflow.max-approval-amount',
          fieldName: "amount",
          type: TableHeaderType.AMOUNT_INPUT,
          widthRem: 30,
          controlOptions: {
            currency: '',
            min: "amountMin",
          }
        },
        {
          widthRem: 30,
          title: titleText,
          fieldName: "level",
          type: TableHeaderType.TEXT,
          mapObject: getLevels()
        },
      ],
    }
  });
}

export function getLevels() {
  return {"1": "L1", "2": "L2", "3": "L3", "4": "L4", "5": "L5"};
}

export const getSearchForm = (): FormModel => {
  return new FormModel({
    id: 'searchForm',
    controls: {
      accounts: new AccountControl({
        order: 1,
        label: 'public.account',
      }),
      nickName: new TextInputControl({
        order: 2,
        label: 'public.nickname',
        value: ''
      }),
      currency: new DropdownControl({
        order: 3,
        label: 'public.currency',
        controlOptions: {
          columnId: 'key',
          textField: 'value',
          hasSearch: true,
        }
      }),
      branch: new DropdownControl({
        order: 4,
        label: 'public.branch',
        controlOptions: {
          columnId: 'key',
          textField: 'value',
          hasSearch: true,
        }
      }),
      searchByPrivilege: new SelectionControl({
        order: 5,
        controlOptions: {
          type: "checkbox",
          title: 'workflow.search-by-privilege',
        }
      }),
      privilege: new DropdownControl({
        order: 6,
        label: 'workflow.Privilege',
        hidden: true,
        controlOptions: {
          columnId: 'key',
          textField: 'value',
          hasSearch: true,
          isCheckboxList: true
        }
      }),
      privilegeActive: new SelectionControl({
        order: 7,
        hidden: true,
        controlOptions: {
          type: "checkbox",
          title: 'workflow.privilege-active',
        }
      }),
      status: new DropdownControl({
        order: 8,
        label: 'public.status',
        controlOptions: {
          columnId: 'key',
          textField: 'value',
          hasSearch: true,
        }
      }),
      cancelButton: new ButtonControl({
        order: 9,
        columnCount: 4,
        controlOptions:
          {
            id: "cancel",
            type: 'secondary',
            text: "public.cancel"
          }
      }),
      reset: new ButtonControl({
        order: 10,
        columnCount: 4,
        controlOptions:
          {
            id: "reset",
            type: 'secondary',
            text: "public.reset"
          }
      }),
      searchButton: new ButtonControl({
        order: 11,
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

export const getAccountRulesAlerts = (): AlertModel => {
  return {
    id: 'string',
    type: "Normal",
    message: [],
  }
}

export const getSummaryTitle = (): TitleModel => {
  return {
    id: 'sectionTitle',
    title: 'public.summary'
  }
}
