import { ImageControl } from "app/@core/model/dto/control/image-control";
import { SummaryItemControl } from "app/@core/model/dto/control/sumery-item-control";
import { TextControl } from "app/@core/model/dto/control/text-control";
import { TitleControl } from "app/@core/model/dto/control/title-control";
import { FormModel } from "app/@core/model/dto/formModel";
export function getreviewControls(bankInfo:BankInfo) {
    return [[section1(bankInfo)],[section2(bankInfo)]]
}
export function section1(bankInfo:BankInfo){
    return new FormModel({
        id:"section1",
        controls:{
            title:new TitleControl({
                order:1,
                controlOptions:{
                    id:"title",
                    showArrow:true,
                    title:"Review",
                    type:"Page"
                }
            }),
            bankImage: new ImageControl({
                columnCount:12,
                order:2,
                controlOptions: { 
                    class: "mx-auto w-auto h-auto",
                    src: bankInfo.imageSrc
                }
            }),
           bankTitle: new TextControl({
                columnCount: 12,
                order: 2,
                label:  'Alinma Bank',
                class: "justify-content-center font-h1-bold",
            }),
            bankDescription: new TextControl({
                columnCount: 12,
                order: 2,
                label:  bankInfo.description,
                class: "color-arb-tertiaryText  font-h4-light justify-content-center mb-2",
            }),
            detailsTitle: new TitleControl({
                order:3,
                columnCount:12,
                controlOptions:{
                    id:"detailsTitle",
                    title:"You are sharing the following :"
                }
            }),
        }
    })
}
export function section2(bankInfo:BankInfo){
    return new FormModel({
        id:"section2",
        controls:{
            connectionPeriod: new TitleControl({
                order:4,
                columnCount:12,
                controlOptions:{
                    id:"connectionPeriod",
                    title:"Connection Period"
                }
            }),
            startDate: new SummaryItemControl({
                columnCount: 6,
                order: 5,
                label: 'Start Date',
                value: '16-09-2022',
            }),
            endDate: new SummaryItemControl({
                columnCount: 6,
                order: 5,
                label: 'End Date',
                value: '16-09-2022',
            }),
        }
    })
}
 interface BankInfo{
    id?:string,
    name:string,
    description:string,
    imageSrc:string
}