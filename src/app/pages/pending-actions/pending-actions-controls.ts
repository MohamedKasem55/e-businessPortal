import { TranslateService } from "@ngx-translate/core";
import { ButtonControl } from "app/@core/model/dto/control/button-control";
import { TableControl } from "app/@core/model/dto/control/table-control";
import { TabsControl } from "app/@core/model/dto/control/tabs-control";
import { TitleControl } from "app/@core/model/dto/control/title-control";
import { FormModel } from "app/@core/model/dto/formModel";
import { PendingActionPage } from "app/@core/model/dto/pending-actions-model";
import { PopupInputModel } from "app/@core/model/dto/popup.model";
import { PopupService } from "app/@core/service/base/popup.service";
import { Utils } from "app/@core/utility/Utils";
import { ButtonModel } from "arb-design-library/model/button.model";
import { StepperModel } from "arb-design-library/model/stepper.model";
import { TitleModel } from "arb-design-library/model/title.model";
import { TextControl } from "../../@core/model/dto/control/text-control";
import { TextInputControl, TextInputControlOptions } from "../../@core/model/dto/control/text-input-control";


export const getInitialPageTitle = () => {
  const pageTitle: TitleModel = {
    id: "",
    title: "",
    stepper: undefined,
    showArrow: true,
    endButtons: []
  };
  return pageTitle;
}

export const addSteppertoInitialPageTitle = (): StepperModel => {
  return {
    steps: ["", "", ""],
    stepCounter: 1,
    stepText: "public.step",
    ofText: "public.of"
  }
}

export const dashboardButton: ButtonModel = {
  id: "Dashboard",
  type: 'secondary',
  text: "public.go-to-dashboard"
};

export const pendingActionsButton: ButtonModel = {
  id: "PendingActions",
  type: 'primary',
  text: "public.go-to-pending-actions"
};

export const rejectButton: ButtonModel = {
  id: 'Reject',
  type: 'danger',
  text: 'pending-actions.reject',
};

export const approveButton: ButtonModel = {
  id: 'Approve',
  type: 'primary',
  text: 'pending-actions.approve',
};

export const workflowDetailsButton: ButtonModel = {
  id: 'WorkflowDetails',
  type: 'secondary',
  text: 'pending-actions.workflow-details',
};

export function rejectForm(): FormModel {
  return new FormModel({
    id: 'rejectForm',
    controls: {
      "rejectionReasonTitle": new TitleControl({
        columnCount: 12,
        order: 1,
        controlOptions: {
          id: '',
          title: 'pending-actions.details',
        },
      }),
      "rejectionReason": new TextInputControl({
        order: 2,
        columnCount: 6,
        label: "pending-actions.reject-reason",
        value: "",
        required: false
      })
    }
  });
}

export function pendingActionsForm(): FormModel {
  return new FormModel({
    id: 'pendingActionsForm',
    controls: {
      "pendingActionsTitle": new TitleControl({
        columnCount: 12,
        hidden:true,
        order: 1,
        controlOptions: {
          id: "",
          title: 'pending-actions.pending-actions',
          type: 'Section',
        },
      }),
      "tabsControl": new TabsControl({
        columnCount: 12,
        order: 2,
        value: "",
        controlOptions: {
          id: "tabs",
          tabs: []
        }
      }),
      "pendingActionsTable": new TableControl({
        columnCount: 12,
        order: 3,
        required: true,
        controlOptions: {
          exportFileName: "Pending Actions",
          headers: [],
          data: [],
          columnId: "batchPk",
          hasCheckbox: true,
          showSearch: true,
          showFilter: false,
          pageSizes: [20, 30, 50, 100],
          title: 'pending-actions.pending-actions'
        },
      }),
    }
  });
}


export function getItems(item: any, translate: TranslateService, selectedTab: string): any[] {
  return [
    {
      title: 'pending-actions.initiation-date',
      subTitle: item.initiationDate,
    },
    {
      title: 'pending-actions.card-number',
      subTitle: item.cardNumber ? item.cardNumber : item.cardAccountNumber,
    },
    {
      title: 'pending-actions.payment-type',
      subTitle: (selectedTab === "0") ? getPaymentType(item.typeOperation) : getPaymentType(item.paymentOption),
    },
    {
      title: 'pending-actions.accountNumber',
      subTitle: item.accountNumber,
    },
    {
      title: 'pending-actions.amount',
      subTitle: item.amount!.toString(),
      currency: "608",
    },
    // {
    //   title: 'total',
    //   subTitle: totalAmount,
    //   currency: "608",
    // },
    Utils.getCurrentLevelSummaryItem(translate, item.futureSecurityLevelsDTOList),
    Utils.getNextLevelSummaryItem(translate, item.futureSecurityLevelsDTOList)
  ]
}


export function getPaymentType(type: string): string {
  let paymentType = '';
  switch (type) {
    case "PR":
      paymentType = 'pending-actions.refund';
      break;
    case "LD":
      paymentType = 'pending-actions.load-funds';
      break;
    case "0":
      paymentType = 'pending-actions.dueAmount';
      break;
    case "1":
      paymentType = 'pending-actions.outstandingAmount';
      break;
    case "2":
      paymentType = 'pending-actions.custom';
      break;
  }

  return paymentType;
}

export function getTable(pendingObject: any, tableData: any, title?: string) {
  const customTitle = getTableTitle(title)
  return {
    title: {
      id: 'Table',
      title: customTitle,
    },
    table: {
      columnId: '',
      headers: pendingObject,
      maxDisplayRow: 5,
      data: tableData,
    }
  }
}

export function getTableTitle(title?: string): string {
  let customTitle: string = '';
  if (title === 'PROCESS') {
    customTitle = 'pending-actions.actions-will-be-complete';
  } else if (title === 'AUTHORIZE') {
    customTitle = 'pending-actions.actions-will-approved';

  } else {
    customTitle = 'pending-actions.actions-will-be-reject';
  }
  return customTitle;
}

export function getSummaryPendingTitle(process: string, pendingType: any): string {
  let summaryPendingTitle: string = '';

  if (process === 'reject') {
    summaryPendingTitle = 'pending-actions.actions-will-be-reject';
  } else {
    summaryPendingTitle = pendingType === 'PROCESS' ? 'pending-actions.actions-will-be-complete' : 'pending-actions.actions-will-approved';
  }
  return summaryPendingTitle;
}

export function showWarningModal(warning: any, popupService: PopupService) {
  warning.image = 'assets/img/warning.svg';
  warning.alert = {
    id: "warning",
    type: "Critical",
    showClose: false,
    message: "pending-actions.WPS-message"
  }
  popupService.showPopup(warning).subscribe((res) => {
    if (res.buttonId == "ok") {
      popupService.dismiss();
    }
  });
}

export const getWarningPopUpForm = (): PopupInputModel => {
  let form: FormModel = new FormModel({
    id: 'warning',
    controls: {
      "title": new TextControl({
        order: 1,
        columnCount: 12,
        label: "pending-actions.WPS-message",
        class: "color-arb-primaryText font-h2-bold"
      }),

      "okButton": new ButtonControl({
        order: 2,
        columnCount: 12,
        controlOptions: {
          id: "ok",
          type: 'primary',
          text: "public.ok"
        }
      }),
    }
  })
  return {
    form: form
  }
}

export function getTitle(pendingActionPage: PendingActionPage, translate: TranslateService, selectedTab: number, actionIsApprove: boolean): string {
  // const titleType = pendingActionPage.tabs && pendingActionPage.tabs.length > 0 ? pendingActionPage.tabs[selectedTab].text : pendingActionPage.title;
  const titleType = pendingActionPage.title;
  const title = translate.instant(titleType) + " " + (actionIsApprove ? translate.instant('pending-actions.approval') : translate.instant('pending-actions.rejection'));
  return title
}