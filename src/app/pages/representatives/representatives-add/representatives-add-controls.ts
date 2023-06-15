import {ButtonControl} from 'app/@core/model/dto/control/button-control';
import {DateControl} from 'app/@core/model/dto/control/date-control';
import {NumberInputControl} from 'app/@core/model/dto/control/number-input-control';
import {PhoneControl} from 'app/@core/model/dto/control/phone-control';
import {SelectionGroupControl} from 'app/@core/model/dto/control/selection-group-control';
import {TableControl} from 'app/@core/model/dto/control/table-control';
import {TextControl} from 'app/@core/model/dto/control/text-control';
import {TextInputControl} from 'app/@core/model/dto/control/text-input-control';
import {TitleControl} from 'app/@core/model/dto/control/title-control';
import {UploadControl} from 'app/@core/model/dto/control/upload-control';
import {FormModel} from 'app/@core/model/dto/formModel';
import {ValidationsEnum} from 'app/@core/model/dto/validations-enum';
import {Account} from 'app/@core/model/rest/common/account';
import {AccountAuth} from 'app/@core/model/rest/representatives/representatives-req.model';
import {TableHeaderType} from 'arb-design-library';
import {ButtonModel} from 'arb-design-library/model/button.model';
import {SelectionGroupModel} from 'arb-design-library/model/selection-group.model';
import {TableHeaderModel} from 'arb-design-library/model/table-header.model';
import {Utils} from "../../../@core/utility/Utils";

export function infoDocForm(): FormModel {
  return new FormModel({
    id: 'infoDocForm',
    controls: {
      representativesInformation: new TitleControl({
        columnCount: 12,
        order: 1,
        controlOptions: {
          id: 'representativesInformation',
          title: 'representatives.add.representatives-information',
        },
      }),
      firstName: new TextInputControl({
        order: 2,
        columnCount: 6,
        required: true,
        label: 'representatives.add.first-name',
        value: '',
        validationLabels: {
          required: Utils.translateWithParams(
            'public.is-required',
            {field: 'representatives.add.first-name'}
          ),
        },
      }),
      middleName: new TextInputControl({
        order: 3,
        columnCount: 6,
        required: false,
        label: 'representatives.add.middle-name',
        value: '',
      }),
      paternalName: new TextInputControl({
        order: 4,
        columnCount: 6,
        required: false,
        label: 'representatives.add.paternal-name',
        value: '',
      }),
      lastName: new TextInputControl({
        order: 5,
        columnCount: 6,
        required: true,
        label: 'representatives.add.last-name',
        value: '',
        validationLabels: {
          required: Utils.translateWithParams(
            'public.is-required',
            {field: 'representatives.add.last-name'}
          ),
        },
      }),
      phoneNumber: new PhoneControl({
        order: 6,
        columnCount: 6,
        required: true,
        validators: [{validation: ValidationsEnum.MOBILE_NUMBER}],
        label: 'representatives.add.phone-number',
        value: '',
        validationLabels: {
          required: 'transfer.mobile-format',
          pattern: 'transfer.mobile-format',
        },
        controlOptions: {
          phonePrefix: '+966',
        },
      }),
      birthDate: new DateControl({
        order: 7,
        columnCount: 6,
        label: 'representatives.add.birth-date',
        required: true,
        controlOptions: {
          disableSelectToday: true
        },
        validationLabels: {
          required: Utils.translateWithParams(
            'public.is-required',
            {field: 'representatives.add.birth-date'}
          ),
        },
      }),
      documentInfo: new TitleControl({
        order: 8,
        columnCount: 12,
        controlOptions: {
          id: 'documentInfo',
          title: 'representatives.add.document-information',
        },
      }),
      idNumber: new NumberInputControl({
        order: 9,
        columnCount: 6,
        required: true,
        validators: [
          {validation: ValidationsEnum.DIGIT_ONLY},
          {validation: ValidationsEnum.SA_ID_NUMBER},
        ],
        label: 'representatives.add.id-number',
        value: '',
        validationLabels: {
          required: Utils.translateWithParams(
            'public.is-required',
            {field: 'representatives.add.id-number'}
          ),
        },
      }),
      issuedBy: new TextInputControl({
        order: 10,
        columnCount: 6,
        required: true,
        label: 'representatives.add.issued-by',
        value: '',
        validationLabels: {
          required: Utils.translateWithParams(
            'public.is-required',
            {field: 'representatives.add.issued-by'}
          ),
        },
      }),
      issueDate: new DateControl({
        order: 11,
        label: 'representatives.add.issue-date',
        required: true,
        columnCount: 6,
        validationLabels: {
          required: Utils.translateWithParams(
            'public.is-required',
            {field: 'representatives.add.issue-date'}
          ),
        },
      }),
      expiryDate: new DateControl({
        order: 12,
        label: 'representatives.add.expiry-date',
        required: true,
        columnCount: 6,
        validationLabels: {
          required: Utils.translateWithParams(
            'public.is-required',
            {field: 'representatives.add.expiry-date'}
          ),
        },
      }),
    },
  });
}

export function repAuthAccForm(
  accounts: Account[] | AccountAuth[],
  currencyIso: Object
): FormModel {
  return new FormModel({
    id: 'repAuthAccForm',
    controls: {
      accounts: new TableControl({
        order: 2,
        required: true,
        columnCount: 12,
        controlOptions: {
          headers: getAccHeaders(currencyIso),
          data: accounts,
          hasCheckbox: true,
          columnId: 'accountPk',
          title: 'representatives.add.authorized-accounts'
        },
      }),
    },
  });
}

export function powersForm(powers: SelectionGroupModel[]): FormModel {
  return new FormModel({
    id: 'powersForm',
    controls: {
      repPower: new TitleControl({
        order: 1,
        columnCount: 12,
        controlOptions: {
          id: 'representativePower',
          title: 'representatives.add.representative-power',
        },
      }),
      from: new DateControl({
        order: 2,
        columnCount: 6,
        label: 'representatives.add.validity-period-from',
        required: true,
        value: {
          day: new Date().getUTCDate(),
          month: new Date().getUTCMonth() + 1,
          year: new Date().getUTCFullYear(),
        },
        disable: true,
      }),
      to: new DateControl({
        order: 3,
        columnCount: 6,
        label: 'representatives.add.validity-period-to',
        required: true,
        validationLabels: {
          required: Utils.translateWithParams(
            'public.is-required',
            {field: 'representatives.add.validity-period-to'}
          ),
        },
      }),
      titlePowers: new TitleControl({
        order: 4,
        columnCount: 12,
        controlOptions: {
          id: 'representativeTitle',
          title: 'representatives.add.power-selection',
        },
      }),
      powers: new SelectionGroupControl({
        order: 5,
        columnCount: 12,
        required: true,
        controlOptions: {
          id: 'powers',
          title: 'representatives.add.select-all',
          items: powers,
        },
      }),
    },
  });
}

export function signForm(): FormModel {
  return new FormModel({
    id: 'signForm',
    controls: {
      uplTit: new TitleControl({
        order: 5,
        columnCount: 12,
        controlOptions: {
          id: 'uplTit',
          title: 'representatives.add.upload-title',
        },
      }),
      buttonTit: new TitleControl({
        order: 6,
        columnCount: 12,
        controlOptions: {
          id: 'uplTit',
          type: 'Section',
          title: 'representatives.add.download-title',
          endButtons: [downloadButton],
        },
      }),
      img: new UploadControl({
        order: 7,
        columnCount: 12,
        value: '',
        label: 'representatives.add.upload-file',
        required: true,
        controlOptions: {
          acceptedTypes: ['.png', '.jpg'],
        },
        validationLabels: {
          required: Utils.translateWithParams(
            'public.is-required',
            {field: 'representatives.add.upload-file'}
          ),
        },
      }),
      NoteTit: new TitleControl({
        order: 8,
        columnCount: 12,
        controlOptions: {
          id: 'uplTit',
          title: '',
          subTitle: 'representatives.add.uploadHint',
        },
      }),
    },
  });
}

export const getAccHeaders = (currencyIso: Object): TableHeaderModel[] => {
  return [
    {
      type: TableHeaderType.TEXT,
      title: 'accounts.accountNum',
      fieldName: 'fullAccountNumber',
    },

    {
      type: TableHeaderType.TEXT,
      title: 'accounts.acc-name',
      fieldName: 'alias',
    },
    {
      type: TableHeaderType.TEXT,
      title: 'accounts.amount',
      fieldName: 'availableBalance',
    },
    {
      type: TableHeaderType.TEXT,
      title: 'accounts.currency',
      fieldName: 'currency',
      mapObject: currencyIso,
    },
  ];
};

export function deleteForm(): FormModel {
  return new FormModel({
    id: 'fromAccountForm',
    controls: {
      title: new TextControl({
        order: 1,
        columnCount: 12,
        label: 'representatives.delete.sure',
        class: 'color-arb-primaryText font-h2-bold',
      }),
      subTitle: new TextControl({
        order: 2,
        columnCount: 12,
        label: 'representatives.delete.permanently',
        class: 'color-arb-primaryText font-h2-light',
      }),
      cancelButton: new ButtonControl({
        order: 3,
        columnCount: 6,
        controlOptions: {
          id: 'cancel',
          type: 'secondary',
          text: 'public.cancel',
        },
      }),
      deleteButton: new ButtonControl({
        order: 4,
        columnCount: 6,
        controlOptions: {
          id: 'delete',
          type: 'primary',
          text: 'representatives.delete.delete',
        },
      }),
    },
  });
}

export const getEndButtons = (): ButtonModel[] => {
  return [
    {
      id: 'goToDashboard',
      type: 'secondary',
      text: 'public.go-to-dashboard',
    },
    {
      id: 'goToRepresentatives',
      type: 'primary',
      text: 'representatives.add.go-to-representatives',
    },
  ];
};

export const cancelButton: ButtonModel = {
  id: 'Cancel',
  text: 'public.cancel',
  type: 'secondary',
};
export const downloadButton: ButtonModel = {
  id: 'Download',
  text: 'public.download',
  type: 'secondary',
  prefixIcon: 'arb-icon-arrowDownBox',
};
