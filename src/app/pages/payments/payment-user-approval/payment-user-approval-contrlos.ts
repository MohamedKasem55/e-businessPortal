import { ButtonControl } from 'app/@core/model/dto/control/button-control';
import { EmptyControl } from 'app/@core/model/dto/control/empty-control';
import { SummaryItemControl } from 'app/@core/model/dto/control/sumery-item-control';
import { TitleControl } from 'app/@core/model/dto/control/title-control';
import { PopupInputModel } from 'app/@core/model/dto/popup.model';
import { FormModel } from "../../../@core/model/dto/formModel";

export const getDetailForm = (): PopupInputModel =>{
  let form: FormModel = new FormModel({
    id: 'fromAccountForm',
    controls: {
      "date": new SummaryItemControl({
        columnCount: 6,
        order: 2,
        label: "payments.userApproval.date",
        value: ""
      }),
      "amount": new SummaryItemControl({
        columnCount: 6,
        order: 3,
        label: "payments.userApproval.amount",
        value: ""
      }),
      "sponsorId": new SummaryItemControl({
        columnCount: 6,
        order: 4,
        label: "payments.userApproval.govStatus.sponsorId",
        value: ""
      }),
      "account": new SummaryItemControl({
        columnCount: 6,
        order: 5,
        label: "payments.userApproval.account",
        value: "3049299adm-4"
      })
    }
  })
  return {
    form: form
  }
}
