import { SummaryItemControl } from "app/@core/model/dto/control/sumery-item-control";
import { TitleControl } from "app/@core/model/dto/control/title-control";
import { FormModel } from "app/@core/model/dto/formModel";

export function getAdminAccountSummaryForm(): FormModel {
    return new FormModel({
        id: 'multiInvoiceDetails',
        controls: {
            "accountDetailsTitle": new TitleControl({
                order: 1,
                controlOptions: {
                    id: 'accountDetails',
                    title: '',
                    subTitle: '',
                },
                columnCount: 12,
            }),
            "mobileNumber": new SummaryItemControl({
                label: 'company-admin.alert-management.mobile-number',
                order: 2,
                value: '',
                columnCount: 4,
            }),
            
            "fees": new SummaryItemControl({
                label: 'company-admin.alert-management.fee',
                order: 2,
                value: '',
                columnCount: 4,
                controlOptions:{
                    currency:'608'
                }
            }),
            "maxSmsCount": new SummaryItemControl({
                label: 'company-admin.alert-management.max-sms-count',
                order: 2,
                value: '',
                columnCount: 4,
            }),
            "registrationDate": new SummaryItemControl({
                label: 'company-admin.alert-management.reg-date',
                order: 2,
                value: '',
                columnCount: 4,
            }),
            "expiryDate": new SummaryItemControl({
                label: 'company-admin.alert-management.expiry-date',
                order: 2,
                value: '',
                columnCount: 4,
            }),
        },
    })
}
  
