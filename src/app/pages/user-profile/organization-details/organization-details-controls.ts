import { EmptyControl } from "app/@core/model/dto/control/empty-control";
import { NumberInputControl } from "app/@core/model/dto/control/number-input-control";
import { PhoneControl } from "app/@core/model/dto/control/phone-control";
import { RadioGroupControl } from "app/@core/model/dto/control/radio-group-control";
import { TextInputControl } from "app/@core/model/dto/control/text-input-control";
import { TitleControl } from "app/@core/model/dto/control/title-control";
import { FormModel } from "app/@core/model/dto/formModel";
import { ValidationsEnum } from "app/@core/model/dto/validations-enum";
import { ButtonModel } from "arb-design-library/model/button.model";

export const getPageTitle = (): ButtonModel[] => {
    const buttons: ButtonModel[] = [];
    buttons.push({
        id: "relationShipManager",
        type: 'secondary',
        text: "organizationDetails.relationShipBtnText"
    });
    return buttons;
}

export function getOrganizationDetailsForm() {
    return new FormModel({
        id: 'OrganizationDetailsForm',
        controls: {
            titleControl: new TitleControl({
                order: 1,
                controlOptions: {
                    id: 'string',
                    type: 'Section',
                    title: "organizationDetails.orgFormTitle",
                },
                columnCount: 12,
            }),
            "profileNumber": new TextInputControl({
                label: 'organizationDetails.profileNumber',
                order: 2,
                value: "",
                columnCount: 4,
                disable: true,
                required: true,
                validators: [],
                validationLabels: { required: 'updateUserDetails.food-name-is-required' }
            }),
            "title": new TextInputControl({
                label: 'organizationDetails.orgFormTitleInputField',
                order: 3,
                value: "",
                columnCount: 4,
                disable: true,
                required: true,
                validators: [],
                validationLabels: { required: 'updateUserDetails.book-name-is-required' }
            }),
            "name": new TextInputControl({
                label: 'organizationDetails.name',
                order: 4,
                value: "",
                columnCount: 4,
                disable: true,
                required: true,
                validators: [],
                validationLabels: { required: 'updateUserDetails.mothers-name-is-required' }
            }),
            "address": new TextInputControl({
                label: 'organizationDetails.address',
                order: 5,
                value: "",
                columnCount: 4,
                disable: true,
                required: true,
                validators: [],
                validationLabels: { required: 'updateUserDetails.food-name-is-required' }
            }),
            "city": new TextInputControl({
                label: 'organizationDetails.city',
                order: 6,
                value: "",
                columnCount: 4,
                disable: true,
                required: true,
                validators: [],
                validationLabels: { required: 'updateUserDetails.book-name-is-required' }
            }),
            "zipCode": new TextInputControl({
                label: 'organizationDetails.zipCode',
                order: 7,
                value: "",
                columnCount: 4,
                disable: true,
                required: true,
                validators: [],
                validationLabels: { required: 'updateUserDetails.mothers-name-is-required' }
            }),
            "poBox": new TextInputControl({
                label: 'organizationDetails.PoBox',
                order: 8,
                value: "",
                columnCount: 4,
                disable: true,
                required: true,
                validators: [],
                validationLabels: { required: 'updateUserDetails.food-name-is-required' }
            }),
            "cityRegion": new TextInputControl({
                label: 'organizationDetails.cityRegion',
                order: 9,
                value: "",
                columnCount: 4,
                disable: true,
                required: true,
                validators: [],
                validationLabels: { required: 'updateUserDetails.book-name-is-required' }
            }),
            "coustomerType": new TextInputControl({
                label: 'organizationDetails.coustomerType',
                order: 10,
                value: "",
                columnCount: 4,
                disable: true,
                required: true,
                validators: [],
                validationLabels: { required: 'updateUserDetails.mothers-name-is-required' }
            }),
            "coustomerId": new TextInputControl({
                label: 'organizationDetails.coustomerId',
                order: 11,
                value: "",
                columnCount: 4,
                disable: true,
                required: true,
                validators: [],
                validationLabels: { required: 'updateUserDetails.mothers-name-is-required' }
            }),
            "issueDate": new TextInputControl({
                label: 'organizationDetails.issueDate',
                order: 12,
                value: "",
                columnCount: 4,
                disable: true,
                required: true,
                validators: [],
                validationLabels: { required: 'updateUserDetails.mothers-name-is-required' }
            }),
            "issuePlace": new TextInputControl({
                label: 'organizationDetails.issuePlace',
                order: 13,
                value: "",
                columnCount: 4,
                disable: true,
                required: true,
                validators: [],
                validationLabels: { required: 'updateUserDetails.mothers-name-is-required' }
            }),
            "country": new TextInputControl({
                label: 'organizationDetails.country',
                order: 14,
                value: "",
                columnCount: 4,
                disable: true,
                required: true,
                validators: [],
                validationLabels: { required: 'updateUserDetails.mothers-name-is-required' }
            }),
            "language": new TextInputControl({
                label: 'organizationDetails.language',
                order: 15,
                value: "",
                columnCount: 4,
                disable: true,
                required: true,
                validators: [],
                validationLabels: { required: 'updateUserDetails.mothers-name-is-required' }
            })
        }
    })
}

export function getContactDetailsForm() {
    return new FormModel({
        id: 'contactDetailsForm',
        controls: {
            title: new TitleControl({
                order: 1,
                controlOptions: {
                    id: 'string',
                    type: 'Section',
                    title: 'organizationDetails.contactDetailFormTitle',
                    subTitle:'organizationDetails.subTitle'
                },
                columnCount: 12,
                
            }),
            "receipt": new RadioGroupControl({
                columnCount: 12,
                required: true,
                value: 'mobile',
                order: 2,
                disable: true,
                controlOptions: {
                    options: [
                        {
                            id: "email",
                            title: 'public.email',
                        },
                        {
                            id: "mobile",
                            title: 'organizationDetails.mobile',
                        },
                        {
                            id: "phone",
                            title: 'organizationDetails.phone',
                        },
                        {
                            id: "fax",
                            title: 'organizationDetails.fax',
                        },
                        {
                            id: "workPhone",
                            title: 'organizationDetails.workPhone',
                        }
                    ],
                    textOnStart: false,
                }
            }),
            "emailControl": new TextInputControl({
                label: 'public.email',
                order: 3,
                value: "",
                columnCount: 4,
                required: true,
                disable: true,
                validators: [{ validation: ValidationsEnum.EMAIL }],
                validationLabels: { required: 'organizationDetails.email-required', pattern: 'organizationDetails.email-format' },
            }),
            "empty": new EmptyControl({
                order: 4,
                columnCount: 6,
            }),
            "mobileNumber": new PhoneControl({
                label: 'organizationDetails.mobileNumber',
                order: 5,
                columnCount: 4,
                required: true,
                disable: true,
                validators: [{ validation: ValidationsEnum.DIGIT_ONLY }, { validation: ValidationsEnum.MOBILE_NUMBER_WITH_05 }],
                controlOptions: {
                    phonePrefix: '+966'
                },
                validationLabels: {
                    required: "public.validations.required",
                    pattern: "organizationDetails.invalid-mobile-number"
                },
                value: ''
            }),
            "empty1": new EmptyControl({
                order: 6,
                columnCount: 6,
            }),
            "phoneNumber": new PhoneControl({
                label: 'organizationDetails.phoneNumber',
                order: 7,
                columnCount: 4,
                required: true,
                disable: true,
                validators: [{ validation: ValidationsEnum.DIGIT_ONLY }, { validation: ValidationsEnum.MAX_LENGTH, options: "7" }],
                controlOptions: {
                    phonePrefix: '01'
                },
                validationLabels: {
                    required: 'organizationDetails.phone-is-required',
                    maxLength: 'organizationDetails.field-max-length',
                    translateOptions: { "0": '7' },
                },
                value: ''
            }),
            "EXT-phone-number": new NumberInputControl({
                label: 'organizationDetails.EXT-phone-number',
                order: 8,
                columnCount: 4,
                required: true,
                disable: true,
                validators: [{ validation: ValidationsEnum.DIGIT_ONLY }, { validation: ValidationsEnum.MAX_LENGTH, options: "4" }],
                validationLabels: {
                    required: 'organizationDetails.ext-phone-is-required',
                    maxLength: 'organizationDetails.field-max-length',
                    translateOptions: { "0": '4' },
                },
                value: ''
            }),
            "empty2": new EmptyControl({
                order: 9,
                columnCount: 2,
            }),
            "faxNumber": new PhoneControl({
                label: 'organizationDetails.faxNumber',
                order: 10,
                columnCount: 4,
                required: true,
                disable: true,
                validators: [{ validation: ValidationsEnum.DIGIT_ONLY }, { validation: ValidationsEnum.MAX_LENGTH, options: "7" }],
                controlOptions: {
                    phonePrefix: '06'
                },
                validationLabels: {
                    required: 'organizationDetails.fax-is-required',
                    maxLength: 'organizationDetails.field-max-length',
                    translateOptions: { "0": '7' },
                },
                value: ''
            }),
            "EXT-fax-number": new NumberInputControl({
                label: 'organizationDetails.EXT-fax-number',
                order: 11,
                columnCount: 4,
                required: true,
                disable: true,
                validators: [{ validation: ValidationsEnum.DIGIT_ONLY }, { validation: ValidationsEnum.MAX_LENGTH, options: "4" }],
                validationLabels: {
                    required: 'organizationDetails.EXT-fax-number-is-required',
                    maxLength: 'organizationDetails.field-max-length',
                    translateOptions: { "0": '4' },
                },
                value: ''
            }),
            "empty3": new EmptyControl({
                order: 12,
                columnCount: 2,
            }),
            "work-phone-number": new PhoneControl({
                label: 'organizationDetails.work-phone-number',
                order: 13,
                columnCount: 4,
                required: true,
                disable: true,
                validators: [{ validation: ValidationsEnum.DIGIT_ONLY }, { validation: ValidationsEnum.MAX_LENGTH, options: "7" }],
                controlOptions: {
                    phonePrefix: '05'
                },
                validationLabels: {
                    required: 'organizationDetails.work-phone-number-is-required',
                    maxLength: 'organizationDetails.field-max-length',
                    translateOptions: { "0": '7' },
                },
                value: ''
            }),
            "EXT-work-phone-number": new NumberInputControl({
                label: 'organizationDetails.EXT-work-phone-number',
                order: 14,
                columnCount: 4,
                required: true,
                disable: true,
                validators: [{ validation: ValidationsEnum.DIGIT_ONLY }, { validation: ValidationsEnum.MAX_LENGTH, options: "4" }],
                validationLabels: {
                    required: 'help.mobile-is-required',
                    maxLength: 'organizationDetails.field-max-length',
                    translateOptions: { "0": '4' },
                },
                value: ''
            }),
        }
    })
}



