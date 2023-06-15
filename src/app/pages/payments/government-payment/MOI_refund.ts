import { ValidationsEnum } from "../../../@core/model/dto/validations-enum";


export const MOI_REFUNDS_FORMS_FIELDS_CONFIGS: any = {
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
          // todo all are not necessary, but the API requires them, we put them hidden
          {
            key: 'numberOfVisas',
            title: 'Number of Visas',
            label: 'payments.government.visaServices.numberOfVisas',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: [],
            order: 4,
            isDisable: false
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
          // todo all are not necessary, but the API requires them, we put them hidden
          {
            key: 'numberOfVisas',
            title: 'Number of Visas',
            label: 'payments.government.visaServices.numberOfVisas',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: [],
            isDisable: false
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
          // todo all are not necessary, but the API requires them, we put them hidden
          {
            key: 'passportType',
            title: 'Passport Type',
            label: 'payments.government.saudiPassportServices.passportType',
            hidden: true,
            isDisable: false,
            required: false,
            value: '0000000000',
            validators: []
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
          // todo all are not necessary, but the API requires them, we put them hidden
          {
            key: 'passportType',
            title: 'Passport Type',
            label: 'payments.government.saudiPassportServices.passportType',
            hidden: true,
            isDisable: false,
            required: false,
            value: '0000000000',
            validators: []
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
          // todo all are not necessary, but the API requires them, we put them hidden
          {
            key: 'passportType',
            title: 'Passport Type',
            label: 'payments.government.saudiPassportServices.passportType',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: []
          },
          {
            key: 'passportDuration',
            title: 'Passport Duration',
            label: 'payments.government.saudiPassportServices.passportDuration',
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
          // todo all are not necessary, but the API requires them, we put them hidden
          {
            key: 'licenseType',
            title: 'License Type',
            label: 'payments.government.drivingLicenseServices.licenseType',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: []
          },
          {
            key: 'licenseDuration',
            title: 'License Duration',
            label: 'payments.government.drivingLicenseServices.licenseDuration',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: []
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
          // todo all are not necessary, but the API requires them, we put them hidden
          {
            key: 'licenseType',
            title: 'License Type',
            label: 'payments.government.drivingLicenseServices.licenseType',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: []
          },
          {
            key: 'licenseDuration',
            title: 'License Duration',
            label: 'payments.government.drivingLicenseServices.licenseDuration',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: []
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
          // todo all are not necessary, but the API requires them, we put them hidden
          {
            key: 'licenseType',
            title: 'License Type',
            label: 'payments.government.drivingLicenseServices.licenseType',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: []
          },
          {
            key: 'licenseDuration',
            title: 'License Duration',
            label: 'payments.government.drivingLicenseServices.licenseDuration',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: []
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
          // todo all are not necessary, but the API requires them, we put them hidden
          {
            key: 'licenseType',
            title: 'License Type',
            label: 'payments.government.drivingLicenseServices.licenseType',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: []
          },
          {
            key: 'licenseDuration',
            title: 'License Duration',
            label: 'payments.government.drivingLicenseServices.licenseDuration',
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
          // todo all are not necessary, but the API requires them, we put them hidden
          {
            key: 'birthDate',
            title: 'Birth Date',
            label: 'payments.government.civilRegistrationServices.birthDate',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: []
          },
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
          // todo all are not necessary, but the API requires them, we put them hidden
          {
            key: 'deathDate',
            title: 'Death Date',
            label: 'payments.government.civilRegistrationServices.deathDate',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: []
          },
          {
            key: 'issuanceReason',
            title: 'Issuance Reasons',
            label: 'payments.government.civilDefenseViolationsServices.issuanceReason',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: [],
            widget: '',
            widget_container_class: 'hidden',
            widget_container_init_row: false,
            widget_container_end_row: false,
          },
          {
            key: 'cardVersionNumber',
            title: 'Card Version Number',
            label: 'payments.government.civilDefenseViolationsServices.cardVersionNumber',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: [],
            widget: '',
            widget_container_class: 'hidden',
            widget_container_init_row: false,
            widget_container_end_row: false,
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
            widget: '',
            widget_container_class: 'col-xs-12 col-sm-3',
            widget_container_init_row: false,
            widget_container_end_row: false,
          },
          // todo all are not necessary, but the API requires them, we put them hidden
          {
            key: 'marriageDate',
            title: 'Marriage Date',
            label: 'payments.government.civilRegistrationServices.marriageDate',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: [],
            widget: '',
            widget_container_class: 'hidden',
            widget_container_init_row: false,
            widget_container_end_row: false,
          },
          {
            key: 'issuanceReason',
            title: 'Issuance Reasons',
            label: 'payments.government.civilDefenseViolationsServices.issuanceReason',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: [],
            widget: '',
            widget_container_class: 'hidden',
            widget_container_init_row: false,
            widget_container_end_row: false,
          },
          {
            key: 'cardVersionNumber',
            title: 'Card Version Number',
            label: 'payments.government.civilDefenseViolationsServices.cardVersionNumber',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: [],
            widget: '',
            widget_container_class: 'hidden',
            widget_container_init_row: false,
            widget_container_end_row: false,
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
            widget: '',
            widget_container_class: 'col-xs-12 col-sm-3',
            widget_container_init_row: false,
            widget_container_end_row: false,
          },
          // todo all are not necessary, but the API requires them, we put them hidden
          {
            key: 'divorceDate',
            title: 'Divorce Date',
            label: 'payments.government.civilRegistrationServices.divorceDate',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: [],
            widget: '',
            widget_container_class: 'hidden',
            widget_container_init_row: false,
            widget_container_end_row: false,
          },
          {
            key: 'issuanceReason',
            title: 'Issuance Reasons',
            label: 'payments.government.civilDefenseViolationsServices.issuanceReason',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: [],
            widget: '',
            widget_container_class: 'hidden',
            widget_container_init_row: false,
            widget_container_end_row: false,
          },
          {
            key: 'cardVersionNumber',
            title: 'Card Version Number',
            label: 'payments.government.civilDefenseViolationsServices.cardVersionNumber',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: [],
            widget: '',
            widget_container_class: 'hidden',
            widget_container_init_row: false,
            widget_container_end_row: false,
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
            widget: '',
            widget_container_class: 'col-xs-12 col-sm-3',
            widget_container_init_row: false,
            widget_container_end_row: false,
          },
          // todo all are not necessary, but the API requires them, we put them hidden
          {
            key: 'issuanceReason',
            title: 'Issuance Reasons',
            label: 'payments.government.civilDefenseViolationsServices.issuanceReason',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: [],
            widget: '',
            widget_container_class: 'hidden',
            widget_container_init_row: false,
            widget_container_end_row: false,
          },
          {
            key: 'cardVersionNumber',
            title: 'Card Version Number',
            label: 'payments.government.civilDefenseViolationsServices.cardVersionNumber',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: [],
            widget: '',
            widget_container_class: 'hidden',
            widget_container_init_row: false,
            widget_container_end_row: false,
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
            widget: '',
            widget_container_class: 'col-xs-12 col-sm-3',
            widget_container_init_row: false,
            widget_container_end_row: false,
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
            widget: '',
            widget_container_class: 'col-xs-12 col-sm-3',
            widget_container_init_row: false,
            widget_container_end_row: false,
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
            widget: '',
            widget_container_class: 'col-xs-12 col-sm-3',
            widget_container_init_row: false,
            widget_container_end_row: false,
          },
          // todo all are not necessary, but the API requires them, we put them hidden
          {
            key: 'borderNumber',
            title: 'Border Number',
            label: 'payments.government.expatriateServices.borderNumber',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: [],
            widget: '',
            widget_container_class: 'hidden',
            widget_container_init_row: false,
            widget_container_end_row: false,
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
            widget: '',
            widget_container_class: 'col-xs-12 col-sm-3',
            widget_container_init_row: false,
            widget_container_end_row: false,
          },
          {
            key: 'visaDuration',
            title: 'Iqama Duration',
            label: 'payments.government.expatriateServices.visaDuration',
            type: 'select',
            required: true,
            value: '',
            validators: [],
            validationLabels: { required: 'payments.government.validations.visaDuration' },
            select_combo_key: 'eGovSadadVisaDuration',
            widget: '',
            widget_container_class: 'col-xs-12 col-sm-3',
            widget_container_init_row: false,
            widget_container_end_row: false,
          },
          // todo all are not necessary, but the API requires them, we put them hidden
          {
            key: 'borderNumber',
            title: 'Border Number',
            label: 'payments.government.expatriateServices.borderNumber',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: [],
            widget: '',
            widget_container_class: 'hidden',
            widget_container_init_row: false,
            widget_container_end_row: false,
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
            widget: '',
            widget_container_class: 'col-xs-12 col-sm-3',
            widget_container_init_row: false,
            widget_container_end_row: false,
          },
          {
            key: 'visaDuration',
            title: 'Iqama Duration',
            label: 'payments.government.expatriateServices.visaDuration',
            type: 'select',
            required: true,
            value: '',
            validators: [],
            validationLabels: { required: 'payments.government.validations.visaDuration' },
            select_combo_key: 'eGovSadadVisaDuration',
            widget: '',
            widget_container_class: 'col-xs-12 col-sm-3',
            widget_container_init_row: false,
            widget_container_end_row: false,
          },
          // todo all are not necessary, but the API requires them, we put them hidden
          {
            key: 'borderNumber',
            title: 'Border Number',
            label: 'payments.government.expatriateServices.borderNumber',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: [],
            widget: '',
            widget_container_class: 'hidden',
            widget_container_init_row: false,
            widget_container_end_row: false,
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
            widget: '',
            widget_container_class: 'col-xs-12 col-sm-3',
            widget_container_init_row: false,
            widget_container_end_row: false,
          },
          // todo all are not necessary, but the API requires them, we put them hidden
          {
            key: 'visaNumber',
            title: 'Visa Number',
            label: 'payments.government.expatriateServices.visaNumber',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: [],
            widget: '',
            widget_container_class: 'hidden',
            widget_container_init_row: false,
            widget_container_end_row: false,
          },
          {
            key: 'borderNumber',
            title: 'Border Number',
            label: 'payments.government.expatriateServices.borderNumber',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: [],
            widget: '',
            widget_container_class: 'hidden',
            widget_container_init_row: false,
            widget_container_end_row: false,
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
            widget: '',
            widget_container_class: 'col-xs-12 col-sm-3',
            widget_container_init_row: false,
            widget_container_end_row: false,
          },
          // todo all are not necessary, but the API requires them, we put them hidden
          {
            key: 'borderNumber',
            title: 'Border Number',
            label: 'payments.government.expatriateServices.borderNumber',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: [],
            widget: '',
            widget_container_class: 'hidden',
            widget_container_init_row: false,
            widget_container_end_row: false,
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
            widget: '',
            widget_container_class: 'col-xs-12 col-sm-3',
            widget_container_init_row: false,
            widget_container_end_row: false,
          },
          // todo all are not necessary, but the API requires them, we put them hidden
          {
            key: 'borderNumber',
            title: 'Border Number',
            label: 'payments.government.expatriateServices.borderNumber',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: [],
            widget: '',
            widget_container_class: 'hidden',
            widget_container_init_row: false,
            widget_container_end_row: false,
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

            widget: '',
            widget_container_class: 'col-xs-12 col-sm-3',
            widget_container_init_row: false,
            widget_container_end_row: false,
          },
          // todo all are not necessary, but the API requires them, we put them hidden
          {
            key: 'iqamaDuration',
            title: 'Iqama Duration',
            label: 'payments.government.expatriateServices.iqamaDuration',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: [],
            widget: '',
            widget_container_class: 'hidden',
            widget_container_init_row: false,
            widget_container_end_row: false,
          },
          {
            key: 'sponsorId',
            title: 'Sponsor Id',
            label: 'payments.government.expatriateServices.sponsorId',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: [],
            widget: '',
            widget_container_class: 'hidden',
            widget_container_init_row: false,
            widget_container_end_row: false,
            isDisable:false
          },
          {
            key: 'jobCategory',
            title: 'Job Category',
            label: 'payments.government.expatriateServices.jobCategory',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: [],
            widget: '',
            widget_container_class: 'hidden',
            widget_container_init_row: false,
            widget_container_end_row: false,
          },
          {
            key: 'borderNumber',
            title: 'Border Number',
            label: 'payments.government.expatriateServices.borderNumber',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: [],
            widget: '',
            widget_container_class: 'hidden',
            widget_container_init_row: false,
            widget_container_end_row: false,
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
            widget: '',
            widget_container_class: 'col-xs-12 col-sm-3',
            widget_container_init_row: false,
            widget_container_end_row: false,
          },
          // todo all are not necessary, but the API requires them, we put them hidden
          {
            key: 'borderNumber',
            title: 'Border Number',
            label: 'payments.government.expatriateServices.borderNumber',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: [],
            widget: '',
            widget_container_class: 'hidden',
            widget_container_init_row: false,
            widget_container_end_row: false,
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
            widget: '',
            widget_container_class: 'col-xs-12 col-sm-3',
            widget_container_init_row: false,
            widget_container_end_row: false,
          },
          // todo all are not necessary, but the API requires them, we put them hidden
          {
            key: 'borderNumber',
            title: 'Border Number',
            label: 'payments.government.expatriateServices.borderNumber',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: [],
            widget: '',
            widget_container_class: 'hidden',
            widget_container_init_row: false,
            widget_container_end_row: false,
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
            widget: '',
            widget_container_class: 'col-xs-12 col-sm-3',
            widget_container_init_row: false,
            widget_container_end_row: false,
          },
          // todo all are not necessary, but the API requires them, we put them hidden
          {
            key: 'borderNumber',
            title: 'Border Number',
            label: 'payments.government.expatriateServices.borderNumber',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: [],
            widget: '',
            widget_container_class: 'hidden',
            widget_container_init_row: false,
            widget_container_end_row: false,
          },
        ],
      },
      //-------------------------------------------
      '013': {
        key: '013',
        title: 'Dependents Entry visa Fee Collection',
        label: 'payments.government.Dependents Entry visa Fee Collection',
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
            widget: '',
            widget_container_class: 'col-xs-12 col-sm-3',
            widget_container_init_row: false,
            widget_container_end_row: false,
          },
          // todo all are not necessary, but the API requires them, we put them hidden
          {
            key: 'numberDependent',
            title: 'Number Dependent',
            label: 'payments.government.expatriateServices.numberDependent',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: [],
            widget: '',
            widget_container_class: 'hidden',
            widget_container_init_row: false,
            widget_container_end_row: false,
          },
          {
            key: 'borderNumber',
            title: 'Border Number',
            label: 'payments.government.expatriateServices.borderNumber',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: [],
            widget: '',
            widget_container_class: 'hidden',
            widget_container_init_row: false,
            widget_container_end_row: false,
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
            widget: '',
            widget_container_class: 'col-xs-12 col-sm-3',
            widget_container_init_row: false,
            widget_container_end_row: false,
          },
          // todo all are not necessary, but the API requires them, we put them hidden
          {
            key: 'dependantHijriBirthDate',
            title: 'Birth Date',
            label: 'payments.government.expatriateServices.dependantHijriBirthDate',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: [],
            widget: '',
            widget_container_class: 'hidden',
            widget_container_init_row: false,
            widget_container_end_row: false,
          },
          {
            key: 'borderNumber',
            title: 'Border Number',
            label: 'payments.government.expatriateServices.borderNumber',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: [],
            widget: '',
            widget_container_class: 'hidden',
            widget_container_init_row: false,
            widget_container_end_row: false,
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
            widget: '',
            widget_container_class: 'col-xs-12 col-sm-3',
            widget_container_init_row: false,
            widget_container_end_row: false,
          },
          // todo all are not necessary, but the API requires them, we put them hidden
          {
            key: 'borderNumber',
            title: 'Border Number',
            label: 'payments.government.expatriateServices.borderNumber',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: [],
            widget: '',
            widget_container_class: 'hidden',
            widget_container_init_row: false,
            widget_container_end_row: false,
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
          // todo all are not necessary, but the API requires them, we put them hidden
          {
            key: 'citizenId',
            title: 'Citizen ID',
            label: 'payments.government.expatriateServices.citizenId',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: []
          },
          {
            key: 'iqamaDuration',
            title: 'Iqama Duration',
            label: 'payments.government.expatriateServices.iqamaDuration',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: []
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
          // todo all are not necessary, but the API requires them, we put them hidden
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
          // todo all are not necessary, but the API requires them, we put them hidden
          {
            key: 'associatedBorderNumber',
            title: 'Associate Iqama ID / Associate Border Number',
            label: 'payments.government.expatriateServices.associateIqamaId',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: []
          },
          {
            key: 'feesDurationEndDate',
            title: 'Fees Duration End',
            label: 'payments.government.expatriateServices.feesDurationEndDate',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: []
          },
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
          // todo all are not necessary, but the API requires them, we put them hidden
          {
            key: 'feesDurationEndDate',
            title: 'Fees Duration End',
            label: 'payments.government.expatriateServices.feesDurationEndDate',
            hidden: true,
            required: false,
            value: '0000000000',
            validators: []
          },
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
      '028': {
        key: '028',
        title: 'Re-issue Registration Card',
        controls: [
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
      '029': {
        key: '029',
        title: 'Re-issue License Plate',
        controls: [
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
      '030': {
        key: '030',
        title: 'Export Vehicle',
        controls: [
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
      '044': {
        key: '044',
        title:
          'Transfer Plates (Give plates to registered vehicle without plates)',
        controls: [
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
      '045': {
        key: '045',
        title: 'Transfer Plates (Changing Current Vehicle plate)',
        controls: [
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
      '042': {
        key: '042',
        title: 'Register Vehicle',
        controls: [
          {
            key: 'vehicleCustomCardNumber',
            title: 'Vehicle Custom Card Number',
            label: 'payments.government.motorVehiclesServices.vehicleCustomCardNumber',
            required: true,
            value: '',
            validators: [{ validation: ValidationsEnum.MAX_LENGTH, options: "10" }],
            validationLabels: { required: 'payments.government.validations.vehicleCustomCardNumber' },
          },
        ],
      },
      //-------------------------------------------
      '043': {
        key: '043',
        title: 'Re-import-Vehicle',
        controls: [
          {
            key: 'vehicleCustomCardNumber',
            title: 'Vehicle Custom Card Number',
            label: 'payments.government.motorVehiclesServices.vehicleCustomCardNumber',
            required: true,
            value: '',
            validators: [{ validation: ValidationsEnum.MAX_LENGTH, options: "10" }],
            validationLabels: { required: 'payments.government.validations.vehicleCustomCardNumber' },
          },
        ],
      },
      //-------------------------------------------
    },
  },
  //-------------------------------------------------------------------
}
