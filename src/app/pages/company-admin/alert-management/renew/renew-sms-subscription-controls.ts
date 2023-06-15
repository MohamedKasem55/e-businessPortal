import { AccountControl } from "app/@core/model/dto/control/account-control";
import { PillControlOptions } from "app/@core/model/dto/control/pill-control";
import { TitleControl } from "app/@core/model/dto/control/title-control";
import { FormModel } from "app/@core/model/dto/formModel";

export function getAccountForm(): FormModel {
    return new FormModel({
        id: 'multiInvoiceDetails',
        controls: {
            "accountDetailsTitle": new TitleControl({
                order: 1,
                controlOptions: {
                    id: 'accountDetails',
                    title: 'transfer.account-details',
                    subTitle: '',
                },
                columnCount: 12,
            }),
            "fromAccount": new AccountControl({
                label: 'public.from',
                required: true,
                order: 2,
                value: null,
                columnCount: 8,
                validationLabels: { required: 'transfer.account-is-required' }
            }),
        },
    })
}

export const pillControl: PillControlOptions = {
    columnCount: 12,
    order: 3,
    controlOptions: {
      text: '',
      type: 'Neutral'
    }
  };

  export const summaryControl = {
    columnCount: 4,
    order: 6,
    label: '',
    value: ''
  }

  export const summaryCurrentControl = {
    columnCount: 4,
    order: 6,
    label: '',
    value: '',
    controlOptions:{
        currency:'608'
    }
  }
  
