import { AccountControl } from "app/@core/model/dto/control/account-control";
import { PillControlOptions } from "app/@core/model/dto/control/pill-control";
import { SummaryItemControl } from "app/@core/model/dto/control/sumery-item-control";
import { TableControl } from "app/@core/model/dto/control/table-control";
import { TitleControl } from "app/@core/model/dto/control/title-control";
import { FormModel } from "app/@core/model/dto/formModel";
import { TableHeaderType } from "arb-design-library";
import { ButtonModel } from "arb-design-library/model/button.model";

export function unsubscribedUserForm() {
    return new FormModel({
      id: 'unsubscribedUser',
      controls: {
        "unsubscribedUserTable": new TableControl({
          columnCount: 12,
          order: 2,
          required: true,
          value: [],
          controlOptions: {
            headers: [
              {
                type: TableHeaderType.TEXT,
                title: "company-admin.alert-management.user-id",
                fieldName: "userId"
              },
              {
                type: TableHeaderType.TEXT,
                title: "company-admin.alert-management.name",
                fieldName: "userName"
              },
              {
                type: TableHeaderType.TEXT,
                title: "company-admin.alert-management.mobile-number",
                fieldName: "mobileNumber"
              }
            ],
            columnId: "userPk",
            hasCheckbox: true,
            showSearch: true,
            showFilter: false,
            exportFileName: "Unsubscribed User List",
            pageSizes: [10, 25, 50],
            paginationValue: { page: 1, size: 20 },
          },
        }),
      }
    });
  }

export function getAccountForm(): FormModel {
    return new FormModel({
        id: 'userSmsSubscriptionDetails',
        controls: {
            "fromAccount": new AccountControl({
                label: 'public.from',
                required: true,
                order: 1,
                value: null,
                columnCount: 8,
                validationLabels: { required: 'transfer.account-is-required' }
            }),
            "totalFee": new SummaryItemControl({
                label: 'public.total-amount',
                order: 1,
                value: '',
                controlOptions:{
                    currency:'608'
                },
                columnCount: 4,
            }),
            "subUserTitle": new TitleControl({
                columnCount: 12,
                order: 2,
                controlOptions: {
                    id: "subUserTitle",
                    title: 'company-admin.alert-management.sub-useres',
                    type: 'Section'
                },
            }),
        },
    })
}
export const getSubscribeSmsMessagesButton = (): ButtonModel => {
    return {id: 'SubSMSMessages', text: 'company-admin.alert-management.sub-sms-messages', type: 'primary'}
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

  export const summaryCurrencyControl = {
    columnCount: 4,
    order: 6,
    label: '',
    value: '',
    controlOptions:{
        currency:'608'
    }
  }
  
