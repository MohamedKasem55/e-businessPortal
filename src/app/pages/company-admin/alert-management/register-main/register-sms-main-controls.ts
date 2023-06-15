import { RadioGroupControl } from "app/@core/model/dto/control/radio-group-control";
import { TitleControl } from "app/@core/model/dto/control/title-control";
import { FormModel } from "app/@core/model/dto/formModel";

export function getRegistrationTypeForm(): FormModel {
  return new FormModel({
    id: 'multiInvoiceDetails',
    controls: {
      "smsRegistrationTitle": new TitleControl({
        order: 1,
        controlOptions: {
          id: 'registration',
          title: 'company-admin.alert-management.sms-register',
          subTitle: '',
        },
        columnCount: 12,
      }),
      "registrationType": new RadioGroupControl({
        columnCount: 4,
        required: true,
        order: 2,
        controlOptions: {
          options: [
            {
              id: "0",
              title: 'company-admin.name'
            },
            {
              id: "1",
              title: 'company-admin.alert-management.other-users'
            }
          ],
          textOnStart: false,
        }
      }),
    },
  })
}

