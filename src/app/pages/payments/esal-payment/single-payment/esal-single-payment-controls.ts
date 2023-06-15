import { AccountControl } from "app/@core/model/dto/control/account-control";
import { AmountControl } from "app/@core/model/dto/control/amount-control";
import { SummaryItemControl } from "app/@core/model/dto/control/sumery-item-control";
import { TitleControl } from "app/@core/model/dto/control/title-control";
import { FormModel } from "app/@core/model/dto/formModel";
import { ValidationsEnum } from "app/@core/model/dto/validations-enum";

export function accountDetailsForm(): FormModel {
    return new FormModel({
        id: 'accountDetailsForm',
        controls: {
            "billerIdAndNameTitle": new TitleControl({
                order: 1,
                controlOptions: {
                    id: 'billerIdAndName',
                    title: '',
                    subTitle: '',
                    type: "Section"
                },
                columnCount: 12,
                hidden: false
            }),
            "accountDetailsTitle": new TitleControl({
                order: 2,
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
                order: 3,
                value: null,
                columnCount: 6,
                validationLabels: { required: 'transfer.account-is-required' }
            }),
            "amount": new AmountControl({
                label: 'public.amount',
                required: true,
                order: 4,
                value: '',
                columnCount: 6,
                validators: [{ validation: ValidationsEnum.MIN, options: "1" }],
                validationLabels: {
                    min: "",
                    max:"",
                    required: ""
                }
            }),
        },
    })
}

export function billInformationForm(): FormModel {
    return new FormModel({
        id: 'billInformationForm',
        controls: {
            "billTitle": new TitleControl({
                order: 1,
                controlOptions: {
                    id: 'payEsalInvoice',
                    title: 'payments.esal.bill-information',
                    subTitle: '',
                },
                columnCount: 12,
            }),
            "invoiceId": new SummaryItemControl({
                label: 'payments.esal.invoice-id',
                required: false,
                order: 2,
                value: '',
                columnCount: 4,
            }),
            "supplierId": new SummaryItemControl({
                label: 'payments.esal.supplier-id',
                required: false,
                order: 3,
                value: '',
                columnCount: 4,
            }),
            "amountDue": new SummaryItemControl({
                label: 'payments.esal.amount-due',
                required: false,
                order: 4,
                value: '',
                columnCount: 4,
            }),
            "buyerName": new SummaryItemControl({
                label: 'payments.esal.buyer-name',
                required: false,
                order: 5,
                value: '',
                columnCount: 4,
            }),
            "dueDate": new SummaryItemControl({
                label: 'payments.esal.due-date',
                required: false,
                order: 6,
                value: '',
                columnCount: 4,
            }),
            "additionalDetails": new SummaryItemControl({
                label: 'payments.esal.additional-details',
                required: false,
                order: 7,
                value: '',
                columnCount: 4,
            }),
        },
    });
}