import { TranslateService } from "@ngx-translate/core";
import { AccountControl } from "app/@core/model/dto/control/account-control";
import { AmountControl } from "app/@core/model/dto/control/amount-control";
import { DropdownControl } from "app/@core/model/dto/control/dropdown-control";
import { NumberInputControl } from "app/@core/model/dto/control/number-input-control";
import { TitleControl } from "app/@core/model/dto/control/title-control";
import { FormModel } from "app/@core/model/dto/formModel";
import { ValidationsEnum } from "app/@core/model/dto/validations-enum";

export function payEsalForm(): FormModel {
    return new FormModel({
        id: 'payEsalForm',
        controls: {
            "benefTitle": new TitleControl({
                order: 1,
                controlOptions: {
                    id: 'payEsalInvoice',
                    title: 'payments.esal.pay-esal-invoice',
                    subTitle: '',
                },
                columnCount: 12,
            }),
            "singleType": new DropdownControl({
                label: 'payments.esal.select-type',
                order: 2,
                controlOptions: { textField: 'value', columnId:"key",
                  hasSearch: true, },
                columnCount: 6,
                required: true,
                validationLabels: { required: 'payments.esal.type-is-required' }
            }),
            "payerIdNumber": new NumberInputControl({
                label: 'payments.esal.payer-id-number',
                required: true,
                order: 2,
                value: '',
                columnCount: 6,
                validationLabels: {
                    required:   'payments.esal.id-is-required',
                    minLength:  'payments.esal.id-min-length',
                    maxLength:  'payments.esal.id-max-length'
                },
                validators: [
                    { validation: ValidationsEnum.MIN_LENGTH, options: "12" },
                    { validation: ValidationsEnum.MAX_LENGTH, options: "12" },
                    { validation: ValidationsEnum.DIGIT_ONLY },
                ]
            }),
        },
    });
}

export function accountDetailsForm(): FormModel {
    return new FormModel({
        id: 'accountDetailsForm',
        controls: {
            "accountDetailsTitle": new TitleControl({
                order: 1,
                controlOptions: {
                    id: 'payEsalInvoice',
                    title: 'transfer.account-details',
                    subTitle: '',
                },
                columnCount: 12,
            }),
            "fromAccount": new AccountControl({
                label: 'public.from',
                required: true,
                hidden:true,
                order: 2,
                columnCount: 6,
                validationLabels: { required: 'transfer.account-is-required' },
            }),
            "amount": new AmountControl({
                label: 'public.amount',
                required: false,
                order: 2,
                value: '',
                columnCount: 6,
            }),
        },
    })
}


export const esalPaymentOptions = {
    singleInvoice: 'Single Invoice',
    multiInvoice: 'Multiple Invoice'
} as const;
