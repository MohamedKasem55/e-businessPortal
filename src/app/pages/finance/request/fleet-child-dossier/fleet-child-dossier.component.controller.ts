import {FormModel} from "../../../../@core/model/dto/formModel";
import {SummaryItemControl} from "../../../../@core/model/dto/control/sumery-item-control";
import {DividerControl} from "../../../../@core/model/dto/control/divider-control";
import {TitleControl} from "../../../../@core/model/dto/control/title-control";
import {PopupInputModel} from "../../../../@core/model/dto/popup.model";
import {ProcedureStatusControl} from "../../../../@core/model/dto/control/procedure-status-control";
import {ButtonControl} from "../../../../@core/model/dto/control/button-control";
import {EmptyControl} from "../../../../@core/model/dto/control/empty-control";


export const childContractForm = (data: any) => {
  return new FormModel({
    id: 'childContractForm',
    controls: {
      'ApplicationId': new SummaryItemControl({
        columnCount: 6,
        order: 1,
        label: 'finance.fleet.requests.AppID',
        value: data.dossierID
      }),
      'totalFinanceAmt': new SummaryItemControl({
        columnCount: 6,
        order: 2,
        label: 'finance.fleet.requests.totalFinanceAmount',
        value: data.amt
      }),
      'contractDate': new SummaryItemControl({
        columnCount: 12,
        order: 3,
        label: 'finance.fleet.requests.contractDate',
        value: data.contractDate
      }),
      financeDetails: new TitleControl({
        columnCount: 12,
        order: 4,
        controlOptions: {
          id: "business-cards-details-title",
          title: 'finance.fleet.requests.financeDetails',
          type: 'Section'
        }
      }),
      "divider": new DividerControl({
        order: 5,
        columnCount: 12
      })
    }
  })
}
export const getReviewModel = (): PopupInputModel => {
  let form: FormModel = new FormModel({
    id: 'reviewChildContract',
    controls: {

      "cancel": new ButtonControl({
        columnCount: 6,
        order: 2,
        controlOptions: {
          id: 'cancel',
          type: 'secondary',
          text: 'finance.fleet.btn.cancel'
        }
      }),
      "sanad": new ButtonControl({
        columnCount: 6,
        order: 3,
        controlOptions: {
          id: 'sanad',
          type: 'primary',
          text: 'finance.fleet.btn.acceptSanad'
        }
      }),
    }
  })
  return {
    form: form
  }
}

export const attentionNeededModel = (): PopupInputModel => {
  let form: FormModel = new FormModel({
    id: 'attentionNeededModel',
    controls: {
      "attention": new ProcedureStatusControl({
        columnCount: 12,
        order: 1,
        controlOptions: {
          type: 'Warning',
          title: 'finance.fleet.requests.AttentionNeeded',
          subTitle: 'finance.fleet.requests.AttentionNeeded_desc'
        }
      }),
      "cancel": new ButtonControl({
        columnCount: 6,
        order: 2,
        controlOptions: {
          id: 'cancel',
          type: 'secondary',
          text: 'finance.fleet.btn.cancel'
        }
      }),
      "UploadDocuments": new ButtonControl({
        columnCount: 6,
        order: 3,
        controlOptions: {
          id: 'UploadDocuments',
          type: 'primary',
          text: 'finance.fleet.requests.UploadDocuments'
        }
      }),
    }
  })
  return {
    form: form
  }
}

export const IssueDeliveryModel = (): PopupInputModel => {
  let form: FormModel = new FormModel({
    id: 'IssueDeliveryModel',
    controls: {
      "delivery": new ProcedureStatusControl({
        columnCount: 12,
        order: 1,
        controlOptions: {
          type: 'Warning',
          title: 'finance.fleet.requests.DeliveryOrderIssued',
          subTitle: 'finance.fleet.requests.DeliveryOrderIssued_desc'
        }
      }),
      "divider": new DividerControl({
        columnCount: 12,
        order: 2
      }),
      "empty": new EmptyControl({
        order: 5,
        columnCount: 3
      }),
      "fleetFinance": new ButtonControl({
        columnCount: 6,
        order: 6,
        controlOptions: {
          id: 'fleetFinance',
          type: 'primary',
          text: 'finance.fleet.requests.ViewFleetFinance',

        }
      }),
    }
  })
  return {
    form: form
  }
}
