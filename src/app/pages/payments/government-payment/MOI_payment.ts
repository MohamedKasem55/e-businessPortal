import { ValidationsEnum } from 'app/@core/model/dto/validations-enum'
export const MOI_PAYMENTS_FORMS_FIELDS_CONFIGS: any = {
  //-------------------------------------------------------------------
  '095': {
    key: '095',
    apiKey: 'Visa',
    title: 'Visa',
    applicationsTypes: {
      //-------------------------------------------
      '038': {
        key: '038',
        title: 'Family Visa',
        controls: [
          {
            key: 'sponsorId',
            title: 'Sponsor Id',
            label: 'payments.government.visaServices.sponsorId',
            required: true,
            hidden: false, isDisable: false,
            value: '',
            validators: [
              { validation: ValidationsEnum.MIN_LENGTH, options: "10" },
              { validation: ValidationsEnum.MAX_LENGTH, options: "10" },
              { validation: ValidationsEnum.DIGIT_ONLY },
            ],
            validationLabels: { required: 'payments.government.validations.sponsor-id-is-required' },
          },
          {
            key: 'numberOfVisas',
            title: 'Number of Visas',
            label: 'payments.government.visaServices.numberOfVisas',
            type: 'number',
            required: true,
            value: '',
            validators: [],
            validationLabels: { required: 'payments.government.validations.numberOfVisas' },
          },
        ],
      },
      //-------------------------------------------
      '039': {
        key: '039',
        title: 'Labor Visa',
        controls: [
          {
            key: 'sponsorId',
            title: 'Sponsor Id',
            label: 'payments.government.visaServices.sponsorId',
            required: true,
            value: '',
            validators: [
              { validation: ValidationsEnum.MIN_LENGTH, options: "10" },
              { validation: ValidationsEnum.MAX_LENGTH, options: "10" },
              { validation: ValidationsEnum.DIGIT_ONLY },
            ],
            validationLabels: { required: 'payments.government.validations.sponsor-id-is-required' },
          },
          {
            key: 'numberOfVisas',
            title: 'Number of Visas',
            label: 'payments.government.visaServices.numberOfVisas',
            type: 'number',
            required: true,
            value: '',
            validators: [],
            validationLabels: { required: 'payments.government.validations.numberOfVisas' },

          },
          {
            key: 'visaType',
            title: 'Visa Type',
            label: 'payments.government.visaServices.visaType',
            type: 'select',
            required: true,
            value: '',
            validators: [],
            validationLabels: { required: 'payments.government.validations.visaType' },

            select_combo_key: 'eGovVisaTypes',
          },
        ],
      },
      //-------------------------------------------
    },
  },
  //-------------------------------------------------------------------
  '092': {
    key: '092',
    apiKey: 'SaudiPassport',
    title: 'Saudi Passport',
    applicationsTypes: {
      //-------------------------------------------
      '035': {
        key: '035',
        title: 'Issue New Passport',
        controls: [
          {
            key: 'citizenId',
            title: 'Citizen Id',
            label: 'payments.government.saudiPassportServices.citizenId',
            required: true,
            isDisable: false,
            value: '',
            validators: [
              { validation: ValidationsEnum.MIN_LENGTH, options: "10" },
              { validation: ValidationsEnum.MAX_LENGTH, options: "10" },
              { validation: ValidationsEnum.DIGIT_ONLY },
            ],
            validationLabels: { required: 'payments.government.validations.citizenId' },

          },
          {
            key: 'passportType',
            title: 'Passport Type',
            label: 'payments.government.saudiPassportServices.passportType',
            type: 'select',
            required: true,
            value: '',
            validators: [],
            validationLabels: { required: 'payments.government.validations.passportType' },

            select_combo_key: 'eGovPassportTypes',

          },
          {
            key: 'passportDuration',
            title: 'Passport Duration',
            label: 'payments.government.saudiPassportServices.passportDuration',
            type: 'select',
            required: true,
            value: '',
            validators: [],
            validationLabels: { required: 'payments.government.validations.passportDuration' },

            select_combo_key: 'eGovSadadPassportDuration',

          },
        ],
      },
      //-------------------------------------------
      '036': {
        key: '036',
        title: 'Re-issue Passport',
        controls: [
          {
            key: 'citizenId',
            title: 'Citizen Id',
            label: 'payments.government.saudiPassportServices.citizenId',
            required: true,
            isDisable: false,
            value: '',
            validators: [
              { validation: ValidationsEnum.MIN_LENGTH, options: "10" },
              { validation: ValidationsEnum.MAX_LENGTH, options: "10" },
              { validation: ValidationsEnum.DIGIT_ONLY },
            ],
            validationLabels: { required: 'payments.government.validations.citizenId' },
          },
          {
            key: 'passportType',
            title: 'Passport Type',
            label: 'payments.government.saudiPassportServices.passportType',
            type: 'select',
            required: true,
            value: '',
            validators: [],
            validationLabels: { required: 'payments.government.validations.passportType' },

            select_combo_key: 'eGovPassportTypes',

          },
          {
            key: 'passportDuration',
            title: 'Passport Duration',
            label: 'payments.government.saudiPassportServices.passportDuration',
            hidden: true,
            isDisable: false,
            required: false,
            value: '0000000000',
            validators: []
          },
        ],
      },
      //-------------------------------------------
      '037': {
        key: '037',
        title: 'Renew Passport',
        controls: [
          {
            key: 'citizenId',
            title: 'Citizen Id',
            label: 'payments.government.saudiPassportServices.citizenId',
            required: true,
            value: '',
            validators: [
              { validation: ValidationsEnum.MIN_LENGTH, options: "10" },
              { validation: ValidationsEnum.MAX_LENGTH, options: "10" },
              { validation: ValidationsEnum.DIGIT_ONLY },
            ],
            validationLabels: { required: 'payments.government.validations.citizenId' },

          },
          {
            key: 'passportType',
            title: 'Passport Type',
            label: 'payments.government.saudiPassportServices.passportType',
            type: 'select',
            required: true,
            value: '',
            validators: [],
            validationLabels: { required: 'payments.government.validations.passportType' },

            select_combo_key: 'eGovPassportTypes',

          },
          {
            key: 'passportDuration',
            title: 'Passport Duration',
            label: 'payments.government.saudiPassportServices.passportDuration',
            type: 'select',
            required: true,
            value: '',
            validators: [],
            validationLabels: { required: 'payments.government.validations.passportDuration' },

            select_combo_key: 'eGovSadadPassportDuration',

          },
        ],
      },
      //-------------------------------------------
    },
  },
  //-------------------------------------------------------------------
  '091': {
    key: '091',
    apiKey: 'DrivingLicense',
    title: 'Driving License',
    applicationsTypes: {
      //-------------------------------------------
      '022': {
        key: '022',
        title: 'Issue License',
        controls: [
          {
            key: 'beneficiaryId',
            title: 'Beneficiary ID',
            label: 'payments.government.drivingLicenseServices.beneficiaryId',
            required: true,
            value: '',
            validators: [
              { validation: ValidationsEnum.MIN_LENGTH, options: "10" },
              { validation: ValidationsEnum.MAX_LENGTH, options: "10" },
              { validation: ValidationsEnum.DIGIT_ONLY },
            ],
            validationLabels: { required: 'payments.government.validations.beneficiaryId' },

          },
          {
            key: 'licenseType',
            title: 'License Type',
            label: 'payments.government.drivingLicenseServices.licenseType',
            type: 'select',
            required: true,
            value: '',
            validators: [],
            validationLabels: { required: 'payments.government.validations.licenseType' },

            select_combo_key: 'eGovLicenseTypeApp',

          },
          {
            key: 'licenseDuration',
            title: 'License Duration',
            label: 'payments.government.drivingLicenseServices.licenseDuration',
            type: 'select-dep',
            required: true,
            value: '',
            validators: [],
            validationLabels: { required: 'payments.government.validations.licenseDuration' },

            select_combo_key: 'eGovLicenseDurationApp',
            select_dependent: true,
            select_parent: 'licenseType',
            select_combo_key_by_parent_value:
              'eGovLicenseDurationType',

          },
        ],
      },
      //-------------------------------------------
      '023': {
        key: '023',
        title: 'Issue License from Old License',
        controls: [
          {
            key: 'beneficiaryId',
            title: 'Beneficiary ID',
            label: 'payments.government.drivingLicenseServices.beneficiaryId',
            required: true,
            value: '',
            validators: [
              { validation: ValidationsEnum.MIN_LENGTH, options: "10" },
              { validation: ValidationsEnum.MAX_LENGTH, options: "10" },
              { validation: ValidationsEnum.DIGIT_ONLY },
            ],
            validationLabels: { required: 'payments.government.validations.beneficiaryId' },

          },
          {
            key: 'licenseType',
            title: 'License Type',
            label: 'payments.government.drivingLicenseServices.licenseType',
            type: 'select',
            required: true,
            value: '',
            validators: [],
            validationLabels: { required: 'payments.government.validations.licenseType' },

            select_combo_key: 'eGovLicenseTypeApp',

          },
          {
            key: 'licenseDuration',
            title: 'License Duration',
            label: 'payments.government.drivingLicenseServices.licenseDuration',
            type: 'select-dep',
            required: true,
            value: '',
            validators: [],
            validationLabels: { required: 'payments.government.validations.licenseDuration' },

            select_combo_key: 'eGovLicenseDurationApp',
            select_dependent: true,
            select_parent: 'licenseType',
            select_combo_key_by_parent_value:
              'eGovLicenseDurationType',

          },
        ],
      },
      //-------------------------------------------
      '024': {
        key: '024',
        title: 'Replace License',
        controls: [
          {
            key: 'beneficiaryId',
            title: 'Beneficiary ID',
            label: 'payments.government.drivingLicenseServices.beneficiaryId',
            required: true,
            value: '',
            validators: [
              { validation: ValidationsEnum.MIN_LENGTH, options: "10" },
              { validation: ValidationsEnum.MAX_LENGTH, options: "10" },
              { validation: ValidationsEnum.DIGIT_ONLY },
            ],
            validationLabels: { required: 'payments.government.validations.beneficiaryId' },

          },
          {
            key: 'licenseType',
            title: 'License Type',
            label: 'payments.government.drivingLicenseServices.licenseType',
            type: 'select',
            required: true,
            value: '',
            validators: [],
            validationLabels: { required: 'payments.government.validations.licenseType' },

            select_combo_key: 'eGovLicenseTypeApp',

          },
          {
            key: 'licenseDuration',
            title: 'License Duration',
            label: 'payments.government.drivingLicenseServices.licenseDuration',
            type: 'select-dep',
            required: true,
            value: '',
            validators: [],
            validationLabels: { required: 'payments.government.validations.licenseDuration' },

            select_combo_key: 'eGovLicenseDurationApp',
            select_dependent: true,
            select_parent: 'licenseType',
            select_combo_key_by_parent_value:
              'eGovLicenseDurationType',

          },
        ],
      },
      //-------------------------------------------
      '025': {
        key: '025',
        title: 'Renew License',
        controls: [
          {
            key: 'beneficiaryId',
            title: 'Beneficiary ID',
            label: 'payments.government.drivingLicenseServices.beneficiaryId',
            required: true,
            value: '',
            validators: [
              { validation: ValidationsEnum.MIN_LENGTH, options: "10" },
              { validation: ValidationsEnum.MAX_LENGTH, options: "10" },
              { validation: ValidationsEnum.DIGIT_ONLY },
            ],
            validationLabels: { required: 'payments.government.validations.beneficiaryId' },

          },
          {
            key: 'licenseType',
            title: 'License Type',
            label: 'payments.government.drivingLicenseServices.licenseType',
            type: 'select',
            required: true,
            value: '',
            validators: [],
            validationLabels: { required: 'payments.government.validations.licenseType' },

            select_combo_key: 'eGovLicenseTypeApp',

          },
          {
            key: 'licenseDuration',
            title: 'License Duration',
            label: 'payments.government.drivingLicenseServices.licenseDuration',
            type: 'select-dep',
            required: true,
            value: '',
            validators: [],
            validationLabels: { required: 'payments.government.validations.licenseDuration' },

            select_combo_key: 'eGovLicenseDurationApp',
            select_dependent: true,
            select_parent: 'licenseType',
            select_combo_key_by_parent_value:
              'eGovLicenseDurationType',

          },
        ],
      },
      //-------------------------------------------
    },
  },
  //-------------------------------------------------------------------
  '096': {
    key: '096',
    apiKey: 'CivilRegistration',
    title: 'Civil Registration',
    applicationsTypes: {
      //-------------------------------------------
      '017': {
        key: '017',
        title: 'Birth Registration',
        controls: [
          {
            key: 'nationalIdNumber',
            title: 'National Id Number',
            label: 'payments.government.civilRegistrationServices.nationalIdNumber',
            required: true,
            value: '',
            validators: [
              { validation: ValidationsEnum.MIN_LENGTH, options: "10" },
              { validation: ValidationsEnum.MAX_LENGTH, options: "10" },
              { validation: ValidationsEnum.DIGIT_ONLY },
            ],
            validationLabels: { required: 'payments.government.validations.nationalIdNumber' },

          },
          {
            key: 'birthDate',
            title: 'Birth Date',
            label: 'payments.government.civilRegistrationServices.birthDate',
            type: 'date',
            required: true,
            value: '',
            validators: [],
            validationLabels: { required: 'payments.government.validations.birthDate' },

            widget: 'datepicker-ar',
            widget_datepicker_min_date: false,
            widget_datepicker_max_date: true,
            widget_container_class: 'col-xs-12 col-sm-3',
            widget_container_init_row: false,
            widget_container_end_row: false,
          },
          // todo no son necesarios, pero el API los requiere, los ponemos hidden
          {
            key: 'issuanceReason',
            title: 'Issuance Reasons',
            label: 'payments.government.civilDefenseViolationsServices.issuanceReason',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: []
          },
          {
            key: 'cardVersionNumber',
            title: 'Card Version Number',
            label: 'payments.government.civilDefenseViolationsServices.cardVersionNumber',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: []
          },
        ],
      },
      //-------------------------------------------
      '018': {
        key: '018',
        title: 'Death Registration',
        controls: [
          {
            key: 'nationalIdNumber',
            title: 'National Id Number',
            label: 'payments.government.civilRegistrationServices.nationalIdNumber',
            required: true,
            value: '',
            validators: [
              { validation: ValidationsEnum.MIN_LENGTH, options: "10" },
              { validation: ValidationsEnum.MAX_LENGTH, options: "10" },
              { validation: ValidationsEnum.DIGIT_ONLY },
            ],
            validationLabels: { required: 'payments.government.validations.nationalIdNumber' },

          },
          {
            key: 'deathDate',
            title: 'Death Date',
            label: 'payments.government.civilRegistrationServices.deathDate',
            type: 'date',
            required: true,
            value: '',
            validators: [],
            validationLabels: { required: 'payments.government.validations.deathDate' },

            widget: 'datepicker-ar',
            widget_datepicker_min_date: false,
            widget_datepicker_max_date: true,
            widget_container_class: 'col-xs-12 col-sm-3',
            widget_container_init_row: false,
            widget_container_end_row: false,
          },
          // todo no son necesarios, pero el API los requiere, los ponemos hidden
          {
            key: 'issuanceReason',
            title: 'Issuance Reasons',
            label: 'payments.government.civilDefenseViolationsServices.issuanceReason',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: [],

          },
          {
            key: 'cardVersionNumber',
            title: 'Card Version Number',
            label: 'payments.government.civilDefenseViolationsServices.cardVersionNumber',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: [],

          },
        ],
      },
      //-------------------------------------------
      '019': {
        key: '019',
        title: 'Marriage Registration',
        controls: [
          {
            key: 'nationalIdNumber',
            title: 'National Id Number',
            label: 'payments.government.civilRegistrationServices.nationalIdNumber',
            required: true,
            value: '',
            validators: [
              { validation: ValidationsEnum.MIN_LENGTH, options: "10" },
              { validation: ValidationsEnum.MAX_LENGTH, options: "10" },
              { validation: ValidationsEnum.DIGIT_ONLY },
            ],
            validationLabels: { required: 'payments.government.validations.nationalIdNumber' },

          },
          {
            key: 'marriageDate',
            title: 'Marriage Date',
            label: 'payments.government.civilRegistrationServices.marriageDate',
            type: 'date',
            required: true,
            value: '',
            validators: [],
            validationLabels: { required: 'payments.government.validations.marriageDate' },

            widget: 'datepicker-ar',
            widget_datepicker_min_date: false,
            widget_datepicker_max_date: true,
            widget_container_class: 'col-xs-12 col-sm-3',
            widget_container_init_row: false,
            widget_container_end_row: false,
          },
          // todo no son necesarios, pero el API los requiere, los ponemos hidden
          {
            key: 'issuanceReason',
            title: 'Issuance Reasons',
            label: 'payments.government.civilDefenseViolationsServices.issuanceReason',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: [],

          },
          {
            key: 'cardVersionNumber',
            title: 'Card Version Number',
            label: 'payments.government.civilDefenseViolationsServices.cardVersionNumber',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: [],

          },
        ],
      },
      //-------------------------------------------
      '020': {
        key: '020',
        title: 'Divorce Registration',
        controls: [
          {
            key: 'nationalIdNumber',
            title: 'National Id Number',
            label: 'payments.government.civilRegistrationServices.nationalIdNumber',
            required: true,
            value: '',
            validators: [
              { validation: ValidationsEnum.MIN_LENGTH, options: "10" },
              { validation: ValidationsEnum.MAX_LENGTH, options: "10" },
              { validation: ValidationsEnum.DIGIT_ONLY },
            ],
            validationLabels: { required: 'payments.government.validations.nationalIdNumber' },

          },
          {
            key: 'divorceDate',
            title: 'Divorce Date',
            label: 'payments.government.civilRegistrationServices.divorceDate',
            type: 'date',
            required: true,
            value: '',
            validators: [],
            validationLabels: { required: 'payments.government.validations.divorceDate' },

            widget: 'datepicker-ar',
            widget_datepicker_min_date: false,
            widget_datepicker_max_date: true,
            widget_container_class: 'col-xs-12 col-sm-3',
            widget_container_init_row: false,
            widget_container_end_row: false,
          },
          // todo no son necesarios, pero el API los requiere, los ponemos hidden
          {
            key: 'issuanceReason',
            title: 'Issuance Reasons',
            label: 'payments.government.civilDefenseViolationsServices.issuanceReason',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: [],

          },
          {
            key: 'cardVersionNumber',
            title: 'Card Version Number',
            label: 'payments.government.civilDefenseViolationsServices.cardVersionNumber',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: [],

          },
        ],
      },
      //-------------------------------------------
      '021': {
        key: '021',
        title: 'Issue ID Card',
        controls: [
          {
            key: 'nationalIdNumber',
            title: 'National Id Number',
            label: 'payments.government.civilDefenseViolationsServices.nationalIdNumber',
            required: true,
            value: '',
            validators: [
              { validation: ValidationsEnum.MIN_LENGTH, options: "10" },
              { validation: ValidationsEnum.MAX_LENGTH, options: "10" },
              { validation: ValidationsEnum.DIGIT_ONLY },
            ],
            validationLabels: { required: 'payments.government.validations.nationalIdNumber' },

          },
          {
            key: 'issuanceReason',
            title: 'Issuance Reasons',
            label: 'payments.government.civilDefenseViolationsServices.issuanceReason',
            type: 'select',
            required: true,
            value: '',
            validators: [],
            validationLabels: { required: 'payments.government.validations.issuanceReason' },

            select_combo_key: 'eGovSadadIssuanceReason',

          },
          {
            key: 'cardVersionNumber',
            title: 'Card Version Number',
            label: 'payments.government.civilDefenseViolationsServices.cardVersionNumber',
            type: 'text',
            required: true,
            value: '',
            validators: [ { validation: ValidationsEnum.MIN_LENGTH, options: "2" }],
            validationLabels: { required: 'payments.government.validations.cardVersionNumber' },

            maxlength: "2",

          },
        ],
      },
      //-------------------------------------------
      '053': {
        key: '053',
        title: 'Issue Family Card',
        controls: [
          {
            key: 'nationalIdNumber',
            title: 'National Id Number',
            label: 'payments.government.civilDefenseViolationsServices.nationalIdNumber',
            required: true,
            value: '',
            validators: [
              { validation: ValidationsEnum.MIN_LENGTH, options: "10" },
              { validation: ValidationsEnum.MAX_LENGTH, options: "10" },
              { validation: ValidationsEnum.DIGIT_ONLY },
            ],
            validationLabels: { required: 'payments.government.validations.nationalIdNumber' },

          },
          {
            key: 'issuanceReason',
            title: 'Issuance Reasons',
            label: 'payments.government.civilDefenseViolationsServices.issuanceReason',
            type: 'select',
            required: true,
            value: '',
            validators: [],
            validationLabels: { required: 'payments.government.validations.issuanceReason' },

            select_combo_key: 'eGovSadadIssuanceReason',

          },
          {
            key: 'cardVersionNumber',
            title: 'Card Version Number',
            label: 'payments.government.civilDefenseViolationsServices.cardVersionNumber',
            type: 'text',
            required: true,
            value: '',
            validators: [ { validation: ValidationsEnum.MIN_LENGTH, options: "2" }],
            validationLabels: { required: 'payments.government.validations.cardVersionNumber' },

            maxlength: "2",

          },
        ],
      },
      //-------------------------------------------
      '054': {
        key: '054',
        title: 'Other Fees and Fines',
        controls: [
          {
            key: 'nationalIdNumber',
            title: 'National Id Number',
            label: 'payments.government.civilDefenseViolationsServices.nationalIdNumber',
            required: true,
            value: '',
            validators: [
              { validation: ValidationsEnum.MIN_LENGTH, options: "10" },
              { validation: ValidationsEnum.MAX_LENGTH, options: "10" },
              { validation: ValidationsEnum.DIGIT_ONLY },
            ],
            validationLabels: { required: 'payments.government.validations.nationalIdNumber' },

          },
          // todo no son necesarios, pero el API los requiere, los ponemos hidden
          {
            key: 'issuanceReason',
            title: 'Issuance Reasons',
            label: 'payments.government.civilDefenseViolationsServices.issuanceReason',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: [],

          },
          {
            key: 'cardVersionNumber',
            title: 'Card Version Number',
            label: 'payments.government.civilDefenseViolationsServices.cardVersionNumber',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: [],

          },
        ],
      },
      //-------------------------------------------
    },
  },
  //-------------------------------------------------------------------
  '158': {
    key: '158',
    apiKey: 'CivilDefenseViolations',
    title: 'Civil Defense',
    applicationsTypes: {
      //-------------------------------------------
      '055': {
        key: '055',
        title: 'Pay All Civil Defense Violations fines',
        controls: [
          {
            key: 'violatorId',
            title: 'Violator Id',
            label: 'payments.government.civilDefenseViolationsServices.violatorId',
            required: true,
            value: '',
            validators: [
              { validation: ValidationsEnum.MIN_LENGTH, options: "10" },
              { validation: ValidationsEnum.MAX_LENGTH, options: "10" },
              { validation: ValidationsEnum.DIGIT_ONLY },
            ],
            validationLabels: { required: 'payments.government.validations.violatorId' },


          },
          // todo no son necesarios, pero el API los requiere, los ponemos hidden
          {
            key: 'verdictNumber',
            title: 'Verdict Number',
            label: 'payments.government.trafficViolationsServices.verdictNumber',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: [],

          },
        ],
      },
      //-------------------------------------------
      '056': {
        key: '056',
        title: 'Pay One Civil Defense Violations fines',
        controls: [
          {
            key: 'violatorId',
            title: 'Violator Id',
            label: 'payments.government.civilDefenseViolationsServices.violatorId',
            required: true,
            value: '',
            validators: [
              { validation: ValidationsEnum.MIN_LENGTH, options: "10" },
              { validation: ValidationsEnum.MAX_LENGTH, options: "10" },
              { validation: ValidationsEnum.DIGIT_ONLY },
            ],
            validationLabels: { required: 'payments.government.validations.violatorId' },

          },
          {
            key: 'verdictNumber',
            title: 'Verdict Number',
            label: 'payments.government.trafficViolationsServices.verdictNumber',
            type: 'text',
            required: true,
            value: '',
            validators: [
              { validation: ValidationsEnum.MIN_LENGTH, options: "10" },
              { validation: ValidationsEnum.MAX_LENGTH, options: "10" },
              { validation: ValidationsEnum.DIGIT_ONLY },
            ],
            validationLabels: { required: 'payments.government.validations.verdictNumber' },

          },
        ],
      },
      //-------------------------------------------
    },
  },
  //-------------------------------------------------------------------
  '090': {
    key: '090',
    apiKey: 'AlienControl',
    title: 'Expatriate Services',
    applicationsTypes: {
      //-------------------------------------------
      '001': {
        key: '001',
        title: 'Extend Visitor Visa',
        controls: [
          {
            key: 'borderNumber',
            title: 'Border Number',
            label: 'payments.government.expatriateServices.borderNumber',
            required: true,
            value: '',
            validators: [
              { validation: ValidationsEnum.MIN_LENGTH, options: "10" },
              { validation: ValidationsEnum.MAX_LENGTH, options: "10" },
              { validation: ValidationsEnum.DIGIT_ONLY },
            ],
            validationLabels: { required: 'payments.government.validations.borderNumber' },

          },
        ],
      },
      //-------------------------------------------
      '002': {
        key: '002',
        title: 'Issue New Iqama',
        controls: [
          {
            key: 'borderNumber',
            title: 'Border Number',
            label: 'payments.government.expatriateServices.borderNumber',
            required: true,
            value: '',
            validators: [
              { validation: ValidationsEnum.MIN_LENGTH, options: "10" },
              { validation: ValidationsEnum.MAX_LENGTH, options: "10" },
              { validation: ValidationsEnum.DIGIT_ONLY },
            ],
            validationLabels: { required: 'payments.government.validations.borderNumber' },

          },
          {
            key: 'iqamaDuration',
            title: 'Iqama Duration',
            label: 'payments.government.expatriateServices.iqamaDuration',
            type: 'select',
            required: true,
            value: '',
            validators: [],
            validationLabels: { required: 'payments.government.validations.iqamaDuration' },

            select_combo_key: 'eGovSadadIqamaDuration', // "eGovSadadVisaDuration",

          },
          {
            key: 'sponsorId',
            title: 'Sponsor Id',
            label: 'payments.government.expatriateServices.sponsorId',
            type: 'text',
            required: true,
            value: '',
            validators: [
              { validation: ValidationsEnum.MIN_LENGTH, options: "10" },
              { validation: ValidationsEnum.MAX_LENGTH, options: "10" },
              { validation: ValidationsEnum.DIGIT_ONLY },
            ],
            validationLabels: { required: 'payments.government.validations.sponsor-id-is-required' },

          },
          {
            key: 'jobCategory',
            title: 'Job Category',
            label: 'payments.government.expatriateServices.jobCategory',
            type: 'select',
            required: true,
            value: '',
            validators: [],
            validationLabels: { required: 'payments.government.validations.jobCategory' },

            select_combo_key: 'eGovSadadJobCategory',

          },
        ],
      },
      //-------------------------------------------
      '003': {
        key: '003',
        title: 'Renew Iqama',
        controls: [
          {
            key: 'iqamaId',
            title: 'Iqama Id',
            label: 'payments.government.expatriateServices.iqamaId',
            required: true,
            value: '',
            validators: [
              { validation: ValidationsEnum.MIN_LENGTH, options: "10" },
              { validation: ValidationsEnum.MAX_LENGTH, options: "10" },
              { validation: ValidationsEnum.DIGIT_ONLY },
            ],
            validationLabels: { required: 'payments.government.validations.iqamaId' },

          },
          {
            key: 'iqamaDuration',
            title: 'Iqama Duration',
            label: 'payments.government.expatriateServices.iqamaDuration',
            type: 'select',
            required: true,
            value: '',
            validators: [],
            validationLabels: { required: 'payments.government.validations.iqamaDuration' },

            select_combo_key: 'eGovSadadIqamaDuration',

          },
          // todo no son necesarios, pero el API los requiere, los ponemos hidden
          {
            key: 'borderNumber',
            title: 'Border Number',
            label: 'payments.government.expatriateServices.borderNumber',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: [],

          },
        ],
      },
      //-------------------------------------------
      '004': {
        key: '004',
        title: 'Exit Re-entry Visa (Single)',
        controls: [
          {
            key: 'iqamaId',
            title: 'Iqama Id',
            label: 'payments.government.expatriateServices.iqamaId',
            required: true,
            value: '',
            validators: [
              { validation: ValidationsEnum.MIN_LENGTH, options: "10" },
              { validation: ValidationsEnum.MAX_LENGTH, options: "10" },
              { validation: ValidationsEnum.DIGIT_ONLY },
            ],
            validationLabels: { required: 'payments.government.validations.iqamaId' },

          },
          {
            key: 'visaDuration',
            title: 'Iqama Duration',
            label: 'payments.government.expatriateServices.visaDuration',
            type: 'select',
            required: true,
            value: '',
            validators: [],
            validationLabels: { required: 'payments.government.validations.iqamaDuration' },

            select_combo_key: 'eGovSadadVisaDuration',

          },
          // todo no son necesarios, pero el API los requiere, los ponemos hidden
          {
            key: 'borderNumber',
            title: 'Border Number',
            label: 'payments.government.expatriateServices.borderNumber',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: [],

          },
        ],
      },
      //-------------------------------------------
      '005': {
        key: '005',
        title: 'Exit Re-entry Visa(Multiple)',
        controls: [
          {
            key: 'iqamaId',
            title: 'Iqama Id',
            label: 'payments.government.expatriateServices.iqamaId',
            required: true,
            value: '',
            validators: [
              { validation: ValidationsEnum.MIN_LENGTH, options: "10" },
              { validation: ValidationsEnum.MAX_LENGTH, options: "10" },
              { validation: ValidationsEnum.DIGIT_ONLY },
            ],
            validationLabels: { required: 'payments.government.validations.iqamaId' },

          },
          {
            key: 'visaDuration',
            title: 'Iqama Duration',
            label: 'payments.government.expatriateServices.visaDuration',
            type: 'select',
            required: true,
            value: '',
            validators: [],
            validationLabels: { required: 'payments.government.validations.iqamaDuration' },

            select_combo_key: 'eGovSadadVisaDuration',

          },
          // todo no son necesarios, pero el API los requiere, los ponemos hidden
          {
            key: 'borderNumber',
            title: 'Border Number',
            label: 'payments.government.expatriateServices.borderNumber',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: [],

          },
        ],
      },
      //-------------------------------------------
      '006': {
        key: '006',
        title: 'Visa Cancellation',
        controls: [
           {
            key: 'iqamaId',
            title: 'Iqama Id',
            label: 'payments.government.expatriateServices.iqamaId',
            required: true,
            value: '',
            validators: [
              { validation: ValidationsEnum.MIN_LENGTH, options: "10" },
              { validation: ValidationsEnum.MAX_LENGTH, options: "10" },
              { validation: ValidationsEnum.DIGIT_ONLY },
            ],
            validationLabels: { required: 'payments.government.validations.iqamaId' },

          },
          {
            key: 'visaNumber',
            title: 'Visa Number',
            label: 'payments.government.expatriateServices.visaNumber',
            required: true,
            value: '',
            validators: [{ validation: ValidationsEnum.MAX_LENGTH, options: "10" }],
            validationLabels: { required: 'payments.government.validations.visaNumber' },

          },
          // todo no son necesarios, pero el API los requiere, los ponemos hidden
          {
            key: 'borderNumber',
            title: 'Border Number',
            label: 'payments.government.expatriateServices.borderNumber',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: [],

          },
        ],
      },
      //-------------------------------------------
      '007': {
        key: '007',
        title: 'Transfer of Sponsorship',
        controls: [
          {
            key: 'iqamaId',
            title: 'Iqama Id',
            label: 'payments.government.expatriateServices.iqamaId',
            required: true,
            value: '',
            validators: [
              { validation: ValidationsEnum.MIN_LENGTH, options: "10" },
              { validation: ValidationsEnum.MAX_LENGTH, options: "10" },
              { validation: ValidationsEnum.DIGIT_ONLY },
            ],
            validationLabels: { required: 'payments.government.validations.iqamaId' },

          },
          // todo no son necesarios, pero el API los requiere, los ponemos hidden
          {
            key: 'borderNumber',
            title: 'Border Number',
            label: 'payments.government.expatriateServices.borderNumber',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: [],

          },
        ],
      },
      //-------------------------------------------
      '008': {
        key: '008',
        title: 'Replace Iqama',
        controls: [
          {
            key: 'iqamaId',
            title: 'Iqama Id',
            label: 'payments.government.expatriateServices.iqamaId',
            required: true,
            value: '',
            validators: [
              { validation: ValidationsEnum.MIN_LENGTH, options: "10" },
              { validation: ValidationsEnum.MAX_LENGTH, options: "10" },
              { validation: ValidationsEnum.DIGIT_ONLY },
            ],
            validationLabels: { required: 'payments.government.validations.iqamaId' },

          },
          // todo no son necesarios, pero el API los requiere, los ponemos hidden
          {
            key: 'borderNumber',
            title: 'Border Number',
            label: 'payments.government.expatriateServices.borderNumber',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: [],

          },
        ],
      },
      //-------------------------------------------
      '009': {
        key: '009',
        title: 'Transfer Dependant to be Head of Household',
        controls: [
          {
            key: 'iqamaId',
            title: 'Iqama Id',
            label: 'payments.government.expatriateServices.iqamaId',
            required: true,
            value: '',
            validators: [
              { validation: ValidationsEnum.MIN_LENGTH, options: "10" },
              { validation: ValidationsEnum.MAX_LENGTH, options: "10" },
              { validation: ValidationsEnum.DIGIT_ONLY },
            ],
            validationLabels: { required: 'payments.government.validations.iqamaId' },

          },
          {
            key: 'iqamaDuration',
            title: 'Iqama Duration',
            label: 'payments.government.expatriateServices.iqamaDuration',
            type: 'select',
            required: true,
            value: '',
            validators: [],
            validationLabels: { required: 'payments.government.validations.iqamaDuration' },

            select_combo_key: 'eGovSadadIqamaDuration',

          },
          {
            key: 'sponsorId',
            title: 'Sponsor Id',
            label: 'payments.government.expatriateServices.sponsorId',
            type: 'text',
            required: true,
            value: '',
            validators: [
              { validation: ValidationsEnum.MIN_LENGTH, options: "10" },
              { validation: ValidationsEnum.MAX_LENGTH, options: "10" },
              { validation: ValidationsEnum.DIGIT_ONLY },
            ],
            validationLabels: { required: 'payments.government.validations.sponsor-id-is-required' },

          },
          {
            key: 'jobCategory',
            title: 'Job Category',
            label: 'payments.government.expatriateServices.jobCategory',
            type: 'select',
            required: true,
            value: '',
            validators: [],
            validationLabels: { required: 'payments.government.validations.jobCategory' },

            select_combo_key: 'eGovSadadJobCategory',

          },
          // todo no son necesarios, pero el API los requiere, los ponemos hidden
          {
            key: 'borderNumber',
            title: 'Border Number',
            label: 'payments.government.expatriateServices.borderNumber',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: [],

          },
        ],
      },
      //-------------------------------------------
      '010': {
        key: '010',
        title: 'Transfer Head of Household to be Dependant',
        controls: [
          {
            key: 'iqamaId',
            title: 'Iqama Id',
            label: 'payments.government.expatriateServices.iqamaId',
            required: true,
            value: '',
            validators: [
              { validation: ValidationsEnum.MIN_LENGTH, options: "10" },
              { validation: ValidationsEnum.MAX_LENGTH, options: "10" },
              { validation: ValidationsEnum.DIGIT_ONLY },
            ],
            validationLabels: { required: 'payments.government.validations.iqamaId' },

          },
          // todo no son necesarios, pero el API los requiere, los ponemos hidden
          {
            key: 'borderNumber',
            title: 'Border Number',
            label: 'payments.government.expatriateServices.borderNumber',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: [],

          },
        ],
      },
      //-------------------------------------------
      '011': {
        key: '011',
        title: 'Transfer Dependant to a New Head of Household',
        controls: [
          {
            key: 'iqamaId',
            title: 'Iqama Id',
            label: 'payments.government.expatriateServices.iqamaId',
            required: true,
            value: '',
            validators: [
              { validation: ValidationsEnum.MIN_LENGTH, options: "10" },
              { validation: ValidationsEnum.MAX_LENGTH, options: "10" },
              { validation: ValidationsEnum.DIGIT_ONLY },
            ],
            validationLabels: { required: 'payments.government.validations.iqamaId' },

          },
          // todo no son necesarios, pero el API los requiere, los ponemos hidden
          {
            key: 'borderNumber',
            title: 'Border Number',
            label: 'payments.government.expatriateServices.borderNumber',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: [],

          },
        ],
      },
      //-------------------------------------------
      '012': {
        key: '012',
        title: 'Change of Occupation',
        controls: [
          {
            key: 'iqamaId',
            title: 'Iqama Id',
            label: 'payments.government.expatriateServices.iqamaId',
            required: true,
            value: '',
            validators: [
              { validation: ValidationsEnum.MIN_LENGTH, options: "10" },
              { validation: ValidationsEnum.MAX_LENGTH, options: "10" },
              { validation: ValidationsEnum.DIGIT_ONLY },
            ],
            validationLabels: { required: 'payments.government.validations.iqamaId' },

          },
          // todo no son necesarios, pero el API los requiere, los ponemos hidden
          {
            key: 'borderNumber',
            title: 'Border Number',
            label: 'payments.government.expatriateServices.borderNumber',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: [],

          },
        ],
      },
      //-------------------------------------------
      '013': {
        key: '013',
        title: 'Dependents Entry visa Fee Collection',
        label: 'Dependents Entry visa Fee Collection',
        controls: [
          {
            key: 'householdIdNumber',
            title: 'House Hold Id Number',
            label: 'payments.government.expatriateServices.householdIdNumber',
            required: true,
            value: '',
            validators: [
              { validation: ValidationsEnum.MIN_LENGTH, options: "10" },
              { validation: ValidationsEnum.MAX_LENGTH, options: "10" },
              { validation: ValidationsEnum.DIGIT_ONLY },
            ],
            validationLabels: { required: 'payments.government.validations.householdIdNumber' },

          },
          {
            key: 'numberDependant',
            title: 'Number Dependent',
            label: 'payments.government.expatriateServices.numberDependent',
            required: true,
            value: '',
            validators: [{ validation: ValidationsEnum.MAX_LENGTH, options: "10" }],
            validationLabels: { required: 'payments.government.validations.numberDependant' },

          },
          // todo no son necesarios, pero el API los requiere, los ponemos hidden
          {
            key: 'borderNumber',
            title: 'Border Number',
            label: 'payments.government.expatriateServices.borderNumber',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: [],

          },
        ],
      },
      //-------------------------------------------
      '014': {
        key: '014',
        title:
          'Adding Dependent born inside Saudi Arabia after one Year from his Date of Birth',
        controls: [
          {
            key: 'iqamaId',
            title: 'Iqama Id',
            label: 'payments.government.expatriateServices.iqamaId',
            required: true,
            value: '',
            validators: [
              { validation: ValidationsEnum.MIN_LENGTH, options: "10" },
              { validation: ValidationsEnum.MAX_LENGTH, options: "10" },
              { validation: ValidationsEnum.DIGIT_ONLY },
            ],
            validationLabels: { required: 'payments.government.validations.iqamaId' },

          },
          {
            key: 'dependantHijriBirthDate',
            title: 'Birth Date',
            label: 'payments.government.expatriateServices.dependantHijriBirthDate',
            type: 'date',
            required: true,
            value: '',
            validators: [],
            validationLabels: { required: 'payments.government.validations.dependantHijriBirthDate' },

            widget: 'datepicker-ar',
            widget_datepicker_min_date: false,
            widget_datepicker_max_date: false,
            widget_container_class: 'col-xs-12 col-sm-3',
            widget_container_init_row: false,
            widget_container_end_row: false,
          },
          // todo no son necesarios, pero el API los requiere, los ponemos hidden
          {
            key: 'borderNumber',
            title: 'Border Number',
            label: 'payments.government.expatriateServices.borderNumber',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: [],

          },
        ],
      },
      //-------------------------------------------
      '015': {
        key: '015',
        title: 'Dependent Separation',
        controls: [
          {
            key: 'iqamaId',
            title: 'Iqama Id',
            label: 'payments.government.expatriateServices.iqamaId',
            required: true,
            value: '',
            validators: [
              { validation: ValidationsEnum.MIN_LENGTH, options: "10" },
              { validation: ValidationsEnum.MAX_LENGTH, options: "10" },
              { validation: ValidationsEnum.DIGIT_ONLY },
            ],
            validationLabels: { required: 'payments.government.validations.iqamaId' },

          },
          // todo no son necesarios, pero el API los requiere, los ponemos hidden
          {
            key: 'borderNumber',
            title: 'Border Number',
            label: 'payments.government.expatriateServices.borderNumber',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: [],

          },
        ],
      },
      //-------------------------------------------
      '016': {
        key: '016',
        title: 'Issue New Iqama for a Citizens Wife',
        controls: [
          {
            key: 'borderNumber',
            title: 'Border Number',
            label: 'payments.government.expatriateServices.borderNumber',
            required: true,
            value: '',
            validators: [
              { validation: ValidationsEnum.MIN_LENGTH, options: "10" },
              { validation: ValidationsEnum.MAX_LENGTH, options: "10" },
              { validation: ValidationsEnum.DIGIT_ONLY },
            ],
            validationLabels: { required: 'payments.government.validations.borderNumber' },

          },
          {
            key: 'citizenId',
            title: 'Citizen ID',
            label: 'payments.government.expatriateServices.citizenId',
            required: true,
            value: '',
            validators: [
              { validation: ValidationsEnum.MIN_LENGTH, options: "10" },
              { validation: ValidationsEnum.MAX_LENGTH, options: "10" },
              { validation: ValidationsEnum.DIGIT_ONLY },
            ],
            validationLabels: { required: 'payments.government.validations.citizenId' },

          },
          {
            key: 'iqamaDuration',
            title: 'Iqama Duration',
            label: 'payments.government.expatriateServices.iqamaDuration',
            type: 'select',
            required: true,
            value: '',
            validators: [],
            validationLabels: { required: 'payments.government.validations.iqamaDuration' },

            select_combo_key: 'eGovSadadIqamaDuration',

          },
        ],
      },
      //-------------------------------------------
      '057': {
        key: '057',
        title: 'Extend Exit Re-Entry Visa Duration',
        controls: [
          {
            key: 'iqamaId',
            title: 'Iqama Id',
            label: 'payments.government.expatriateServices.iqamaId',
            required: true,
            value: '',
            validators: [
              { validation: ValidationsEnum.MIN_LENGTH, options: "10" },
              { validation: ValidationsEnum.MAX_LENGTH, options: "10" },
              { validation: ValidationsEnum.DIGIT_ONLY },
            ],
            validationLabels: { required: 'payments.government.validations.iqamaId' },

          },
          {
            key: 'visaNumber',
            title: 'Visa Number',
            label: 'payments.government.expatriateServices.visaNumber',
            required: true,
            value: '',
            validators: [
              { validation: ValidationsEnum.MAX_LENGTH, options: "10" },
              { validation: ValidationsEnum.DIGIT_ONLY },
            ],
            validationLabels: { required: 'payments.government.validations.visaNumber' },

          },
          {
            key: 'visaDuration',
            title: 'Visa Duration',
            label: 'payments.government.expatriateServices.visaDuration',
            type: 'select',
            required: true,
            value: '',
            validators: [],
            validationLabels: { required: 'payments.government.validations.visaDuration' },

            select_combo_key: 'eGovSadadVisaDuration'
          },
          // todo no son necesarios, pero el API los requiere, los ponemos hidden
          {
            key: 'borderNumber',
            title: 'Border Number',
            label: 'payments.government.expatriateServices.borderNumber',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: []
          },
        ],
      },
      //-------------------------------------------
      '052': {
        key: '052',
        title: 'Lost Passport Fine',
        controls: [
          {
            key: 'iqamaId',
            title: 'Iqama Id',
            label: 'payments.government.expatriateServices.iqamaId',
            required: true,
            value: '',
            validators: [
              { validation: ValidationsEnum.MIN_LENGTH, options: "10" },
              { validation: ValidationsEnum.MAX_LENGTH, options: "10" },
              { validation: ValidationsEnum.DIGIT_ONLY },
            ],
            validationLabels: { required: 'payments.government.validations.iqamaId' },

          },
          // todo no son necesarios, pero el API los requiere, los ponemos hidden
          {
            key: 'borderNumber',
            title: 'Border Number',
            label: 'payments.government.expatriateServices.borderNumber',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: []
          },
        ],
      },
      //-------------------------------------------
      '058': {
        key: '058',
        title: 'Associate Fees for a Specific Associate',
        controls: [
          {
            key: 'iqamaId',
            title: 'Iqama ID / Border Number',
            label: 'payments.government.expatriateServices.iqamaId',
            required: true,
            value: '',
            validators: [
              { validation: ValidationsEnum.MIN_LENGTH, options: "10" },
              { validation: ValidationsEnum.MAX_LENGTH, options: "10" },
              { validation: ValidationsEnum.DIGIT_ONLY },
            ],
            validationLabels: { required: 'payments.government.validations.iqamaId' },

          },
          {
            key: 'associatedBorderNumber',
            title: 'Associate Iqama ID / Associate Border Number',
            label: 'payments.government.expatriateServices.associateIqamaId',
            required: true,
            value: '',
            validators: [
              { validation: ValidationsEnum.MIN_LENGTH, options: "10" },
              { validation: ValidationsEnum.MAX_LENGTH, options: "10" },
              { validation: ValidationsEnum.DIGIT_ONLY },
            ],
            validationLabels: { required: 'payments.government.validations.associatedBorderNumber' },

          },
          {
            key: 'feesDurationEndDate',
            title: 'Fees Duration End',
            label: 'payments.government.expatriateServices.feesDurationEndDate',
            type: 'date',
            required: true,
            value: '',
            validators: [],
            validationLabels: { required: 'payments.government.validations.feesDurationEndDate' },

            widget: 'datepicker-ar',
            widget_datepicker_min_date: true,
            widget_datepicker_max_date: false,
            widget_container_class: 'col-xs-12 col-sm-3',
            widget_container_init_row: false,
            widget_container_end_row: false,
          },
          // todo no son necesarios, pero el API los requiere, los ponemos hidden
          {
            key: 'borderNumber',
            title: 'Border Number',
            label: 'payments.government.expatriateServices.borderNumber',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: []
          },
        ],
      },
      //-------------------------------------------
      '059': {
        key: '059',
        title:
          'Associate Fees for All Registered Associates on the Head of Household Iqama',
        controls: [
          {
            key: 'iqamaId',
            title: 'Iqama ID / Border Number',
            label: 'payments.government.expatriateServices.iqamaId',
            required: true,
            value: '',
            validators: [
              { validation: ValidationsEnum.MIN_LENGTH, options: "10" },
              { validation: ValidationsEnum.MAX_LENGTH, options: "10" },
              { validation: ValidationsEnum.DIGIT_ONLY },
            ],
            validationLabels: { required: 'payments.government.validations.iqamaId' },

          },
          {
            key: 'feesDurationEndDate',
            title: 'Fees Duration End',
            label: 'payments.government.expatriateServices.feesDurationEndDate',
            type: 'date',
            required: true,
            value: '',
            validators: [{ validation: ValidationsEnum.MAX_LENGTH, options: "10" }],
            validationLabels: { required: 'payments.government.validations.feesDurationEndDate' },

            widget: 'datepicker-ar',
            widget_datepicker_min_date: true,
            widget_datepicker_max_date: false,
            widget_container_class: 'col-xs-12 col-sm-3',
            widget_container_init_row: false,
            widget_container_end_row: false,
          },
          // todo no son necesarios, pero el API los requiere, los ponemos hidden
          {
            key: 'borderNumber',
            title: 'Border Number',
            label: 'payments.government.expatriateServices.borderNumber',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: []
          },
        ],
      },
      //-------------------------------------------
    },
  },
  //-------------------------------------------------------------------
  '094': {
    key: '094',
    apiKey: 'MotorVehicles',
    title: 'Motor Vehicles',
    applicationsTypes: {
      //-------------------------------------------
      '026': {
        key: '026',
        title: 'Renew Vehicle Registration',
        controls: [
          {
            key: 'currentOwnerId',
            title: 'Current Owner Id',
            label: 'payments.government.motorVehiclesServices.currentOwnerId',
            required: true,
            value: '',
            validators: [
              { validation: ValidationsEnum.MIN_LENGTH, options: "10" },
              { validation: ValidationsEnum.MAX_LENGTH, options: "10" },
              { validation: ValidationsEnum.DIGIT_ONLY },
            ],
            validationLabels: { required: 'payments.government.validations.currentOwnerId' },

          },
          {
            key: 'vehicleSequenceNumber',
            title: 'Vehicle Sequence Number',
            label: 'payments.government.motorVehiclesServices.vehicleSequenceNumber',
            required: true,
            value: '',
            validators: [{ validation: ValidationsEnum.MAX_LENGTH, options: "9" }],
            validationLabels: { required: 'payments.government.validations.vehicleSequenceNumber' },

          },
        ],
      },
      //-------------------------------------------
      '027': {
        key: '027',
        title: 'Transfer Owner',
        controls: [
          {
            key: 'currentOwnerId',
            title: 'Current Owner Id',
            label: 'payments.government.motorVehiclesServices.currentOwnerId',
            required: true,
            value: '',
            validators: [
              { validation: ValidationsEnum.MIN_LENGTH, options: "10" },
              { validation: ValidationsEnum.MAX_LENGTH, options: "10" },
              { validation: ValidationsEnum.DIGIT_ONLY },
            ],
            validationLabels: { required: 'payments.government.validations.currentOwnerId' },

          },
          {
            key: 'vehicleSequenceNumber',
            title: 'Vehicle Sequence Number',
            label: 'payments.government.motorVehiclesServices.vehicleSequenceNumber',
            required: true,
            value: '',
            validators: [{ validation: ValidationsEnum.MAX_LENGTH, options: "9" }],
            validationLabels: { required: 'payments.government.validations.vehicleSequenceNumber' },

          },
          {
            key: 'newOwnerId',
            title: 'New Owner Id',
            label: 'payments.government.motorVehiclesServices.newOwnerId',
            required: true,
            value: '',
            validators: [
              { validation: ValidationsEnum.MIN_LENGTH, options: "10" },
              { validation: ValidationsEnum.MAX_LENGTH, options: "10" },
              { validation: ValidationsEnum.DIGIT_ONLY },
            ],
            validationLabels: { required: 'payments.government.validations.newOwnerId' },

          },
        ],
      },
      //-------------------------------------------
      '028': {
        key: '028',
        title: 'Re-issue Registration Card',
        controls: [
          {
            key: 'currentOwnerId',
            title: 'Current Owner Id',
            label: 'payments.government.motorVehiclesServices.currentOwnerId',
            required: true,
            value: '',
            validators: [
              { validation: ValidationsEnum.MIN_LENGTH, options: "10" },
              { validation: ValidationsEnum.MAX_LENGTH, options: "10" },
              { validation: ValidationsEnum.DIGIT_ONLY },
            ],
            validationLabels: { required: 'payments.government.validations.currentOwnerId' },

          },
          {
            key: 'vehicleSequenceNumber',
            title: 'Vehicle Sequence Number',
            label: 'payments.government.motorVehiclesServices.vehicleSequenceNumber',
            required: true,
            value: '',
            validators: [{ validation: ValidationsEnum.MAX_LENGTH, options: "9" }],
            validationLabels: { required: 'payments.government.validations.vehicleSequenceNumber' },

          },
          {
            key: 'reason',
            title: 'Card Issuance Reason',
            label: 'payments.government.motorVehiclesServices.cardIssuanceReason',
            type: 'select',
            required: true,
            value: '',
            validators: [],
            validationLabels: { required: 'payments.government.validations.reason' },

            select_combo_key: 'eGovVehicleCardRegisterationReason',

          },
        ],
      },
      //-------------------------------------------
      '029': {
        key: '029',
        title: 'Re-issue License Plate',
        controls: [
          {
            key: 'currentOwnerId',
            title: 'Current Owner Id',
            label: 'payments.government.motorVehiclesServices.currentOwnerId',
            required: true,
            value: '',
            validators: [
              { validation: ValidationsEnum.MIN_LENGTH, options: "10" },
              { validation: ValidationsEnum.MAX_LENGTH, options: "10" },
              { validation: ValidationsEnum.DIGIT_ONLY },
            ],
            validationLabels: { required: 'payments.government.validations.currentOwnerId' },

          },
          {
            key: 'vehicleSequenceNumber',
            title: 'Vehicle Sequence Number',
            label: 'payments.government.motorVehiclesServices.vehicleSequenceNumber',
            required: true,
            value: '',
            validators: [{ validation: ValidationsEnum.MAX_LENGTH, options: "9" }],
            validationLabels: { required: 'payments.government.validations.vehicleSequenceNumber' },

          },
          {
            key: 'reason',
            title: 'Card Issuance Reason',
            label: 'payments.government.motorVehiclesServices.cardIssuanceReason',
            type: 'select',
            required: true,
            value: '',
            validators: [],
            validationLabels: { required: 'payments.government.validations.reason' },

            select_combo_key: 'eGovVehicleCardRegisterationReason',

          },
          {
            key: 'licensePlateWithLogo',
            title: 'License Plate WithLogo',
            label: 'payments.government.motorVehiclesServices.licensePlateWithLogo',
            type: 'select',
            required: true,
            value: '',
            validators: [],
            validationLabels: { required: 'payments.government.validations.licensePlateWithLogo' },

            select_combo_key: 'eGovLicensePlatewithLogo',
            widget: '',
            widget_container_class: 'col-xs-12 col-sm-6',
            widget_container_init_row: false,
            widget_container_end_row: false,
          },
        ],
      },
      //-------------------------------------------
      '030': {
        key: '030',
        title: 'Export Vehicle',
        controls: [
          {
            key: 'currentOwnerId',
            title: 'Current Owner Id',
            label: 'payments.government.motorVehiclesServices.currentOwnerId',
            required: true,
            value: '',
            validators: [
              { validation: ValidationsEnum.MIN_LENGTH, options: "10" },
              { validation: ValidationsEnum.MAX_LENGTH, options: "10" },
              { validation: ValidationsEnum.DIGIT_ONLY },
            ],
            validationLabels: { required: 'payments.government.validations.currentOwnerId' },

          },
          {
            key: 'vehicleSequenceNumber',
            title: 'Vehicle Sequence Number',
            label: 'payments.government.motorVehiclesServices.vehicleSequenceNumber',
            required: true,
            value: '',
            validators: [{ validation: ValidationsEnum.MAX_LENGTH, options: "9" }],
            validationLabels: { required: 'payments.government.validations.vehicleSequenceNumber' },

          },
        ],
      },
      //-------------------------------------------
      '031': {
        key: '031',
        title: 'Exchange Plates',
        controls: [
          {
            key: 'currentOwnerId',
            title: 'Current Owner Id',
            label: 'payments.government.motorVehiclesServices.currentOwnerId',
            required: true,
            value: '',
            validators: [
              { validation: ValidationsEnum.MIN_LENGTH, options: "10" },
              { validation: ValidationsEnum.MAX_LENGTH, options: "10" },
              { validation: ValidationsEnum.DIGIT_ONLY },
            ],
            validationLabels: { required: 'payments.government.validations.currentOwnerId' },

          },
          {
            key: 'vehicleSequenceNumber',
            title: 'Vehicle Sequence Number',
            label: 'payments.government.motorVehiclesServices.vehicleSequenceNumber',
            required: true,
            value: '',
            validators: [{ validation: ValidationsEnum.MAX_LENGTH, options: "9" }],
            validationLabels: { required: 'payments.government.validations.vehicleSequenceNumber' },

          },
        ],
      },
      //-------------------------------------------
      '032': {
        key: '032',
        title: 'Exchange Plates Not by Owner',
        controls: [
          {
            key: 'currentOwnerId',
            title: 'Current Owner Id',
            label: 'payments.government.motorVehiclesServices.currentOwnerId',
            required: true,
            value: '',
            validators: [
              { validation: ValidationsEnum.MIN_LENGTH, options: "10" },
              { validation: ValidationsEnum.MAX_LENGTH, options: "10" },
              { validation: ValidationsEnum.DIGIT_ONLY },
            ],
            validationLabels: { required: 'payments.government.validations.currentOwnerId' },

          },
          {
            key: 'vehicleSequenceNumber',
            title: 'Vehicle Sequence Number',
            label: 'payments.government.motorVehiclesServices.vehicleSequenceNumber',
            required: true,
            value: '',
            validators: [{ validation: ValidationsEnum.MAX_LENGTH, options: "9" }],
            validationLabels: { required: 'payments.government.validations.vehicleSequenceNumber' },

          },
          {
            key: 'newOwnerId',
            title: 'New Owner Id',
            label: 'payments.government.motorVehiclesServices.newOwnerId',
            required: true,
            value: '',
            validators: [
              { validation: ValidationsEnum.MIN_LENGTH, options: "10" },
              { validation: ValidationsEnum.MAX_LENGTH, options: "10" },
              { validation: ValidationsEnum.DIGIT_ONLY },
            ],
            validationLabels: { required: 'payments.government.validations.newOwnerId' },

          },
        ],
      },
      //-------------------------------------------
      '044': {
        key: '044',
        title:
          'Transfer Plates (Give plates to registered vehicle without plates)',
        controls: [
          {
            key: 'currentOwnerId',
            title: 'Current Owner Id',
            label: 'payments.government.motorVehiclesServices.currentOwnerId',
            required: true,
            value: '',
            validators: [
              { validation: ValidationsEnum.MIN_LENGTH, options: "10" },
              { validation: ValidationsEnum.MAX_LENGTH, options: "10" },
              { validation: ValidationsEnum.DIGIT_ONLY },
            ],
            validationLabels: { required: 'payments.government.validations.currentOwnerId' },

          },
          {
            key: 'vehicleSequenceNumber',
            title: 'Vehicle Sequence Number',
            label: 'payments.government.motorVehiclesServices.vehicleSequenceNumber',
            required: true,
            value: '',
            validators: [{ validation: ValidationsEnum.MAX_LENGTH, options: "9" }],
            validationLabels: { required: 'payments.government.validations.vehicleSequenceNumber' },

          },
          {
            key: 'newVehicleRegistrationType',
            title: 'New Vehicle Registration Type',
            label: 'payments.government.motorVehiclesServices.newVehicleRegistrationType',
            type: 'select',
            required: true,
            value: '',
            validators: [],
            validationLabels: { required: 'payments.government.validations.newVehicleRegistrationType' },

            select_combo_key: 'eGovVehicleRegistrationType',

          },
          {
            key: 'vehicleBodyType',
            title: 'Vehicle Body Type',
            label: 'payments.government.motorVehiclesServices.vehicleBodyType',
            type: 'select-dep',
            required: true,
            value: '',
            validators: [],
            validationLabels: { required: 'payments.government.validations.vehicleBodyType' },

            select_combo_key: 'eGovVehicleBodyType',
            select_dependent: true,
            select_parent: 'newVehicleRegistrationType',
            select_combo_key_by_parent_value: 'eGovVehicleBodyType',

          },
        ],
      },
      //-------------------------------------------
      '045': {
        key: '045',
        title: 'Transfer Plates (Changing Current Vehicle plate)',
        controls: [
          {
            key: 'currentOwnerId',
            title: 'Current Owner Id',
            label: 'payments.government.motorVehiclesServices.currentOwnerId',
            required: true,
            value: '',
            validators: [
              { validation: ValidationsEnum.MIN_LENGTH, options: "10" },
              { validation: ValidationsEnum.MAX_LENGTH, options: "10" },
              { validation: ValidationsEnum.DIGIT_ONLY },
            ],
            validationLabels: { required: 'payments.government.validations.currentOwnerId' },

          },
          {
            key: 'vehicleSequenceNumber',
            title: 'Vehicle Sequence Number',
            label: 'payments.government.motorVehiclesServices.vehicleSequenceNumber',
            required: true,
            value: '',
            validators: [{ validation: ValidationsEnum.MAX_LENGTH, options: "9" }],
            validationLabels: { required: 'payments.government.validations.vehicleSequenceNumber' },

          },
          {
            key: 'newVehicleRegistrationType',
            title: 'New Vehicle Registration Type',
            label: 'payments.government.motorVehiclesServices.newVehicleRegistrationType',
            type: 'select',
            required: true,
            value: '',
            validators: [],
            validationLabels: { required: 'payments.government.validations.newVehicleRegistrationType' },

            select_combo_key: 'eGovVehicleRegistrationType',

          },
          {
            key: 'vehicleBodyType',
            title: 'Vehicle Body Type',
            label: 'payments.government.motorVehiclesServices.vehicleBodyType',
            type: 'select-dep',
            required: true,
            value: '',
            validators: [],
            validationLabels: { required: 'payments.government.validations.vehicleBodyType' },

            select_combo_key: 'eGovVehicleBodyType',
            select_dependent: true,
            select_parent: 'newVehicleRegistrationType',
            select_combo_key_by_parent_value: 'eGovVehicleBodyType',

          },
        ],
      },
      //-------------------------------------------
      '042': {
        key: '042',
        title: 'Register Vehicle',
        controls: [
          {
            key: 'newOwnerId',
            title: 'New Owner Id',
            label: 'payments.government.motorVehiclesServices.newOwnerId',
            required: true,
            value: '',
            validators: [
              { validation: ValidationsEnum.MIN_LENGTH, options: "10" },
              { validation: ValidationsEnum.MAX_LENGTH, options: "10" },
              { validation: ValidationsEnum.DIGIT_ONLY },
            ],
            validationLabels: { required: 'payments.government.validations.vehicleBodyType' },

          },
          {
            key: 'vehicleCustomCardNumber',
            title: 'Vehicle Custom Card Number',
            label: 'payments.government.motorVehiclesServices.vehicleCustomCardNumber',
            required: true,
            value: '',
            validators: [{ validation: ValidationsEnum.MAX_LENGTH, options: "10" }],
            validationLabels: { required: 'payments.government.validations.vehicleCustomCardNumber' },

          },
          {
            key: 'newVehicleRegistrationType',
            title: 'New Vehicle Registration Type',
            label: 'payments.government.motorVehiclesServices.newVehicleRegistrationType',
            type: 'select',
            required: true,
            value: '',
            validators: [],
            validationLabels: { required: 'payments.government.validations.newVehicleRegistrationType' },

            select_combo_key: 'eGovVehicleRegistrationType',

          },
          {
            key: 'vehicleBodyType',
            title: 'Vehicle Body Type',
            label: 'payments.government.motorVehiclesServices.vehicleBodyType',
            type: 'select-dep',
            required: true,
            value: '',
            validators: [],
            validationLabels: { required: 'payments.government.validations.vehicleBodyType' },

            select_combo_key: 'eGovVehicleBodyType',
            select_dependent: true,
            select_parent: 'newVehicleRegistrationType',
            select_combo_key_by_parent_value: 'eGovVehicleBodyType',

          },
          {
            key: 'licensePlateWithLogo',
            title: 'License Plate WithLogo',
            label: 'payments.government.motorVehiclesServices.licensePlateWithLogo',
            type: 'select',
            required: true,
            value: '',
            validators: [],
            validationLabels: { required: 'payments.government.validations.licensePlateWithLogo' },

            select_combo_key: 'eGovLicensePlatewithLogo',
            widget: '',
            widget_container_class: 'col-xs-12 col-sm-6',
            widget_container_init_row: false,
            widget_container_end_row: false,
          },
        ],
      },
      //-------------------------------------------
      '043': {
        key: '043',
        title: 'Re-import-Vehicle',
        controls: [
          {
            key: 'newOwnerId',
            title: 'New Owner Id',
            label: 'payments.government.motorVehiclesServices.newOwnerId',
            required: true,
            value: '',
            validators: [
              { validation: ValidationsEnum.MIN_LENGTH, options: "10" },
              { validation: ValidationsEnum.MAX_LENGTH, options: "10" },
              { validation: ValidationsEnum.DIGIT_ONLY },
            ],
            validationLabels: { required: 'payments.government.validations.newOwnerId' },

          },
          {
            key: 'vehicleCustomCardNumber',
            title: 'Vehicle Custom Card Number',
            label: 'payments.government.motorVehiclesServices.vehicleCustomCardNumber',
            required: true,
            value: '',
            validators: [{ validation: ValidationsEnum.MAX_LENGTH, options: "10" }],
            validationLabels: { required: 'payments.government.validations.vehicleCustomCardNumber' },

          },
          {
            key: 'newVehicleRegistrationType',
            title: 'New Vehicle Registration Type',
            label: 'payments.government.motorVehiclesServices.newVehicleRegistrationType',
            type: 'select',
            required: true,
            value: '',
            validators: [],
            validationLabels: { required: 'payments.government.validations.newVehicleRegistrationType' },

            select_combo_key: 'eGovVehicleRegistrationType',

          },
          {
            key: 'vehicleBodyType',
            title: 'Vehicle Body Type',
            label: 'payments.government.motorVehiclesServices.vehicleBodyType',
            type: 'select-dep',
            required: true,
            value: '',
            validators: [],
            validationLabels: { required: 'payments.government.validations.vehicleBodyType' },

            select_combo_key: 'eGovVehicleBodyType',
            select_dependent: true,
            select_parent: 'newVehicleRegistrationType',
            select_combo_key_by_parent_value: 'eGovVehicleBodyType',

          },
        ],
      },
      //-------------------------------------------
    },
  },
  //-------------------------------------------------------------------
  '093': {
    key: '093',
    apiKey: 'TrafficViolations',
    title: 'Traffic Violations',
    applicationsTypes: {
      //-------------------------------------------
      '040': {
        key: '040',
        title: 'Query Violations By Civilian Id',
        controls: [
          {
            key: 'violatorId',
            title: 'Violator Id',
            label: 'payments.government.civilDefenseViolationsServices.violatorId',
            required: true,
            value: '',
            validators: [
              { validation: ValidationsEnum.MAX_LENGTH, options: "10" }
            ],
            validationLabels: { required: 'payments.government.validations.violatorId' },

          },
          // todo no son necesarios, pero el API los requiere, los ponemos hidden
          {
            key: 'violationId',
            title: 'Violation Id',
            label: 'payments.government.trafficViolationsServices.violationId',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: []
          },
        ],
      },
      //-------------------------------------------
      '041': {
        key: '041',
        title: 'Query Traffic Violation',
        controls: [
          {
            key: 'violationId',
            title: 'Violation Id',
            label: 'payments.government.trafficViolationsServices.violationId',
            required: true,
            value: '',
            validators: [
              { validation: ValidationsEnum.MAX_LENGTH, options: "10" }
            ],
            validationLabels: { required: 'payments.government.validations.violationId' },

          },
          {
            key: 'violatorId',
            title: 'Violator Id',
            label: 'payments.government.trafficViolationsServices.violatorId',
            type: 'text',
            required: true,
            value: '',
            validators: [
              { validation: ValidationsEnum.MAX_LENGTH, options: "10" }
            ],
            validationLabels: { required: 'payments.government.validations.violatorId' },

          },
        ],
      },
      //-------------------------------------------
    },
  },
  //-------------------------------------------------------------------
  '126': {
    key: '126',
    apiKey: 'PublicViolation',
    title: 'Public Violation',
    applicationsTypes: {
      //-------------------------------------------
      '060': {
        key: '060',
        title: 'Pay by Violator ID for a Specific Category',
        controls: [
          {
            key: 'violatorId',
            title: 'Violator Id',
            label: 'payments.government.publicViolation.violatorId',
            type: 'text',
            required: true,
            value: '',
            validators: [
              { validation: ValidationsEnum.MAX_LENGTH, options: "10" }
            ],
            validationLabels: { required: 'payments.government.validations.violatorId' },

          },
          {
            key: 'issuingEntity',
            title: 'Issuing Entity',
            label: 'payments.government.publicViolation.issuingEntity',
            type: 'select',
            required: true,
            value: '',
            validators: [],
            validationLabels: { required: 'payments.government.validations.issuingEntity' },

            select_combo_key: 'eGovViolationsIssuingEntity',
            widget: '',
            widget_container_class: 'col-xs-12 col-sm-8',
            widget_container_init_row: false,
            widget_container_end_row: false,
          },
          {
            key: 'category',
            title: 'Category',
            label: 'payments.government.publicViolation.category',
            type: 'select-dep',
            required: true,
            value: '',
            validators: [],
            validationLabels: { required: 'payments.government.validations.category' },

            select_combo_key: 'eGovCategory',
            select_dependent: true,
            select_parent: 'issuingEntity',
            select_combo_key_by_parent_value: 'eGovCategory',
            widget: '',
            widget_container_class: 'col-xs-12 col-sm-8',
            widget_container_init_row: false,
            widget_container_end_row: false,
          },
        ],
      },
    },
  },
}
