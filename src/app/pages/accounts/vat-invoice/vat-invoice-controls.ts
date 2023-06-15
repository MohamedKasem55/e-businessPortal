import {FormModel} from "../../../@core/model/dto/formModel";
import {DropdownControl} from "../../../@core/model/dto/control/dropdown-control";
import {ButtonModel} from "arb-design-library/model/button.model";

export const MONTHS_NAME: any[] = [
  {key: "01", value: 'january'},
  {key: "02", value: 'february'},
  {key: "03", value: 'march'},
  {key: "04", value: 'april'},
  {key: "05", value: 'may'},
  {key: "06", value: 'june'},
  {key: "07", value: 'july'},
  {key: "08", value: 'august'},
  {key: "09", value: 'september'},
  {key: "10", value: 'october'},
  {key: "11", value: 'november'},
  {key: "12", value: 'december'},
];
export const getVatInvoiceForm = (): FormModel => {
  return new FormModel({
    id: "vatInvoiceForm",
    controls: {
      month: new DropdownControl({
        label: 'public.month',
        required: true,
        order: 1,
        controlOptions: {columnId: "key", textField: 'value'},
        columnCount: 6,
        validationLabels: {required: 'accounts.vat-month-validation'}
      }),
      year: new DropdownControl({
        label: 'public.year',
        required: true,
        order: 2,
        controlOptions: {columnId: "key",textField: 'value',
          hasSearch: true,},
        columnCount: 6,
        validationLabels: {required: 'accounts.vat-year-validation'}
      }),

    }
  });
}
export const endButtons =(): ButtonModel[] =>{
  return [{
    id: "download",
    type: 'primary',
    prefixIcon: "arb-icon-arrowDownBox",
    text: "public.download"
  }
  ]
}
