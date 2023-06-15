import { TranslateService } from "@ngx-translate/core";
import { FormModel } from "../../../../@core/model/dto/formModel";
import { TitleControl } from "../../../../@core/model/dto/control/title-control";
import { SummaryItemControl } from "../../../../@core/model/dto/control/sumery-item-control";
import { AmountControl } from "../../../../@core/model/dto/control/amount-control";

export function getPaymentSummaryForm(translate: TranslateService, data: any) {
  return new FormModel({
    id: 'payment-details',
    showDivider: true,
    controls: {
      "paymentDetailsTitle": new TitleControl({
        columnCount: 12,
        order: 1,
        controlOptions: {
          id: "payment-details-title",
          title: "payments.userApproval.govStatus.paymentSummary",
        }
      }),
      "transactionType": new SummaryItemControl({
        columnCount: 4,
        order: 2,
        label: "payments.userApproval.govStatus.transactiontype",
        value: ""
      }),
      "serviceType": new SummaryItemControl({
        columnCount: 4,
        order: 2,
        label: "payments.userApproval.govStatus.serviceType",
        value: ""
      }),
      "applicationType": new SummaryItemControl({
        columnCount: 4,
        order: 2,
        label: "payments.userApproval.govStatus.applicationtype",
        value: ""
      }),
      "initiatedBy": new SummaryItemControl({
        columnCount: 4,
        order: 3,
        label: "payments.userApproval.govStatus.initiatedBy",
        value: ""
      }),
      "initiatedDate": new SummaryItemControl({
        columnCount: 4,
        order: 3,
        label: "payments.userApproval.govStatus.initiatedDate",
        value: ""
      }),
      "initiatedTime": new SummaryItemControl({
        columnCount: 4,
        order: 3,
        label: "payments.userApproval.govStatus.initiatedTime",
        value: ""
      }),
      "refrenceNumber": new SummaryItemControl({
        columnCount: 4,
        order: 4,
        label: "payments.userApproval.govStatus.referenceNumber",
        value: ""
      }),
      "sponsorId": new SummaryItemControl({
        columnCount: 4,
        order: 4,
        label: "payments.userApproval.govStatus.sponsorId",
        value: ""
      }),
      "numberOfVisa": new SummaryItemControl({
        columnCount: 4,
        order: 4,
        label: "payments.userApproval.govStatus.numberVisa",
        value: "-"
      }),
      "status": new SummaryItemControl({
        columnCount: 4,
        order: 5,
        label: "payments.userApproval.govStatus.status",
        value: ""
      }),
      "account": new SummaryItemControl({
        columnCount: 4,
        order: 5,
        label: "payments.userApproval.govStatus.account",
        value: ""
      }),
      "amount": new AmountControl({
        columnCount: 3,
        required: true,
        label: "payments.userApproval.govStatus.amount",
        order: 5,
        disable: true,
        value: 0
      }),
    }
  });
}


export function getPaymentStatusForm(translate: TranslateService, data: any) {
  return new FormModel({
    id: 'payment-status',
    controls: {
      "paymentStatusTitle": new TitleControl({
        columnCount: 12,
        order: 1,
        controlOptions: {
          id: "payment-status-title",
          title: "payments.userApproval.govStatus.status",
        }
      }),
      "currentLevel": new SummaryItemControl({
        columnCount: 3,
        order: 2,
        label: "payments.userApproval.govStatus.currentLevel",
        value: "",
        disable: true
      }),
      "nextLevel": new SummaryItemControl({
        columnCount: 3,
        order: 2,
        label: "payments.userApproval.govStatus.nextLevel",
        value: "",
        disable: true
      }),
    }
  });
}
