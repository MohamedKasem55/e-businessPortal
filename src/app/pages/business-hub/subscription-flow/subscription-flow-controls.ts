import { AccountControl } from "app/@core/model/dto/control/account-control";
import { SelectionControl } from "app/@core/model/dto/control/selection-control";
import { TextInputControl } from "app/@core/model/dto/control/text-input-control";
import { TitleControl } from "app/@core/model/dto/control/title-control";
import { FormModel } from "app/@core/model/dto/formModel";
import { ButtonModel } from "arb-design-library/model/button.model";


export function getSubscriptionForm() {
    return new FormModel({
        id: 'subscriptionForm',
        controls: {
            "informationDetailsTitle": new TitleControl({
                columnCount: 12,
                order: 1,
                controlOptions: {
                    id: "",
                    title: 'businessHub.information-details',
                    type: 'Section'
                }
            }),
            "nameControl": new TextInputControl({
                label: 'businessHub.full-name',
                order: 2,
                value: "",
                columnCount: 6,
                disable: true
            }),
            "emailControl": new TextInputControl({
                label: 'public.email',
                order: 3,
                value: "",
                columnCount: 6,
                disable: true
            }),
            "phoneControl": new TextInputControl({
                label: 'businessHub.phoneNum',
                order: 2,
                value: "",
                columnCount: 6,
                disable: true
            }),
            "companyNameControl": new TextInputControl({
                label: 'businessHub.companyName',
                order: 3,
                value: "",
                columnCount: 6,
                disable: true
            }),
            "selectAccountTitle": new TitleControl({
                columnCount: 12,
                order: 4,
                controlOptions: {
                    id: "",
                    title: 'businessHub.selectAccount',
                    type: 'Section'
                }
            }),
            "accountsControl": new AccountControl({
                label: 'businessHub.selectAccount',
                required: true,
                order: 5,
                value: null,
                columnCount: 6,
                validationLabels: { required: 'businessHub.account-is-required' }
            }),
            'terms': new SelectionControl({
                label: 'cards.new-card.accept-terms',
                controlOptions: {
                    title: [
                        {
                            text: 'cards.new-card.accept-terms',
                            linkId:"terms"
                        },
                    ],
                },
                required: true,
                order: 6,
                columnCount: 12,
            }),
        }
    });
}

export const getEndButtons = (): ButtonModel[] => {
  return [
    {
      id: 'dashboardBtn',
      text: 'businessHub.goback-dashboard',
      type: 'secondary',
    },
    {
      id: 'businessHubBtn',
      text: 'businessHub.goback-businessHub',
      type: 'primary',
    },
  ];
};
