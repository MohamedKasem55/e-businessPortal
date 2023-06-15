import {FormModel} from "../../../../@core/model/dto/formModel";
import {TitleControl} from "../../../../@core/model/dto/control/title-control";
import {AccountControl} from "../../../../@core/model/dto/control/account-control";

export function buildAccountForm() {
  return new FormModel({
    id: 'accountForm',
    controls: {
      "detailsTitle2": new TitleControl({
        columnCount: 12,
        order: 1,
        controlOptions: {
          id:"provider-detailsSectionId",
          title: 'payments.pay-bill.provider-details',
          type: 'Section'
        },
      }),
      "fromAccountControl": new AccountControl({
        label: 'public.from',
        required: true,
        order: 2,
        columnCount: 6,
        validationLabels: {required: 'transfer.account-is-required'}
      }),
    }

  })
}
