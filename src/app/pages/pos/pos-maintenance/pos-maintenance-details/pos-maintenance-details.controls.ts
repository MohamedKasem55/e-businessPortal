import {AccountControl, AccountControlOptions} from "app/@core/model/dto/control/account-control";
import {DropdownControl, DropdownControlOptions} from "app/@core/model/dto/control/dropdown-control";
import {TextInputControl, TextInputControlOptions} from "app/@core/model/dto/control/text-input-control";
import {TitleControl} from "app/@core/model/dto/control/title-control";
import {FormModel} from "app/@core/model/dto/formModel";
import {ValidationsEnum} from "app/@core/model/dto/validations-enum";
import {PillControl} from "../../../../@core/model/dto/control/pill-control";

export function selectTerminalForm() {
  return new FormModel({
    id: 'newRequestForm',
    controls: {
      "selectedTerminalTitle": new TitleControl({
        columnCount: 12,
        order: 1,
        controlOptions: {
          id: "",
          title: 'pos.maintenance.selected-terminal',
          type: 'Section',
        },
      }),
      "pillTitle": new PillControl({
        columnCount: 12,
        order: 2,
        controlOptions: {
          type: "Neutral",
          text: ""
        }
      }),
      "requestDetailsTitle": new TitleControl({
        columnCount: 12,
        order: 3,
        controlOptions: {
          id: "",
          title: 'pos.maintenance.request-details',
          type: 'Section'
        },
      }),
      toAccountControl: new AccountControl({
        label: 'public.account-number',
        required: false,
        order: 4,
        value: null,
        columnCount: 6,
        validationLabels: {required: 'transfer.account-is-required'},
        hidden: true
      }),
      requestTypeControl: new DropdownControl({
        label: 'public.request-type',
        hidden: false,
        required: true,
        order: 5,
        controlOptions: {textField: 'value', columnId: 'key'},
        columnCount: 6,
        validationLabels: {
          required: 'pos.new-request.errors.request-type-required',
        },
      }),
      cityControl: new DropdownControl({
          label: 'public.city',
          hidden: false,
          required: true,
          order: 6,
          controlOptions: {textField: 'value', columnId: 'key'},
          columnCount: 6,
          validationLabels: {required: 'pos.new-request.errors.city-required'},
        }
      ),
      contactNameControl: new TextInputControl({
        label: 'public.contact-name',
        hidden: false,
        required: true,
        value: '',
        order: 7,
        columnCount: 6,
        validationLabels: {
          required: 'pos.new-request.errors.contact-name-required',
        },
      }),
      phoneNumberControl: new TextInputControl({
        label: 'public.phone-number',
        hidden: false,
        required: true,
        value: '',
        order: 8,
        columnCount: 6,
        validators: [{validation: ValidationsEnum.MOBILE_NUMBER_WITH_05}],
        validationLabels: {
          required: 'pos.new-request.errors.phone-number-required',
          pattern: 'pos.new-request.errors.phone-number-invalid'
        },
      })
    },
  });
}

