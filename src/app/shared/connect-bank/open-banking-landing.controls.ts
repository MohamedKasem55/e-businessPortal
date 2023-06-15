import { ButtonControl } from "app/@core/model/dto/control/button-control";
import { DropdownControl } from "app/@core/model/dto/control/dropdown-control";
import { EmptyControl } from "app/@core/model/dto/control/empty-control";
import { TextControl } from "app/@core/model/dto/control/text-control";
import { FormModel } from "app/@core/model/dto/formModel";
import {  financialInstitutionOption } from "app/pages/accounts/BFM/bfm-dashboard/bfm-dashboard-controls";

export function connectBankForm(financialInstitutions:Array<financialInstitutionOption>): FormModel {
    return new FormModel({
        id: "connectBankForm",
        controls: {
            title: new TextControl({
                label: "Connect Bank Account",
                order: 1,
                columnCount: 12,
                class: "text-center font-h2-bold justify-content-center"
            }),
            subTitle: new TextControl({
                label: "Select one of the supported banks to request your BFM information",
                order: 2,
                columnCount: 12,
                class: "text-center text-muted justify-content-center"
            }),
            empty1: new EmptyControl({columnCount:2,order:3}),
            dropDown: new DropdownControl({
                label: 'Select a Bank',
                order: 3,
                controlOptions: {
                    columnId: "key", textField: 'value',
                    imageField: 'image',
                    options:financialInstitutions 
                },
                columnCount: 8,
                validationLabels: {},
                class: "text-center font-secondary justify-content-center",
            }),
            empty2: new EmptyControl({columnCount:2,order:3}),
            empty3: new EmptyControl({columnCount:2,order:4}),
            cancel:new ButtonControl({
                order:4,
                columnCount:4,
                controlOptions: {
                    id: "cancel",
                    type: 'secondary',
                    text: "Cancel"
                  }
            }),
            next:new ButtonControl({
                order:4,
                columnCount:4,
                controlOptions: {
                    isDisable:true,
                    id: "next",
                    type: 'primary',
                    text: "Next"
                }
            }),
            empty4: new EmptyControl({columnCount:2,order:4}),
            
        }
    })
}
