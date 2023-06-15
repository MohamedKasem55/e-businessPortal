import { DropdownControlOptions } from 'app/@core/model/dto/control/dropdown-control';
import { AccountControlOptions } from 'app/@core/model/dto/control/account-control';
import { UploadControlOptions } from 'app/@core/model/dto/control/upload-control';
import { TextInputControlOptions } from 'app/@core/model/dto/control/text-input-control';
import { ValidationsEnum } from 'app/@core/model/dto/validations-enum';
import { PhoneControlOptions } from 'app/@core/model/dto/control/phone-control';
import { TableHeaderModel } from 'arb-design-library/model/table-header.model';
import { TableHeaderType } from 'arb-design-library';
import { TitleControlOptions } from 'app/@core/model/dto/control/title-control';

export const toAccountControl: AccountControlOptions = {
  label: 'public.account-number',
  required: true,
  order: 3,
  value: null,
  columnCount: 6,
  validationLabels: {required: 'transfer.account-is-required'},
};

export const requestTypeControl: DropdownControlOptions = {
  label: 'pos.new-request.request-type',
  hidden: false,
  required: true,
  order: 4,
  controlOptions: { textField: 'value', columnId: 'key' },
  columnCount: 6,
  validationLabels: {
    required: 'pos.new-request.errors.request-type-required',
  },
};

export const cityControl: DropdownControlOptions = {
  label: 'pos.new-request.city',
  hidden: false,
  required: true,
  order: 5,
  controlOptions: { textField: 'value', columnId: 'key', hasSearch: true },
  columnCount: 6,
  validationLabels: { required: 'pos.new-request.errors.city-required' },
};

export const contactNameControl: TextInputControlOptions = {
  label: 'pos.new-request.contact-name',
  hidden: false,
  required: false,
  value: '',
  order: 6,
  columnCount: 6,
};

export const phoneNumberControl: PhoneControlOptions = {
  label: 'pos.new-request.phone-number',
  hidden: false,
  required: true,
  value: '',
  order: 7,
  columnCount: 6,
  validators: [{ validation: ValidationsEnum.MOBILE_NUMBER }],
  controlOptions: { phonePrefix: '+966' },
  validationLabels: {
    required: 'pos.new-request.errors.phone-number-required',
    pattern: 'pos.new-request.errors.phone-number-invalid',
    maxLength: 'help.mobile-max-length',
    translateOptions: { '0': '9' },
  },
};

export const uploadFileControl: UploadControlOptions = {
  label: 'pos.new-request.upload-file',
  hidden: false,
  required: true,
  value: '',
  controlOptions: { acceptedTypes: ['.jpeg'], maxSizeKB: 5120 },
  order: 8,
  columnCount: 6,
  validationLabels: { required: 'pos.new-request.errors.upload-file-required' },
};

export const requestStatus: TitleControlOptions = {
  order: 1,
  columnCount: 12,
  controlOptions: {
    id: 'requestStatusTitle',
    endButtons: [
      {
        id: 'requestStatus',
        type: 'primary',
        text: 'pos.new-request.request-status.title',
        isDisable: false,
      },
    ],
  },
};

export const AuthLevelSummaryHeaders = (
  status: { key: string; value: string }[]
): TableHeaderModel[] => {
  return [
    {
      title: 'pos.new-request.user-level',
      type: TableHeaderType.TEXT,
      fieldName: 'userLevel',
    },
    {
      title: 'pos.new-request.status',
      type: TableHeaderType.TEXT,
      fieldName: 'status',
      mapObject: status,
    },
    {
      title: 'pos.new-request.user-id',
      type: TableHeaderType.TEXT,
      fieldName: 'userId',
    },
    {
      title: 'pos.new-request.date-time',
      type: TableHeaderType.TEXT,
      fieldName: 'dateTime',
    },
  ];
};
