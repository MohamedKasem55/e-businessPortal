import { ButtonControl } from "app/@core/model/dto/control/button-control";
import { DropdownControl } from "app/@core/model/dto/control/dropdown-control";
import { PhoneControl } from "app/@core/model/dto/control/phone-control";
import { TextControl } from "app/@core/model/dto/control/text-control";
import { TextInputControl } from "app/@core/model/dto/control/text-input-control";
import { TitleControl } from "app/@core/model/dto/control/title-control";
import { FormModel } from "app/@core/model/dto/formModel";
import { PopupInputModel } from "app/@core/model/dto/popup.model";
import { ValidationsEnum } from "app/@core/model/dto/validations-enum";

  export function askDetailsForm(): FormModel {
    return new FormModel({
      id: 'informationDetailsForm',
      controls: {
        "askAlRajhiDetail": new TitleControl({
          columnCount: 12,
          order: 1,
          controlOptions: {
            title: 'help.information-details',
            id: "",
          },
        }),
        "coustomerCIC": new TextInputControl({
          hidden: false,
          label: 'help.coustomer-cic',
          disable: true,
          required: true,
          order: 2,
          value: JSON.parse(<string>sessionStorage.getItem('company')).profileNumber,
          validators: [{
            validation: ValidationsEnum.MAX_LENGTH,
            options: "24"
          }, 
          { validation: ValidationsEnum.ACCOUNTNUMBER }
        ],
          validationLabels: {
            required: 'help.cic-number-is-required',
          },
          columnCount: 6,
        }),
         "CoustomerName": new TextInputControl({
          hidden: false,
          disable: true,
          label: 'help.CoustomerName',
          required: true,
          order: 3,
          value: JSON.parse(sessionStorage.getItem("user")!).userName,
          columnCount: 6,
          validationLabels: { required: 'help.CoustomerName-is-required' }
        }),
        "mobile": new PhoneControl({
            hidden: false,
            label: 'public.phone-number',
            required: true,
            order: 4,
            value: '',
            controlOptions: {phonePrefix:"+966"},
            validators: [{ validation: ValidationsEnum.MOBILE_NUMBER }],
            validationLabels: {
              required: 'help.mobile-is-required',
              maxLength: 'help.mobile-max-length',
              translateOptions: { "0": '9' },
              pattern: 'help.mobile-format'
            },
            columnCount: 6,
          }),
        "email": new TextInputControl({
          hidden: false,
          label: 'public.email',
          required: true,
          validators: [{ validation: ValidationsEnum.EMAIL }],
          validationLabels: { required: 'help.email-required', pattern: 'help.email-format' },
          order: 5,
          value: '',
          columnCount: 6,
        }),
        "service": new DropdownControl({
          label: 'help.service',
          hidden: false,
          required: true,
          order: 6,
          controlOptions: {columnId: "key", textField: 'value'},
          columnCount: 6,
          validationLabels: { required: 'help.service-name-required' }
        }),
        "problem": new DropdownControl({
          label: 'help.problem',
          hidden: false,
          required: true,
          order: 7,
          controlOptions: { columnId: "key", textField: 'value' },
          columnCount: 6,
          validationLabels: { required: 'help.problem-name-required' }
        }),
        "problemDescription": new TitleControl({
            columnCount: 12,
            order: 8,
            controlOptions: {
              title: 'help.problemDescription',
              id: "",
            },
          }),
          "description": new TextInputControl({
            hidden: false,
            label: 'Type Here',
            required: true,
            validators: [],
            validationLabels: { required: 'help.description-is-required' },
            order: 9,
            value: '',
            columnCount: 12,
          }),
      }
    });
  }
 
  export const getResultFormPopup = (): PopupInputModel => {
    return {
      image: 'assets/img/icon/check.svg',
      title:"help.question-sent",
      form: new FormModel({
        id: 'askResultPopUpForm',
        controls: {
          // ticketNumber: new TextControl({
          //   order: 1,
          //   columnCount: 12,
          //   class: 'color-arb-secondayText align-items-center',
          // }),
          contactMessage: new TextControl({
            order: 2,
            columnCount: 12,
            label:
              'help.contactMessage',
            class: 'col d-flex justify-content-center align-items-center',
          }),
          goToDashBoard: new ButtonControl({
            order: 3,
            columnCount: 12,
            controlOptions: {
              id: 'goToDashBoard',
              type: 'primary',
              text: 'help.goToDashBoard',
            },
            class: 'align-items-start',
          })
        },
      }),
    };
}

  
