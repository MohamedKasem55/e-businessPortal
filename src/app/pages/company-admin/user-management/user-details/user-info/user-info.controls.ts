import {TitleControl} from "../../../../../@core/model/dto/control/title-control";
import {FormModel} from "../../../../../@core/model/dto/formModel";
import {TextInputControl} from "../../../../../@core/model/dto/control/text-input-control";
import {DropdownControl} from "../../../../../@core/model/dto/control/dropdown-control";
import {RadioGroupControl} from "../../../../../@core/model/dto/control/radio-group-control";
import {UserDetailsRes} from "../../../../../@core/model/rest/company-admin/user-details/user-details-res";
import {NumberInputControl} from "../../../../../@core/model/dto/control/number-input-control";
import {CalenderType, DateControl} from "../../../../../@core/model/dto/control/date-control";
import {UploadControl} from "../../../../../@core/model/dto/control/upload-control";
import {PhoneControl} from "../../../../../@core/model/dto/control/phone-control";
import {ValidationsEnum} from "../../../../../@core/model/dto/validations-enum";
import {KeyValueModel} from "../../../../../@core/model/rest/common/key-value.model";
import {DatePipe} from "@angular/common";
import {SelectionControl} from "../../../../../@core/model/dto/control/selection-control";
import {EmptyControl} from "../../../../../@core/model/dto/control/empty-control";
import {ExecutionType} from "../user-main/user-main.controls";
import {
  CompanyWorkflowTypeEnum
} from "../../../../../@core/model/rest/company-admin/workflow/company-workflow-type-enum";
import {DividerControl} from "../../../../../@core/model/dto/control/divider-control";
import {Utils} from "../../../../../@core/utility/Utils";


export const getUserInfoForm =
  (dataInfo: UserDetailsRes | null,
   languagesKeyValue: KeyValueModel[],
   countriesKeyValue: KeyValueModel[],
   datePipe: DatePipe,
   editMode: ExecutionType,
   workFlowType: CompanyWorkflowTypeEnum,
   userType?: any
  ) => {
    let form = new FormModel({
      id: 'userInfoForm',
      controls: {}
    })
    if (workFlowType === CompanyWorkflowTypeEnum.MAKER_CHECKER) {
      form.controls = {
        userTypeTitle: new TitleControl({
          columnCount: 12,
          order: 1,
          controlOptions: {
            id: "userType",
            title: 'company-admin.user-info.user-type'
          }
        }),
        maker: new SelectionControl({
          order: 1,
          value: dataInfo?.companyUserDetails!.maker || false,
          controlOptions: {
            title: "company-admin.user-info.maker",
            type: "checkbox",
          },
        }),
        checker: new SelectionControl({
          order: 1,
          value: dataInfo?.companyUserDetails!.checker || false,
          controlOptions: {
            title: "company-admin.user-info.checker",
            type: "checkbox",
          }
        }),
        dividerUserType: new DividerControl({
          order: 1,
          columnCount: 12,
        })
      }
    }
    form.controls = {
      ...form.controls,
      personalInfo: new TitleControl({
        columnCount: 12,
        order: 1,
        controlOptions: {
          id: "personalInfoId",
          title: 'company-admin.user-info.personalInfo'
        }
      }),
      name: new TextInputControl({
        label: 'company-admin.user-info.name',
        order: 2,
        required: true,
        validationLabels: {
          required: "public.validations.required"
        },
        columnCount: 4,
        value: dataInfo?.companyUserDetails.userName || "",
      }),
      arabicName: new TextInputControl({
        label: 'company-admin.user-info.userNameArabic',
        order: 3,
        columnCount: 4,
        value: dataInfo?.companyUserDetails.userNameArabic || '',
        validators: [{validation: ValidationsEnum.ONLY_ARABIC_LETTERS}],
        validationLabels: {
          pattern: "public.validations.invalid-format"
        }
      }),
      nickName: new TextInputControl({
        label: 'company-admin.user-info.nickname',
        order: 4,
        columnCount: 4,

        value: dataInfo?.companyUserDetails.nickname || ''
      }),
      loginId: new TextInputControl({
        label: 'company-admin.user-info.loginId',
        order: 5,
        columnCount: 4,
        required: true,
        validationLabels: {
          required: "public.validations.required"
        },
        value: dataInfo?.companyUserDetails.userId || "",
        disable: (editMode !== ExecutionType.ADD)
      }),
      empCompID: new NumberInputControl({
        label: 'company-admin.user-info.EmpCompID',
        order: 6,
        columnCount: 4,
        required: true,
        value: dataInfo?.companyUserDetails.empRef || '',
        validationLabels: {
          required: "public.validations.required"
        },
      }),
      userType: new TextInputControl({
        label: 'company-admin.user-info.userType',
        order: 7,
        columnCount: 4,
        value: userType[dataInfo?.companyUserDetails.type!] || '',
        hidden: (editMode === ExecutionType.ADD),
        disable: true,
      }),
      natIDNum: new NumberInputControl({
        label: 'company-admin.user-info.nationalIDNum',
        order: 8,
        columnCount: 4,
        required: true,
        validators: [{validation: ValidationsEnum.NATIONALID}],
        value: dataInfo?.companyUserDetails.idIqama || '',
        validationLabels: {
          required: "public.validations.required",
          pattern: "public.validations.invalid-format"
        },
      }),
      natIDExpiry: new DateControl({
        label: 'company-admin.user-info.nationalIdExpiry',
        order: 9,
        columnCount: 4,
        value: (dataInfo?.companyUserDetails.idExpireDate) ? {
          day: parseInt(<string>datePipe.transform(dataInfo?.companyUserDetails.idExpireDate, "dd")),
          month: parseInt(<string>datePipe.transform(dataInfo?.companyUserDetails.idExpireDate, "mm")),
          year: parseInt(<string>datePipe.transform(dataInfo?.companyUserDetails.idExpireDate, "yyyy"))
        } : null,
        controlOptions: {
          displayPattern: "dd/MM/yyyy",
          type: CalenderType.GREGORIAN,
        },
      }),
      department: new TextInputControl({
        label: 'company-admin.user-info.department',
        order: 10,
        columnCount: 4,
        value: dataInfo?.companyUserDetails.department || ''
      }),
      city: new TextInputControl({
        label: 'company-admin.user-info.city',
        order: 11,
        columnCount: 4,
        required: true,
        validators: [{validation: ValidationsEnum.ONLY_ALPHABETIC},{validation: ValidationsEnum.NO_SPECIAL_CHAR}],
        value: dataInfo?.companyUserDetails.city || '',
        validationLabels: {
          required: "public.validations.required",
          pattern: "public.validations.invalid-format"
        },
      }),
      reigon: new TextInputControl({
        label: 'company-admin.user-info.region',
        order: 12,
        columnCount: 4,
        required: true,
        validators: [{validation: ValidationsEnum.ONLY_ALPHABETIC},{validation: ValidationsEnum.NO_SPECIAL_CHAR}],
        value: dataInfo?.companyUserDetails.region || '',
        validationLabels: {
          required: "public.validations.required",
          pattern: "public.validations.invalid-format"
        },
      }),
      birthdate: new DateControl({
        label: 'company-admin.user-info.birthdate',
        order: 13,
        columnCount: 4,
        value: (dataInfo?.companyUserDetails.idExpireDate) ? {
          day: parseInt(<string>datePipe.transform(dataInfo?.companyUserDetails.birthDate, "dd")),
          month: parseInt(<string>datePipe.transform(dataInfo?.companyUserDetails.birthDate, "mm")),
          year: parseInt(<string>datePipe.transform(dataInfo?.companyUserDetails.birthDate, "yyyy"))
        } : null,
        controlOptions: {
          minDate: {
            day: 1,
            month: 1,
            year: 1900
          },
          maxDate: {
            day: Utils.getToday().day,
            month: Utils.getToday().month+1,
            year: Utils.getToday().year
          },
          displayPattern: "dd/MM/yyyy",
          type: CalenderType.GREGORIAN,
        },
      }),
      nationality: new DropdownControl({
        label: 'company-admin.user-info.nationality',
        order: 14,
        columnCount: 4,
        controlOptions: {
          options: countriesKeyValue,
          textField: "value",
          columnId: "key"
        },
        value: {
          key: dataInfo?.companyUserDetails.nationality || ''
        }
      }),
      passport: new TextInputControl({
        label: 'company-admin.user-info.passport',
        order: 15,
        columnCount: 4,
        value: dataInfo?.companyUserDetails.passport || ''
      }),
      language: new DropdownControl({
        label: 'company-admin.user-info.lang',
        order: 7, columnCount: 4,
        controlOptions: {
          options: languagesKeyValue,
          textField: "value",
          columnId: "key"
        },
        value: {key: dataInfo?.companyUserDetails.preferedLanguage || ''}
      }),
      image: new UploadControl({
        label: 'company-admin.user-info.image',
        order: 16,
        columnCount: 4,
        value: "",
        controlOptions: {
          acceptedTypes: ["image/*"]
        }
      }),
      status: new TextInputControl({
        label: 'company-admin.user-info.status',
        order: 17,
        disable: true,
        columnCount: 4,
        value: dataInfo?.companyUserDetails.status || '',
        hidden: (editMode === ExecutionType.ADD),

      }),
      contactInfo: new TitleControl({
        columnCount: 12,
        order: 18,
        controlOptions: {
          id: "contactInfoId",
          title: 'company-admin.user-info.contactInfo'
        }
      }),
      phoneNum: new PhoneControl({
        label: 'company-admin.user-info.phoneNumber',
        order: 19,
        columnCount: 4,
        required: true,
        validators: [{validation: ValidationsEnum.MOBILE_NUMBER_WITH_05}],
        validationLabels: {
          required: "public.validations.required",
          pattern: "public.validations.invalid-mobile-number"
        },
        value: dataInfo?.companyUserDetails.mobile || ''
      }),
      secondPhoneNum: new PhoneControl({
        label: 'company-admin.user-info.secondMobNum',
        order: 20,
        validators: [{validation: ValidationsEnum.MOBILE_NUMBER_WITH_05}],
        validationLabels: {
          pattern: "public.validations.invalid-mobile-number"
        },
        columnCount: 4,
        value: dataInfo?.companyUserDetails.secondMobile || ''
      }),
      email: new TextInputControl({
        label: 'company-admin.user-info.email',
        order: 21,
        columnCount: 4,
        required: true,
        value: dataInfo?.companyUserDetails.email || '',
        validators: [{validation: ValidationsEnum.EMAIL}],
        validationLabels: {
          pattern: "public.validations.invalid-format",
          required: "public.validations.required"
        },
      }),
      secEmail: new TextInputControl({
        label: 'company-admin.user-info.secEmail',
        order: 22,
        columnCount: 4,
        value: dataInfo?.companyUserDetails.secondEmail || '',
        validators: [{validation: ValidationsEnum.EMAIL}],
        validationLabels: {
          pattern: "public.validations.invalid-format"
        }
      }),

      facebook: new TextInputControl({
        label: 'company-admin.user-info.facebook',
        order: 23,
        columnCount: 4,
        value: dataInfo?.companyUserDetails.socialFacebook || ''
      }),
      instagram: new TextInputControl({
        label: 'company-admin.user-info.instagram',
        order: 24,
        columnCount: 4,
        value: dataInfo?.companyUserDetails.socialInstagram || ''

      }),
      twitter: new TextInputControl({
        label: 'company-admin.user-info.twitter',
        order: 25,
        columnCount: 4,
        value: dataInfo?.companyUserDetails.socialTwitter || ''

      }),
      linkedIn: new TextInputControl({
        label: 'company-admin.user-info.linkedIn',
        order: 26,
        columnCount: 4,
        value: dataInfo?.companyUserDetails.socialLinkedin || ''
      }),
      empty: new EmptyControl({order: 27, columnCount: 4}),

      accessTime: new SelectionControl({
        columnCount: 3,
        order: 27,
        value: dataInfo?.companyUserDetails.accessLimited || '',
        controlOptions:
          {
            type: "toggle",
            title: 'company-admin.user-info.accessTime',
            textOnStart: true
          }
      }),
      empty1: new EmptyControl({order: 27, columnCount: 9}),

      fromTime: new DropdownControl({
        label: 'company-admin.user-info.fromTime',
        order: 28,
        columnCount: 4,
        disable: !(editMode === ExecutionType.EDIT && dataInfo?.companyUserDetails.accessLimited),
        hidden: !dataInfo?.companyUserDetails.accessLimited,
        value: (dataInfo?.companyUserDetails.accessFrom) ? {
          key: dataInfo?.companyUserDetails.accessFrom,
          value: dataInfo?.companyUserDetails.accessFrom
        } : '',
        validationLabels: {
          required: "public.validations.required"
        },
        controlOptions: {
          columnId: "key",
          textField: "value",
          options: timeArray()
        },
      }),
      toTime: new DropdownControl({
        label: 'company-admin.user-info.toTime',
        order: 29,
        columnCount: 4,
        disable: !(editMode === ExecutionType.EDIT && dataInfo?.companyUserDetails.accessLimited),
        hidden: !dataInfo?.companyUserDetails.accessLimited,
        value: (dataInfo?.companyUserDetails.accessTo) ? {
          key: dataInfo?.companyUserDetails.accessTo,
          value: dataInfo?.companyUserDetails.accessTo
        } : '',
        validationLabels: {
          required: "public.validations.required"
        },
        controlOptions: {
          columnId: "key",
          textField: "value",
          options: timeArray()
        },
      }),
      days: new DropdownControl({
        label: 'company-admin.user-info.days',
        order: 30,
        columnCount: 4,
        value: (dataInfo?.companyUserDetails.daysOfWeek) ?
          getDaysFromCompanyUserDetails(dataInfo?.companyUserDetails.daysOfWeek) : '',
        disable: !(editMode === ExecutionType.EDIT && dataInfo?.companyUserDetails.accessLimited),
        hidden: !dataInfo?.companyUserDetails.accessLimited,
        controlOptions: {
          isCheckboxList: true,
          columnId: "key",
          textField: "value",
          options: getDays()
        },
        validationLabels: {
          required: "public.validations.required"
        },
      }),

      securityMethodTitle: new TitleControl({
        columnCount: 12,
        order: 31,
        controlOptions:
          {
            id: "securityMethodId",
            title: 'company-admin.user-info.securityMethod'
          }
      }),
      securityMethod: new RadioGroupControl({
        validationLabels: {
          required: "public.validations.required"
        },
        order: 32,
        value: dataInfo?.companyUserDetails.authenticationMethod || '',
        required: true,
        columnCount: 12,
        controlOptions: {
          options: [],
          textOnStart: false
        }
      }),
      tokens: new DropdownControl({
        label: 'company-admin.user-info.token',
        order: 33,
        columnCount: 4,
        hidden: true,
        controlOptions: {
          columnId: "key",
          textField: "value",
          options: []
        },
        required: true,
        disable: true,
        validationLabels: {
          required: "public.validations.required"
        },
      }),
      tokenLang: new DropdownControl({
        label: 'company-admin.user-info.lang',
        order: 33,
        columnCount: 4,
        hidden: true,
        disable: true,
        controlOptions: {
          columnId: "key",
          textField: "value",
          options: [{key: "1", value: "public.arabic"}, {key: "2", value: "public.english"}]
        },
        required: true,
        validationLabels: {
          required: "public.validations.required"
        },
      }),
      passwordDelivery: new DropdownControl({
        label: 'company-admin.user-info.pwdDelivery',
        hidden: true,
        order: 33,
        columnCount: 4,
        controlOptions: {
          columnId: "key",
          textField: "value",
          options: [{key: "SMS", value: "company-admin.user-info.sms"}, {
            key: "EMAIL",
            value: "company-admin.user-info.email"
          }]
        },
        required: true,
        disable: true,
        validationLabels: {
          required: "public.validations.required"
        },
      }),
    };
    return form;
  }

export const getObjectConfigMap = (): [string, string][] => {
  return [
    ['name', 'userName'],
    ['arabicName', 'userNameArabic'],
    ['nickName', 'nickname'],
    ['loginId', 'userId'],
    ['empCompID', 'empRef'],
    ['natIDNum', 'idIqama'],
    ['maker', 'maker'],
    ['checker', 'checker'],
    ['natIDExpiry', 'idExpireDate'],
    ['department', 'department'],
    ['city', 'city'],
    ['reigon', 'region'],
    ['birthdate', 'birthDate'],
    ['nationality', 'nationality'],
    ['passport', 'passport'],
    ['language', 'preferedLanguage'],
    ['status', 'status'],
    ['phoneNum', 'mobile'],
    ['secondPhoneNum', 'secondMobile'],
    ['email', 'email'],
    ['secEmail', 'secondEmail'],
    ['facebook', 'socialFacebook'],
    ['instagram', 'socialInstagram'],
    ['twitter', 'socialLinkedin'],
    ['linkedIn', 'socialTwitter'],
    ['accessTime', 'accessLimited'],
    ['fromTime', 'accessFrom'],
    ['toTime', 'accessTo'],
    ['days', 'daysOfWeek'],
    ['securityMethod', 'authenticationMethod'],
    ['passwordDelivery', 'passDelivery'],
    ['tokenLang', 'tokenLanguage'],
    ['tokens', 'tokenSerial']];
}


export const getDays = (): KeyValueModel[] => {
  let days = []
  for (let day = 1; day <= 7; day++) {
    let model: KeyValueModel = {
      key: day.toString(),
      value: 'public.day.' + day
    }
    days.push(model)
  }
  return days;
}


export const timeArray = (): KeyValueModel[] => {
  let timeArray: KeyValueModel[] = []
  for (let x = 0; x < 24; x++) {
    let timeValue = '';
    let timeKey = ''
    if (x < 10) {
      timeValue = '0' + x + ':00'
      timeKey = '0' + x + ':00:00'
    } else {
      if (x == 23) {
        timeValue = x + ':59'
        timeKey = x + ':59:00'
      } else {
        timeValue = x + ':00'
        timeKey = x + ':00:00'
      }
    }
    timeArray.push({key: timeKey, value: timeValue})
  }
  return timeArray;
}
export const getDaysFromCompanyUserDetails = (daysOfWeek: any): KeyValueModel[] => {
  let values: KeyValueModel[] = [];
  for (let day of daysOfWeek) {
    values.push({
      key: day.dayValue,
      value: ""
    })
  }
  return values
}
