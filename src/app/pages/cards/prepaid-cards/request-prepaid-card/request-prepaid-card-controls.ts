import {ValidationsEnum} from 'app/@core/model/dto/validations-enum';
import {ButtonModel} from 'arb-design-library/model/button.model';
import {SummaryItemControl} from 'app/@core/model/dto/control/sumery-item-control';
import {FormControlModel, FormModel} from 'app/@core/model/dto/formModel';
import {TitleControl} from 'app/@core/model/dto/control/title-control';
import {EmptyControl} from 'app/@core/model/dto/control/empty-control';
import {DropdownControl} from 'app/@core/model/dto/control/dropdown-control';
import {TextInputControl} from 'app/@core/model/dto/control/text-input-control';
import {DividerControl} from 'app/@core/model/dto/control/divider-control';
import {CalenderType, DateControl} from 'app/@core/model/dto/control/date-control';
import {UploadControl} from 'app/@core/model/dto/control/upload-control';
import {SelectionControl} from 'app/@core/model/dto/control/selection-control';
import {Utils} from "../../../../@core/utility/Utils";
import { FormControl } from '@angular/forms';
import { ControlBase } from 'app/@core/model/dto/control/control.model';

export const cardRequesterList = [
  {
    value: 'owner',
    text: 'cards.new-card.owner',
  },
  {
    value: 'employee',
    text: 'cards.new-card.employee',
  },
];

export const gender = [
  {
    key: 'F',
    value: 'cards.new-card.female',
  },
  {
    key: 'M',
    value: 'cards.new-card.male',
  },
];

export const editAccoutButton: ButtonModel = {
  id: 'edit-account-btn',
  text: 'public.edit',
  type: 'secondary',
};

export function selectAccountForm() {
  return new FormModel({
    id: 'selectAccountFrom',
    controls: {
      cardDetailsForm: new TitleControl({
        columnCount: 12,
        order: 1,
        controlOptions: {
          id: '',
          title: 'cards.new-card.card-details',
        },
      }),
      linkedAccount: new DropdownControl({
        label: 'cards.new-card.linked-account',
        hidden: false,
        required: true,
        order: 2,
        controlOptions: {columnId: "key", textField: 'value'},
        columnCount: 6,
        validationLabels: {
          required: Utils.translateWithParams(
            'public.is-required',
            {field: 'cards.new-card.linked-account'}
          ),
        },
      }),
      cardRequester: new DropdownControl({
        label: 'cards.new-card.card-requester',
        hidden: false,
        required: true,
        order: 3,
        controlOptions: {columnId: "value", textField: 'text'},
        columnCount: 6,
        validationLabels: {
          required: Utils.translateWithParams(
            'public.is-required',
            {field: 'cards.new-card.card-requester'}
          ),
        },
      }),
      empty: new EmptyControl({
        columnCount: 12,
        order: 4,
      }),
    },
  });
}

function accountSelectionSummaryControls() {
  return {
    requestInformationTitle: new TitleControl({
      columnCount: 12,
      order: 1,
      controlOptions: {
        id: '',
        title: 'cards.new-card.request-information',
        endButtons: [editAccoutButton],
      },
    }),
    linkedAccountSummary: new SummaryItemControl({
      columnCount: 6,
      order: 2,
      label: 'cards.new-card.linked-account',
      value: '',
    }),
    cardRequesterSummary: new SummaryItemControl({
      columnCount: 6,
      order: 3,
      label: 'cards.new-card.card-requester',
      value: '',
    }),
    divider: new DividerControl({
      columnCount: 12,
      order: 4,
    }),
  };
}

function companyEmbossingNameControls() {
  return {
    documentInformationTile: new TitleControl({
      columnCount: 12,
      order: 5,
      controlOptions: {
        id: '',
        title: 'cards.new-card.document-information',
      },
    }),
    companyEmbName: new TextInputControl({
      label: 'cards.new-card.company-emb-name',
      required: true,
      order: 6,
      columnCount: 6,
      value: '',
      validationLabels: {
        required: Utils.translateWithParams(
          'public.is-required',
          {field: 'cards.new-card.company-emb-name'}
        )
      },
    }),
  };
}

function basicRequesterInformationControls(hasMissingData = true,ownerDetails?:any) : FormControlModel<ControlBase<any>>{
  let obj:any={}
  if (hasMissingData) {
     obj = {
      applicationDetailsTitle: new TitleControl({
        columnCount: 12,
        order: 7,
        controlOptions: {
          id: '',
          title: 'cards.new-card.appication-details',
        },
      }),
      ...(!ownerDetails?.nationalId&&{nationalId: new TextInputControl({
        label: 'cards.new-card.nation-id-iqama',
        required: true,
        order: 8,
        columnCount: 6,
        value: '',
        validators: [{validation: ValidationsEnum.NATIONALID}],
        validationLabels: {
          required: Utils.translateWithParams(
            'public.is-required',
            {field: 'cards.new-card.nation-id-iqama'}
          ),
          pattern: Utils.translateWithParams(
            'public.invalid-pattern',
            {field: 'cards.new-card.nation-id-iqama'}
          ),
        },
      })}),
      'new-line': new EmptyControl({
        columnCount: 12,
        order: 9,
      }),
      ...(!ownerDetails?.firstName&&{cardFName: new TextInputControl({
        label: 'cards.new-card.holder-fname',
        required: true,
        order: 10,
        columnCount: 6,
        value: '',
        validationLabels: {
          required: Utils.translateWithParams(
            'public.is-required',
            {field: 'cards.new-card.holder-fname'}
          ),
        },
      })}),
      ...(!ownerDetails?.lastName&&{cardLName: new TextInputControl({
        label: 'cards.new-card.holder-lname',
        required: true,
        order: 11,
        columnCount: 6,
        value: '',
        validationLabels: {
          required: Utils.translateWithParams(
            'public.is-required',
            {field: 'cards.new-card.holder-lname'}
          ),
        },
      })}),
      ...(!ownerDetails?.birthDate&&{birthDate: new DateControl({
        label: 'cards.new-card.birth-date',
        required: true,
        order: 12,
        columnCount: 6,
        value: '',
        controlOptions: {
          minDate:{
            day:1,
            month:1,
            year:1900
          },
          displayPattern: "dd/MM/yyyy",
          type: CalenderType.GREGORIAN,
        },
        validationLabels: {
          required: Utils.translateWithParams(
            'public.is-required',
            {field: 'cards.new-card.birth-date'}
          ),
        },
      })}),
      ...(!ownerDetails?.gender&&{gender: new DropdownControl({
        label: 'cards.new-card.gender',
        hidden: false,
        required: true,
        order: 13,
        controlOptions: {textField: 'value', columnId: "key",},
        columnCount: 6,
        validationLabels: {
          required: Utils.translateWithParams(
            'public.is-required',
            {field: 'cards.new-card.gender'}
          ),
        },
      })}),
      ...(!ownerDetails?.nationality&&{nationality: new DropdownControl({
        label: 'cards.new-card.nationality',
        hidden: false,
        required: true,
        order: 14,
        controlOptions: {columnId: "key", textField: 'value'},
        columnCount: 6,
        validationLabels: {
          required: Utils.translateWithParams(
            'public.is-required',
            {field: 'cards.new-card.nationality'}
          ),
        },
      })}),
      ...(!ownerDetails?.city&&{city: new DropdownControl({
        label: 'cards.new-card.city',
        hidden: false,
        required: true,
        order: 15,
        controlOptions: {columnId: "key", textField: 'value'},
        columnCount: 6,
        validationLabels: {
          required: Utils.translateWithParams(
            'public.is-required',
            {field: 'cards.new-card.city'}
          ),
        },
      })}),
      ...(!ownerDetails?.mobileNumber&&{mobileNumber: new TextInputControl({
        label: 'cards.new-card.mobile-number',
        required: true,
        order: 16,
        columnCount: 6,
        value: '',
        validators: [{validation: ValidationsEnum.MOBILE_NUMBER_WITH_05}],
        validationLabels: {
          required: Utils.translateWithParams(
            'public.is-required',
            {field: 'cards.new-card.mobile-number'}
          ),
          pattern: Utils.translateWithParams(
            'public.invalid-pattern',
            {field: 'cards.new-card.mobile-number'}
          ),
        },
      })}),
    };
  }

  return obj
}

function ownerAttachmentsControls() {
  return {
    empty: new EmptyControl({
      columnCount: 12,
      order: 17,
    }),
    companyRegistrationDoc: new UploadControl({
      columnCount: 6,
      order: 18,
      value: '',
      label: 'cards.new-card.company-registration-document',
      required: true,
      validationLabels: {
        required: Utils.translateWithParams(
          'public.is-required',
          {field: 'cards.new-card.company-registration-document'}
        )
      },
    }),
    'empty-end': new EmptyControl({
      columnCount: 12,
      order: 20,
    }),
  };
}

function employeeAttachmentsControls() {
  return {
    empty: new EmptyControl({
      columnCount: 12,
      order: 17,
    }),
    idDocument: new UploadControl({
      columnCount: 6,
      order: 18,
      value: '',
      label: 'cards.new-card.id-iqama',
      required: true,
    }),
    empCertDocument: new UploadControl({
      columnCount: 6,
      order: 19,
      value: '',
      label: 'cards.new-card.employee-cert-optional',
      required: false,
    }),
    'empty-end': new EmptyControl({
      columnCount: 12,
      order: 20,
    }),
  };
}

function termsCondtionsControls() {
  return {
    terms: new SelectionControl({
      label: 'cards.new-card.accept-terms',
      controlOptions: {
        title: [
          {
            text: 'cards.new-card.accept-terms',
            linkId: 'terms-cond',
          },
        ],
      },
      required: true,
      order: 21,
      value: true,
      columnCount: 6,
    }),
    'end-form': new EmptyControl({
      columnCount: 12,
      order: 22,
    }),
  };
}

export function documentInformationForm(
  cardRequesterType: string,
  ownerDetails?:any,
  hasMissingData?: boolean,
) {
  let controls;
  if (cardRequesterType === 'owner') {
    controls = {
      ...accountSelectionSummaryControls(),
      ...companyEmbossingNameControls(),
      ...basicRequesterInformationControls(hasMissingData,ownerDetails),
      ...ownerAttachmentsControls(),
      ...termsCondtionsControls(),
    };
  } else {
    controls = {
      ...accountSelectionSummaryControls(),
      ...companyEmbossingNameControls(),
      ...basicRequesterInformationControls(hasMissingData),
      ...employeeAttachmentsControls(),
      ...termsCondtionsControls(),
    };
  }
  return new FormModel({
    id: 'documentInformationFrom',
    controls,
  });
}
