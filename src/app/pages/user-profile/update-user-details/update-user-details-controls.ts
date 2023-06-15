import { AbstractControl, ValidationErrors } from "@angular/forms";
import { DropdownControl } from "app/@core/model/dto/control/dropdown-control";
import { PhoneControl } from "app/@core/model/dto/control/phone-control";
import { TextInputControl } from "app/@core/model/dto/control/text-input-control";
import { UploadControl } from "app/@core/model/dto/control/upload-control";
import { FormModel } from "app/@core/model/dto/formModel";
import { ValidationsEnum } from "app/@core/model/dto/validations-enum";
import { TabModel } from "arb-design-library/model/tab.model";

export const geUserUpdateDetailsTabs = () => {
  const updateUserDetailsTabs: TabModel[] = [];
  updateUserDetailsTabs.push(
    {
      text: 'updateUserDetails.userUpdate',
      value: 'userUpdate'
    },
    {
      text: 'updateUserDetails.updateResetPasswordQuestion',
      value: 'updateResetPasswordQuestion'
    });

  return updateUserDetailsTabs;
}

export function getupdateUserDetailsForm() {
  return new FormModel({
    id: 'userUpdateForm',
    controls: {
      "emailControl": new TextInputControl({
        label: 'public.email',
        order: 1,
        value: "",
        columnCount: 3,
        required:true,
        disable: true,
        validators: [{validation: ValidationsEnum.EMAIL}],
        validationLabels: {required: 'transfer.email-required', pattern: 'transfer.email-format'},
      }),
      "confirmEmailControl": new TextInputControl({
        label: 'updateUserDetails.confirEmail',
        order: 2,
        value: "",
        columnCount: 3,
        required:true,
        disable: true,
        validators: [{validation: ValidationsEnum.EMAIL}],
        validationLabels: {required: 'transfer.email-required', pattern: 'transfer.email-format'},
      }),
      language: new DropdownControl({
        label: 'updateUserDetails.language',
        order: 3,
        columnCount: 3,
        controlOptions: {
          textField: "value",
          columnId: "key"
        },
        value:'',
        required:true,
        disable: true,
        validationLabels: {required: 'updateUserDetails.language-required'},
      }),
      image: new UploadControl({
        label: 'updateUserDetails.upload',
        order: 4,
        columnCount: 3,
        value: "",
        controlOptions: {
          acceptedTypes: ['.png', '.jpg'],
        },
        required:false,
        disable: false,
        hidden:true
      })
    }
  })
}

export function getResetPasswordQuestionsForm() {
  return new FormModel({
    id: 'resetPasswordQuestionForm',
    controls: {
      "foodControl": new TextInputControl({
        label: 'updateUserDetails.foodControl',
        order: 1,
        value: "",
        columnCount: 6,
        disable: false,
        required: true,
        validators: [],
        validationLabels: {required: 'updateUserDetails.food-name-is-required'}
      }),
      "bookControl": new TextInputControl({
        label: 'updateUserDetails.bookControl',
        order: 2,
        value: "",
        columnCount: 6,
        disable: false,
        required: true,
        validators: [],
        validationLabels: {required: 'updateUserDetails.book-name-is-required'}
      }),
      "mothersMaidenName": new TextInputControl({
        label: 'updateUserDetails.mothersMaidenName',
        order: 3,
        value: "",
        columnCount: 6,
        disable: false,
        required: true,
        validators: [],
        validationLabels: {required: 'updateUserDetails.mothers-name-is-required'}
      }),
      "mobileNumber": new PhoneControl({
        label: 'updateUserDetails.mobileNumberLabel',
        order: 4,
        columnCount: 6,
        required: true,
        validators: [{validation: ValidationsEnum.DIGIT_ONLY},{validation: ValidationsEnum.MOBILE_NUMBER}],
          controlOptions:{
            phonePrefix:'+966'
          },
          validationLabels: {
            required: "public.validations.required",
            pattern: "public.validations.invalid-mobile-number"
          },
        value: ''
      })
    },formValidator:[{
      validatorFunc: (controls: AbstractControl): ValidationErrors | null => {
        const food = controls.get('foodControl')?.value;
        const book = controls.get('bookControl')?.value;
        const motherName = controls.get('mothersMaidenName')?.value;
        const mobile = controls.get('mobileNumber')?.value;
        const hasDuplicates = new Set([food, book, motherName,mobile]).size < 4;
        if (hasDuplicates) {
            return { invalidConfirmation: "invalidConfirmation" }
        } else {
            return null;
        }
    },
    errorName: 'invalidConfirmation',
    errorMessage: 'updateUserDetails.pwdQuestionValidation'
    }]
  })
}

